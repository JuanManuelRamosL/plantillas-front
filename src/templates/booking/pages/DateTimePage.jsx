import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Loader2, ChevronLeft } from "lucide-react";
import { useBusinessStore } from "../../../store/useBusinessStore";
import { useBookingStore } from "../../../store/useBookingStore";
import { apiFetch } from "../../../api/client";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import AnimateOnScroll from "../components/AnimateOnScroll";
import CalendarSelector from "../components/CalendarSelector";

export default function DateTimePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { business } = useBusinessStore();
  const { service, expert, setDateTime } = useBookingStore();

  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loadingDays, setLoadingDays] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const slotsRef = useRef(null);
  // Timestamp de cuando se montó la página
  const mountTimeRef = useRef(Date.now());

  // Al montar, forzamos scroll al top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!service || !expert) {
    return <Navigate to={`/${slug}`} replace />;
  }

  // 1. Cargar días disponibles
  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 60);

    const fromStr = today.toISOString().split("T")[0];
    const toStr = nextMonth.toISOString().split("T")[0];

    apiFetch(
      `/b/${slug}/availability/days?serviceId=${service.id}&expertId=${expert.id}&from=${fromStr}&to=${toStr}`,
    )
      .then((data) => {
        setAvailableDays(data.days || []);
        if (data.days && data.days.length > 0) {
          // Solo seleccionamos el primer día si no hay uno ya seleccionado
          setSelectedDay((prev) => prev || data.days[0]);
        }
      })
      .catch((err) => console.error("Error días:", err))
      .finally(() => setLoadingDays(false));
  }, [slug, service.id, expert.id]);

  // 2. Cargar horarios cuando cambia el día
  useEffect(() => {
    if (!selectedDay) return;

    setLoadingSlots(true);
    setSelectedSlot(null);

    apiFetch(
      `/b/${slug}/availability?serviceId=${service.id}&expertId=${expert.id}&date=${selectedDay}`,
    )
      .then((data) => {
        setSlots(data.slots || []);
      })
      .catch((err) => console.error("Error slots:", err))
      .finally(() => setLoadingSlots(false));
  }, [slug, service.id, expert.id, selectedDay]);

  // 3. Scroll automático SOLO cuando el usuario cambia el día manualmente
  //    (usamos el timestamp para evitar el scroll en el primer render)
  useEffect(() => {
    // Si pasaron menos de 500ms desde que se montó la página, no hacemos scroll
    // (esto evita el auto-scroll del navegador en F5)
    const timeSinceMount = Date.now() - mountTimeRef.current;
    if (timeSinceMount < 500) {
      return;
    }

    if (selectedDay) {
      setTimeout(() => {
        if (slotsRef.current) {
          const headerOffset = 80;
          const elementPosition = slotsRef.current.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 150);
    }
  }, [selectedDay]);

  const handleNext = () => {
    if (selectedSlot) {
      setDateTime(selectedSlot.startAt, selectedSlot.time);
      navigate(`/${slug}/pago`);
    }
  };

  // Manejador de selección de día (para separar la lógica del state)
  const handleSelectDay = (day) => {
    setSelectedDay(day);
  };

  if (loadingDays) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  const calendarType = business?.visual?.calendarType || "month";

  return (
    <div className="bg-main pb-20 pt-8 sm:pt-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate(`/${slug}/experto`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand transition mb-8"
        >
          <ChevronLeft size={18} /> Volver
        </button>

        <AnimateOnScroll>
          <header className="mb-10">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 leading-none mb-4">
              Elegí fecha y hora
            </h1>
            <p className="text-slate-500 text-lg">
              {service.name} con{" "}
              <span className="font-bold text-slate-900">{expert.name}</span>
            </p>
          </header>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          {availableDays.length === 0 ? (
            <div className="text-slate-500 mb-10 p-6 bg-slate-100 rounded-2xl text-center">
              No hay días disponibles para este profesional en los próximos 60
              días.
            </div>
          ) : (
            <div className="mb-8">
              <CalendarSelector
                type={calendarType}
                availableDays={availableDays}
                selectedDay={selectedDay}
                onSelectDay={handleSelectDay}
              />
            </div>
          )}
        </AnimateOnScroll>

        {selectedDay && (
          <div ref={slotsRef} className="scroll-mt-24">
            <AnimateOnScroll delay={200}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                Horarios disponibles
              </h3>
              {loadingSlots ? (
                <div className="flex py-10 justify-center">
                  <Loader2 className="animate-spin text-brand" size={24} />
                </div>
              ) : slots.length === 0 ? (
                <div className="text-slate-500 bg-slate-100 p-6 rounded-2xl text-center">
                  No hay horarios disponibles para este día. Probá con otra
                  fecha.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot?.startAt === slot.startAt;
                    return (
                      <button
                        key={slot.startAt}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-xl font-bold transition-all border ${
                          isSelected
                            ? "bg-brand text-white border-brand shadow-md"
                            : "bg-white text-slate-700 border-slate-200 hover:border-brand"
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              )}
            </AnimateOnScroll>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-200">
          <Card className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-white shadow-xl border-slate-100 rounded-2xl">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                Seleccionado
              </p>
              <p className="text-sm font-bold text-slate-900">
                {selectedSlot ? `${selectedSlot.time} hs` : "Elegí un horario"}
              </p>
            </div>
            <Button
              onClick={handleNext}
              disabled={!selectedSlot}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-full"
            >
              Continuar
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
