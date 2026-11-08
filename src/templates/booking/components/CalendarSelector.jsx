import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarSelector({
  type = "month",
  availableDays = [],
  selectedDay,
  onSelectDay,
}) {
  const [viewDate, setViewDate] = useState(() => {
    const d = selectedDay ? new Date(selectedDay + "T12:00:00Z") : new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    if (selectedDay) {
      const d = new Date(selectedDay + "T12:00:00Z");
      setViewDate(d);
    }
  }, [selectedDay]);

  const changeMonth = (offset) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const changeWeek = (offset) => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + offset * 7);
    setViewDate(newDate);
  };

  // --- RENDERIZADO MENSUAL ---
  if (type === "month") {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = firstDay.getDay();

    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Creamos una "key" única por mes y año para forzar la animación al cambiar
    const animationKey = `month-${year}-${month}`;

    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 capitalize">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full hover:bg-slate-100 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-full hover:bg-slate-100 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold text-slate-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 👇 Le aplicamos animate-fade-in-up y una key para que se anime al cambiar de mes */}
        <div
          key={animationKey}
          className="grid grid-cols-7 gap-1 animate-fade-in-up"
        >
          {days.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} />;

            const dateStr = date.toISOString().split("T")[0];
            const isAvailable = availableDays.includes(dateStr);
            const isSelected = selectedDay === dateStr;

            return (
              <button
                key={dateStr}
                disabled={!isAvailable}
                onClick={() => onSelectDay(dateStr)}
                /* Cambiamos rounded-full por rounded-xl para hacerlos rectangulares con bordes suaves */
                className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-md scale-105"
                      : isAvailable
                        ? "bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 hover:border-slate-300"
                        : "text-slate-300 bg-slate-50/50 cursor-not-allowed border border-transparent"
                  }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- RENDERIZADO SEMANAL ---
  if (type === "week") {
    const current = new Date(viewDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(current.setDate(diff));

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });

    const animationKey = `week-${startOfWeek.toISOString().split("T")[0]}`;

    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">
            Semana del {startOfWeek.getDate()} de{" "}
            {startOfWeek.toLocaleDateString("es-AR", { month: "long" })}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => changeWeek(-1)}
              className="p-2 rounded-full hover:bg-slate-100 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => changeWeek(1)}
              className="p-2 rounded-full hover:bg-slate-100 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          key={animationKey}
          className="grid grid-cols-7 gap-2 animate-fade-in-up"
        >
          {weekDays.map((date) => {
            const dateStr = date.toISOString().split("T")[0];
            const isAvailable = availableDays.includes(dateStr);
            const isSelected = selectedDay === dateStr;
            const dayName = date.toLocaleDateString("es-AR", {
              weekday: "short",
            });

            return (
              <button
                key={dateStr}
                disabled={!isAvailable}
                onClick={() => onSelectDay(dateStr)}
                className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl transition-all duration-200 border
                  ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                      : isAvailable
                        ? "bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300"
                        : "text-slate-300 bg-slate-50/50 border-transparent cursor-not-allowed"
                  }`}
              >
                <span className="text-xs uppercase opacity-70 mb-1">
                  {dayName}
                </span>
                <span className="text-xl font-black">{date.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- RENDERIZADO 4 DÍAS ---
  if (type === "four") {
    const next4 = availableDays.slice(0, 4);

    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Próximos días</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          {next4.map((dateStr) => {
            const date = new Date(dateStr + "T12:00:00Z");
            const isSelected = selectedDay === dateStr;
            const dayName = date.toLocaleDateString("es-AR", {
              weekday: "short",
            });

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDay(dateStr)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-200 border
                  ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                      : "bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300"
                  }`}
              >
                <span className="text-xs uppercase opacity-70 mb-1">
                  {dayName}
                </span>
                <span className="text-3xl font-black">{date.getDate()}</span>
                <span className="text-xs opacity-70">
                  {date.toLocaleDateString("es-AR", { month: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-500">
      Tipo de calendario no soportado: {type}
    </div>
  );
}
