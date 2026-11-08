import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Loader2,
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  User,
  Mail,
  Phone,
  Lock,
  LogIn,
} from "lucide-react";
import { useBusinessStore } from "../../../store/useBusinessStore";
import { useBookingStore } from "../../../store/useBookingStore";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { apiFetch } from "../../../api/client";
import Card from "../components/ui/Card";
import AnimateOnScroll from "../components/AnimateOnScroll";

export default function PaymentPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { business } = useBusinessStore();
  const { service, expert, date, time, clearBooking } = useBookingStore();
  const { customer, loginWithEmail } = useCustomerAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Datos para la reserva
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Estados para el Auth Form
  const [authMode, setAuthMode] = useState("login");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setEmail(customer.email || "");
      setPhone(customer.phone || "");
    }
  }, [customer]);

  if (!service || !expert || !date) {
    return <Navigate to={`/${slug}`} replace />;
  }

  // --- 1. LÓGICA DE AUTENTICACIÓN ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === "login") {
        await loginWithEmail({ email, password, mode: "login" });
      } else {
        if (!name) throw new Error("El nombre es obligatorio");
        if (!phone)
          throw new Error("El teléfono es obligatorio para la reserva");
        if (password.length < 8)
          throw new Error("La contraseña debe tener al menos 8 caracteres");

        await loginWithEmail({
          name,
          email,
          phone,
          password,
          mode: "register",
        });
      }
    } catch (err) {
      console.error(err);
      setAuthError(err.message || "Error en el servidor. Intentá de nuevo.");
    } finally {
      setAuthLoading(false);
    }
  };

  // --- 2. LÓGICA DE RESERVA ---
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch(`/b/${slug}/appointments`, {
        method: "POST",
        body: JSON.stringify({
          serviceId: service.id,
          expertId: expert.id,
          startAt: date,
          client: {
            name: name || customer?.name,
            email: email || customer?.email,
            phone: phone || "0000000000", // Fallback por si el back lo exige
          },
        }),
      });

      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
        return;
      }

      clearBooking();
      navigate(`/${slug}?success=true`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Hubo un error al procesar la reserva.");
    } finally {
      setLoading(false);
    }
  };

  // Renderizamos el componente de Resumen
  const renderSummary = () => (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-500 mb-1">Servicio</p>
        <p className="text-lg font-bold text-slate-900">{service.name}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-1">Profesional</p>
        <p className="text-lg font-bold text-slate-900">{expert.name}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-1">Fecha y hora</p>
        <p className="text-lg font-bold text-slate-900">
          {new Date(date).toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}{" "}
          a las {time} hs
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 mt-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-slate-500">Precio total</p>
          <p className="text-xl font-bold text-slate-900">
            ${service.price.toLocaleString("es-AR")}
          </p>
        </div>
        {business?.depositMode !== "none" && (
          <div className="flex justify-between items-center text-brand">
            <p className="font-bold">Seña a pagar</p>
            <p className="text-xl font-black">
              $
              {business?.depositMode === "fixed"
                ? business.depositValue.toLocaleString("es-AR")
                : (
                    (service.price * business.depositValue) /
                    100
                  ).toLocaleString("es-AR")}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-main pb-20 pt-8 sm:pt-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate(`/${slug}/fecha`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand transition mb-8"
        >
          <ChevronLeft size={18} /> Volver
        </button>

        <AnimateOnScroll>
          <header className="mb-10">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 leading-none mb-4">
              Confirmá tu turno
            </h1>
            <p className="text-slate-500 text-lg">
              Revisá los datos y completá tu información.
            </p>
          </header>
        </AnimateOnScroll>

        <div
          className={`grid grid-cols-1 ${!customer ? "md:grid-cols-2" : "max-w-xl mx-auto"} gap-8`}
        >
          {/* TARJETA DE RESUMEN */}
          <AnimateOnScroll delay={100}>
            <Card className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 h-full flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">
                Resumen del turno
              </h3>

              <div className="flex-1">{renderSummary()}</div>

              {/* Si está logueado, el botón de pago va acá */}
              {customer && (
                <form
                  onSubmit={handleConfirmBooking}
                  className="mt-8 pt-6 border-t border-slate-100"
                >
                  {/* 👇 ELIMINADO: El bloque del input de teléfono ya no está */}

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand text-white font-bold text-lg py-4 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-brand/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <CreditCard size={20} />
                    )}
                    {business?.depositMode !== "none"
                      ? "Ir a pagar la seña"
                      : "Confirmar turno"}
                  </button>

                  <p className="mt-4 text-xs text-center text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} /> Pago seguro
                  </p>
                </form>
              )}
            </Card>
          </AnimateOnScroll>

          {/* TARJETA DE LOGIN/REGISTRO (Solo si no está logueado) */}
          {!customer && (
            <AnimateOnScroll delay={200}>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 h-full">
                <div className="flex gap-4 mb-6 border-b border-slate-100 pb-2">
                  <button
                    onClick={() => setAuthMode("login")}
                    className={`text-sm font-bold pb-2 ${authMode === "login" ? "text-brand border-b-2 border-brand" : "text-slate-400"}`}
                  >
                    Ya tengo cuenta
                  </button>
                  <button
                    onClick={() => setAuthMode("register")}
                    className={`text-sm font-bold pb-2 ${authMode === "register" ? "text-brand border-b-2 border-brand" : "text-slate-400"}`}
                  >
                    Crear cuenta
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === "register" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nombre completo
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/30"
                          placeholder="Ej: Juan Pérez"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/30"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  {authMode === "register" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Teléfono de contacto
                      </label>
                      <div className="relative">
                        <Phone
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/30"
                          placeholder="Ej: 11 2345 6789"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/30"
                        placeholder="Mínimo 8 caracteres"
                        minLength={8}
                      />
                    </div>
                  </div>

                  {authError && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                      {authError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition flex justify-center gap-2"
                  >
                    {authLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <LogIn size={20} />
                    )}
                    {authMode === "login" ? "Ingresar" : "Registrarme"}
                  </button>
                </form>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </div>
    </div>
  );
}
