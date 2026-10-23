import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Mail, Lock, User, Phone, ChevronLeft } from "lucide-react";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function CustomerLoginPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, loginWithGoogle } = useCustomerAuth();

  const from = location.state?.from || `/${slug}/perfil`;

  const [mode, setMode] = useState("login"); // login | register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginWithEmail({ name, email, phone, password, mode });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "No pudimos iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch {
      setError("No pudimos iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
      >
        <ChevronLeft size={16} /> Volver
      </button>

      <header className="mb-5 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          {mode === "login" ? "Ingresá a tu cuenta" : "Creá tu cuenta"}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {mode === "login"
            ? "Accedé para reservar y ver tus turnos."
            : "Registrate para reservar y ver tus turnos."}
        </p>
      </header>

      <Card className="p-5">
        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <>
              <label className="block">
                <span className="text-xs font-medium text-slate-600">
                  Nombre completo
                </span>
                <div className="mt-1 relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-medium text-slate-600">
                  Teléfono
                </span>
                <div className="mt-1 relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="11 2345 6789"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                </div>
              </label>
            </>
          )}

          <label className="block">
            <span className="text-xs font-medium text-slate-600">Email</span>
            <div className="mt-1 relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-600">
              Contraseña
            </span>
            <div className="mt-1 relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                required
                minLength={6}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>
          </label>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading
              ? "Procesando…"
              : mode === "login"
                ? "Ingresar"
                : "Crear cuenta"}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex-1 h-px bg-slate-100" />
          o continuá con
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={google}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          <GoogleIcon />
          Continuar con Google
        </Button>

        <p className="text-center text-xs text-slate-500 mt-4">
          {mode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="font-medium text-brand hover:underline"
          >
            {mode === "login" ? "Registrate" : "Ingresá"}
          </button>
        </p>
      </Card>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.42 3.44 1.18 4.94l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
