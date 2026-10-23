import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ChevronLeft, Clock } from "lucide-react";
import { getBusinessBySlug, getService, getExpert } from "../mocks/businesses";
import { useBooking } from "../context/BookingContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Stepper from "../components/ui/Stepper";
import EmptyState from "../components/ui/EmptyState";
import CalendarPicker from "../components/CalendarPicker";

const SLOT_START_HOUR = 9;
const SLOT_END_HOUR = 18;
const SLOT_MINUTES = 30;

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildSlotsForDay(day) {
  const slots = [];
  const cursor = new Date(day);
  cursor.setHours(SLOT_START_HOUR, 0, 0, 0);
  const end = new Date(day);
  end.setHours(SLOT_END_HOUR, 0, 0, 0);
  const now = new Date();

  while (cursor < end) {
    if (!(cursor.toDateString() === now.toDateString() && cursor <= now)) {
      slots.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES);
  }
  return slots;
}

export default function DateTimePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const business = getBusinessBySlug(slug);
  const { state, setDateTime } = useBooking();

  const [selectedDay, setSelectedDay] = useState(() => startOfDay(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slots = useMemo(() => buildSlotsForDay(selectedDay), [selectedDay]);

  if (!business) return null;

  if (!state.serviceId || !state.expertId) {
    return <Navigate to={`/${slug}`} replace />;
  }

  const service = getService(business, state.serviceId);
  const expert = getExpert(business, state.expertId);

  const goNext = () => {
    if (!selectedSlot) return;
    setDateTime(selectedSlot.toISOString());
    navigate(`/${slug}/pago`);
  };

  return (
    <div>
      <Stepper current="fecha" />

      <header className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Elegí fecha y hora
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {service?.name} con{" "}
          <span className="font-medium text-slate-700">{expert?.name}</span>
        </p>
      </header>

      <Card className="p-4 mb-4">
        <CalendarPicker
          selectedDay={selectedDay}
          onSelectDay={(d) => {
            setSelectedDay(d);
            setSelectedSlot(null);
          }}
        />
      </Card>

      <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1.5">
        <Clock size={14} /> Horarios disponibles
      </h3>

      {slots.length === 0 ? (
        <EmptyState
          title="Sin horarios"
          description="No quedan horarios disponibles para este día."
        />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {slots.map((slot) => {
            const isActive =
              selectedSlot && selectedSlot.getTime() === slot.getTime();
            return (
              <button
                key={slot.toISOString()}
                onClick={() => setSelectedSlot(slot)}
                className={`py-2.5 rounded-xl text-sm font-medium border transition
                  ${
                    isActive
                      ? "bg-brand text-white border-brand"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
              >
                {slot.toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 sticky bottom-20 sm:bottom-4">
        <Card className="p-3 sm:p-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500">Seleccionado</p>
            <p className="text-sm font-medium text-slate-900 truncate">
              {selectedSlot
                ? `${selectedSlot.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} · ${selectedSlot.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`
                : "Elegí un horario"}
            </p>
          </div>
          <Button onClick={goNext} disabled={!selectedSlot} size="md">
            {state.depositRequired ? "Ir a pago" : "Confirmar turno"}
          </Button>
        </Card>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
      >
        <ChevronLeft size={16} /> Volver
      </button>
    </div>
  );
}
