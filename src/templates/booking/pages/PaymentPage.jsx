import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  ChevronLeft,
  Check,
  CalendarCheck,
  Ticket,
  X,
} from "lucide-react";
import { getBusinessBySlug, getService, getExpert } from "../mocks/businesses";
import { useBooking } from "../context/BookingContext";
import { useBookings } from "../context/BookingsContext";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Stepper from "../components/ui/Stepper";

// TODO: reemplazar por fetch real:
//   POST /api/payments/preference  → { init_point, preferenceId }
async function createMercadoPagoPreference(payload) {
  await new Promise((r) => setTimeout(r, 800));
  return {
    ok: true,
    init_point: "https://www.mercadopago.com/mock-checkout",
    preferenceId: "mock-pref-" + Date.now(),
    ...payload,
  };
}

// TODO: reemplazar por fetch real:
//   POST /api/bookings  → { bookingId }
async function createBooking(payload) {
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, bookingId: "bk_" + Date.now(), ...payload };
}

// TODO: cuando integres el back, esto pasa a POST /api/coupons/validate
const COUPONS = {
  VERANO10: { type: "percent", value: 10 },
  BIENVENIDA15: { type: "percent", value: 15 },
  FIJO2000: { type: "fixed", value: 2000 },
};

function validateCoupon(code) {
  const key = (code || "").trim().toUpperCase();
  return COUPONS[key] || null;
}

