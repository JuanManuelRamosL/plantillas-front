import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WeeklySchedule({ business, serviceId, onSelectSlot }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay() + 1); // Lunes
    return d;
  });

  const [availableSlots, setAvailableSlots] = useState({});
  const [loading, setLoading] = useState(false);

  // Días de la semana actual
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Acá simulamos la carga de datos desde el backend
  useEffect(() => {
    setLoading(true);
    const mockSchedule = {};

    weekDays.forEach((day, index) => {
      const dayStr = day.toISOString().split("T")[0];
      // Simulamos: cerrado lunes (0) y domingo (6)
      if (index === 0 || index === 6) {
        mockSchedule[dayStr] = [];
      } else if (index === 5) {
        // Sábado: horarios cortados
        mockSchedule[dayStr] = [
          "09:00",
          "10:00",
          "11:00",
          "15:00",
          "16:00",
          "17:00",
        ];
      } else {
        // Martes a Viernes: horario completo
        mockSchedule[dayStr] = [
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
        ];
      }
    });

    setTimeout(() => {
      setAvailableSlots(mockSchedule);
      setLoading(false);
    }, 500);
  }, [currentWeekStart]);

  const prevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };

  const daysLabel = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const monthsLabel = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];

  return (
    <div className="w-full">
      {/* Leyenda y Controles */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-brand inline-block"></span>{" "}
            Abierto
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-slate-200 inline-block"></span>{" "}
            Cerrado
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={prevWeek}
            className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextWeek}
            className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Grilla Semanal */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 min-w-[650px]">
          {weekDays.map((day, i) => {
            const dayStr = day.toISOString().split("T")[0];
            const isClosed = availableSlots[dayStr]?.length === 0;
            const isToday = new Date().toDateString() === day.toDateString();
            const slots = availableSlots[dayStr] || [];

            return (
              <div key={dayStr} className="flex flex-col h-[380px]">
                {/* Header del día con Fecha */}
                <div
                  className={`flex flex-col items-center justify-center py-2 mb-2 rounded-xl transition-colors ${isToday ? "bg-slate-900 text-white shadow-md" : "text-slate-700 bg-slate-50"}`}
                >
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {daysLabel[i]}
                  </span>
                  <span
                    className={`text-xs font-medium ${isToday ? "text-slate-300" : "text-slate-500"}`}
                  >
                    {day.getDate()} {monthsLabel[day.getMonth()]}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold text-brand uppercase mt-0.5 tracking-widest">
                      Hoy
                    </span>
                  )}
                </div>

                {/* Columna de horarios */}
                <div className="flex-1 relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                  {isClosed ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(45deg,#f1f5f9,#f1f5f9_10px,#e2e8f0_10px,#e2e8f0_20px)]">
                      <span className="bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-slate-400 rotate-[-90deg] whitespace-nowrap shadow-sm">
                        CERRADO
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 p-1.5 h-full overflow-y-auto no-scrollbar">
                      {loading ? (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                          Cargando...
                        </div>
                      ) : (
                        slots.map((time) => (
                          <button
                            key={time}
                            onClick={() => onSelectSlot(day, time)}
                            className="w-full py-2.5 rounded-lg text-sm font-bold bg-brand text-white hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
                          >
                            {time}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4">
        Sábados con corte al mediodía. Feriados: consultá por WhatsApp.
      </p>
    </div>
  );
}
