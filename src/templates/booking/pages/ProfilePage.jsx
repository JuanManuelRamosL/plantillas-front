import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  Scissors,
  LogOut,
  Ticket,
  QrCode,
  Star,
  MessageSquare,
  Award,
} from "lucide-react";
import { getBusinessBySlug } from "../mocks/businesses";
import { useBookings } from "../context/BookingsContext";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { usePoints } from "../context/PointsContext";
import { useReviews } from "../context/ReviewsContext";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import QrScannerModal from "../components/QrScannerModal";
import StarRating from "../components/StarRating";

export default function ProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const business = getBusinessBySlug(slug);
  const { bookings } = useBookings();
  const { customer, logout } = useCustomerAuth();
  const { points } = usePoints();
  const { reviews, addReview } = useReviews();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!business) return null;

  const now = new Date();

  const businessBookings = bookings
    .filter((b) => b.businessSlug === business.slug)
    .map((b) => ({ ...b, dateTime: new Date(b.dateTime) }));

  const upcoming = businessBookings
    .filter(
      (b) =>
        b.dateTime >= now &&
        b.status !== "cancelled" &&
        b.status !== "completed",
    )
    .sort((a, b) => a.dateTime - b.dateTime);

  const past = businessBookings
    .filter(
      (b) =>
        b.dateTime < now ||
        b.status === "completed" ||
        b.status === "cancelled",
    )
    .sort((a, b) => b.dateTime - a.dateTime);

  const next = upcoming[0] ?? null;

  const handleLogout = () => {
    logout();
    navigate(`/${slug}`);
  };

  const handleScan = (text) => {
    // El texto ya se loguea en consola dentro de QrScannerModal.
    // Acá podés procesar el código escaneado (ej: sumar puntos, validar cupón, etc.)
    console.log("[ProfilePage] QR recibido:", text);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewRating === 0 || !reviewText.trim()) return;
    addReview({
      rating: reviewRating,
      text: reviewText.trim(),
      customerName: customer?.name ?? "Anónimo",
    });
    setReviewRating(0);
    setReviewText("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header del perfil */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center font-semibold text-lg">
          {customer?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-slate-900 truncate">
            {customer?.name}
          </h2>
          <p className="text-xs text-slate-500 truncate">{customer?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
        >
          <LogOut size={14} /> Salir
        </button>
      </div>

      {/* Puntos de fidelidad + Escáner QR */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award size={18} />
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Puntos</p>
            <p className="text-lg font-semibold text-slate-900">{points}</p>
          </div>
        </Card>

        <button
          type="button"
          onClick={() => setScannerOpen(true)}
          className="text-left"
        >
          <Card className="p-4 flex items-center gap-3 hover:border-brand/30 hover:shadow-md transition cursor-pointer h-full">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <QrCode size={18} />
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Escanear</p>
              <p className="text-sm font-medium text-slate-900">Código QR</p>
            </div>
          </Card>
        </button>
      </div>

      {/* Próximo turno */}
      {next ? (
        <Card className="p-5 mb-6">
          <div className="flex-1 min-w-0">
            <Badge tone={next.status === "confirmed" ? "success" : "brand"}>
              {labelForStatus(next.status)}
            </Badge>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              {next.serviceName}
            </h3>
            <p className="text-sm text-slate-500">con {next.expertName}</p>

            <div className="mt-3 space-y-1 text-sm">
              <p className="flex items-center gap-1.5 text-slate-700">
                <Calendar size={14} className="text-slate-400" />
                {next.dateTime.toLocaleDateString("es-AR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <p className="flex items-center gap-1.5 text-slate-700">
                <Clock size={14} className="text-slate-400" />
                {next.dateTime.toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                hs
              </p>
              {next.hasDeposit && (
                <p className="text-xs text-slate-500">
                  Seña pagada:{" "}
                  <span className="font-medium">
                    ${next.depositAmount.toLocaleString("es-AR")}
                  </span>
                </p>
              )}
              {next.couponCode && (
                <p className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-2 py-1 w-fit">
                  <Ticket size={12} />
                  Cupón <span className="font-semibold">{next.couponCode}</span>
                  {typeof next.discountAmount === "number" &&
                    next.discountAmount > 0 && (
                      <span className="text-emerald-600">
                        · -${next.discountAmount.toLocaleString("es-AR")}
                      </span>
                    )}
                </p>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <EmptyState
          title="No tenés turnos próximos"
          description="Reservá tu primer turno desde la pestaña de Turnos."
          action={
            <Button onClick={() => navigate(`/${slug}`)}>
              <Scissors size={14} /> Reservar turno
            </Button>
          }
        />
      )}

      {/* Próximos turnos */}
      {upcoming.length > 1 && (
        <>
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            Próximos turnos
          </h3>
          <div className="grid gap-2 mb-6">
            {upcoming.slice(1).map((b) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </div>
        </>
      )}

      {/* Historial */}
      <h3 className="text-sm font-medium text-slate-700 mb-3">Historial</h3>
      <div className="grid gap-2 mb-8">
        {past.length === 0 && (
          <p className="text-sm text-slate-500">
            Aún no tenés turnos anteriores.
          </p>
        )}
        {past.map((b) => (
          <BookingRow key={b.id} booking={b} />
        ))}
      </div>

      {/* Comentarios */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1.5">
          <MessageSquare size={16} /> Dejá tu comentario
        </h3>

        {reviewSubmitted && (
          <div className="mb-3 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            ¡Gracias por tu comentario!
          </div>
        )}

        <Card className="p-4 mb-4">
          <form onSubmit={handleSubmitReview} className="space-y-3">
            <div>
              <p className="text-xs text-slate-600 mb-1">
                ¿Cómo fue tu experiencia?
              </p>
              <StarRating
                value={reviewRating}
                onChange={setReviewRating}
                size={22}
              />
            </div>
            <div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Contanos qué te pareció el servicio…"
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>
            <Button
              type="submit"
              disabled={reviewRating === 0 || !reviewText.trim()}
              size="sm"
            >
              Enviar comentario
            </Button>
          </form>
        </Card>

        {/* Lista de comentarios */}
        {reviews.length > 0 && (
          <div className="grid gap-2">
            {reviews.slice(0, 3).map((r) => (
              <Card key={r.id} className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-slate-800">
                    {r.customerName}
                  </span>
                  <StarRating value={r.rating} size={12} readOnly />
                </div>
                <p className="text-xs text-slate-600">{r.text}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal del escáner */}
      <QrScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScan}
      />
    </div>
  );
}

function BookingRow({ booking }) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
          <Scissors size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">
            {booking.serviceName}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {booking.expertName} ·{" "}
            {booking.dateTime.toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            ·{" "}
            {booking.dateTime.toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge tone="neutral">{labelForStatus(booking.status)}</Badge>
      </div>

      {booking.couponCode && (
        <div className="mt-2 ml-12 inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 rounded-md px-2 py-0.5">
          <Ticket size={10} />
          Cupón <span className="font-semibold">{booking.couponCode}</span>
          {typeof booking.discountAmount === "number" &&
            booking.discountAmount > 0 && (
              <span className="text-emerald-600">
                · -${booking.discountAmount.toLocaleString("es-AR")}
              </span>
            )}
        </div>
      )}
    </Card>
  );
}

function labelForStatus(status) {
  switch (status) {
    case "confirmed":
      return "Confirmado";
    case "deposit-paid":
      return "Seña pagada";
    case "completed":
      return "Completado";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}