export default function PaymentPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const business = getBusinessBySlug(slug);
  const { state, setPaymentStatus, reset } = useBooking();
  const { addBooking } = useBookings();
  const { customer } = useCustomerAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  // Cupón
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, type, value }
  const [couponError, setCouponError] = useState(null);

  if (!business) return null;
  if (!state.serviceId || !state.expertId || !state.dateTime) {
    return <Navigate to={`/${slug}`} replace />;
  }

  const service = getService(business, state.serviceId);
  const expert = getExpert(business, state.expertId);
  const dateTime = new Date(state.dateTime);
  const noDeposit = !state.depositRequired;
  const servicePrice = service?.price ?? 0;

  // Descuento en pesos según el cupón aplicado
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round((servicePrice * appliedCoupon.value) / 100)
      : Math.min(appliedCoupon.value, servicePrice)
    : 0;

  const totalAfterDiscount = Math.max(0, servicePrice - discountAmount);

  // La seña se recalcula sobre el total con descuento (si aplica)
  const finalDeposit = noDeposit
    ? 0
    : appliedCoupon
      ? Math.round((totalAfterDiscount * service.depositPercent) / 100)
      : state.depositAmount;

  const applyCoupon = () => {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = validateCoupon(code);
    if (!found) {
      setCouponError("Cupón inválido o vencido.");
      return;
    }
    setAppliedCoupon({ code, ...found });
    setCouponInput("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const persistBooking = (bookingId, status) => {
    addBooking({
      id: bookingId,
      businessSlug: business.slug,
      businessName: business.name,
      serviceId: service.id,
      serviceName: service.name,
      expertId: expert?.id ?? null,
      expertName: expert?.name ?? null,
      dateTime: dateTime.toISOString(),
      price: service.price,
      hasDeposit: !noDeposit,
      depositAmount: noDeposit ? 0 : finalDeposit,
      couponCode: appliedCoupon?.code ?? null,
      discountAmount,
      status, // 'confirmed' | 'deposit-paid'
      createdAt: new Date().toISOString(),
    });
  };

  const handlePay = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!customer) {
        navigate(`/${slug}/ingresar`, { state: { from: `/${slug}/pago` } });
        return;
      }
      const pref = await createMercadoPagoPreference({
        businessId: business.slug,
        mpAccountId: business.mpAccountId,
        amount: finalDeposit,
        couponCode: appliedCoupon?.code ?? null,
        discountAmount,
        booking: {
          serviceId: state.serviceId,
          expertId: state.expertId,
          dateTime: state.dateTime,
        },
      });
      console.log("[MP mock preference]", pref);

      // En el flujo real, acá MP te devuelve al sitio y consultás el estado.
      // Por ahora, damos por aprobado y creamos el booking local.
      const booking = await createBooking({
        businessId: business.slug,
        serviceId: state.serviceId,
        expertId: state.expertId,
        dateTime: state.dateTime,
        depositPaid: true,
        couponCode: appliedCoupon?.code ?? null,
        discountAmount,
      });

      persistBooking(booking.bookingId, "deposit-paid");
      setPaymentStatus("paid");
      setDone(true);
    } catch {
      setError("No pudimos iniciar el pago. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!customer) {
        navigate(`/${slug}/ingresar`, { state: { from: `/${slug}/pago` } });
        return;
      }
      const booking = await createBooking({
        businessId: business.slug,
        serviceId: state.serviceId,
        expertId: state.expertId,
        dateTime: state.dateTime,
        couponCode: appliedCoupon?.code ?? null,
        discountAmount,
      });

      persistBooking(booking.bookingId, "confirmed");
      setPaymentStatus("confirmed");
      setDone(true);
    } catch {
      setError("No pudimos confirmar el turno. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const goToProfile = () => {
    navigate(`/${slug}/perfil`);
  };

  const goHome = () => {
    reset();
    navigate(`/${slug}`);
  };

  // ─────────────────────────── Pantalla de éxito ───────────────────────────
  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Check size={28} />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">
          {noDeposit ? "¡Turno confirmado!" : "¡Seña confirmada!"}
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {service?.name} con{" "}
          <span className="font-medium text-slate-700">{expert?.name}</span>
        </p>
        <p className="text-sm text-slate-500 mt-1">
          {dateTime.toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}{" "}
          ·{" "}
          {dateTime.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {appliedCoupon && (
          <p className="text-xs text-emerald-600 mt-2">
            Cupón aplicado:{" "}
            <span className="font-semibold">{appliedCoupon.code}</span> (-$
            {discountAmount.toLocaleString("es-AR")})
          </p>
        )}
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={goToProfile}>Ver mis turnos</Button>
          <Button variant="ghost" onClick={goHome}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  // ─────────────────────────── Resumen del turno ───────────────────────────
  const summary = (
    <Card className="p-4 mb-4">
      <h3 className="text-sm font-medium text-slate-700 mb-3">
        Resumen del turno
      </h3>
      <div className="space-y-2 text-sm">
        <Row label="Servicio" value={service?.name} />
        <Row label="Profesional" value={expert?.name} />
        <Row
          label="Fecha"
          value={dateTime.toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        />
        <Row
          label="Hora"
          value={dateTime.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        />

        <div className="border-t border-slate-100 pt-2 mt-2 space-y-1">
          <Row
            label="Precio total"
            value={`$${servicePrice.toLocaleString("es-AR")}`}
          />

          {appliedCoupon && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Descuento ({appliedCoupon.code})
              </span>
              <span className="font-medium text-emerald-600">
                -${discountAmount.toLocaleString("es-AR")}
              </span>
            </div>
          )}

          {appliedCoupon && (
            <Row
              label="Total con descuento"
              value={`$${totalAfterDiscount.toLocaleString("es-AR")}`}
            />
          )}

          {!noDeposit && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-medium text-slate-900">
                Seña a pagar
              </span>
              <Badge tone="warning">
                ${finalDeposit.toLocaleString("es-AR")}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  // ─────────────────────────── Pantalla principal ───────────────────────────
  return (
    <div className="max-w-md mx-auto">
      <Stepper current="pago" />

      <header className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          {noDeposit ? "Confirmá tu turno" : "Confirmá tu seña"}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {noDeposit
            ? "Revisá los datos y confirmá la reserva."
            : "Reservá tu turno pagando la seña por MercadoPago."}
        </p>
      </header>

      {summary}

      {/* Bloque de cupón (siempre visible) */}
      <Card className="p-4 mb-4">
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
          <Ticket size={14} /> ¿Tenés un cupón de descuento?
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            <div className="text-sm">
              <span className="font-semibold text-emerald-700">
                {appliedCoupon.code}
              </span>
              <span className="text-emerald-600 ml-2">
                (
                {appliedCoupon.type === "percent"
                  ? `${appliedCoupon.value}% off`
                  : `$${appliedCoupon.value.toLocaleString("es-AR")} off`}
                )
              </span>
            </div>
            <button
              type="button"
              onClick={removeCoupon}
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline"
            >
              <X size={12} /> Quitar
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyCoupon();
                  }
                }}
                placeholder="Ej: VERANO10"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm uppercase
                           focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
              <Button
                type="button"
                onClick={applyCoupon}
                variant="outline"
                size="md"
              >
                Aplicar
              </Button>
            </div>
            {couponError && (
              <p className="text-xs text-red-600 mt-2">{couponError}</p>
            )}
          </>
        )}
      </Card>

      {!noDeposit && (
        <Card className="p-4 mb-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <CreditCard size={18} />
          </div>
          <div className="text-xs text-slate-600">
            El pago se procesa en la cuenta de MercadoPago de{" "}
            <span className="font-medium text-slate-800">{business.name}</span>.
            El saldo restante se abona en el local.
            {appliedCoupon && (
              <span className="block mt-1 text-emerald-600 font-medium">
                Cupón {appliedCoupon.code} aplicado (-$
                {discountAmount.toLocaleString("es-AR")}).
              </span>
            )}
          </div>
        </Card>
      )}

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      {noDeposit ? (
        <Button
          onClick={handleConfirm}
          disabled={loading}
          size="lg"
          className="w-full"
        >
          {loading ? (
            "Confirmando…"
          ) : (
            <>
              <CalendarCheck size={16} /> Confirmar reserva
            </>
          )}
        </Button>
      ) : (
        <>
          <Button
            onClick={handlePay}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading
              ? "Procesando…"
              : `Pagar seña $${finalDeposit.toLocaleString("es-AR")}`}
          </Button>
          <p className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mt-3">
            <ShieldCheck size={12} /> Pago seguro a través de MercadoPago
          </p>
        </>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
      >
        <ChevronLeft size={16} /> Volver
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 text-right truncate">
        {value}
      </span>
    </div>
  );
}
