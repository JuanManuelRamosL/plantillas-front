import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAY_LABELS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MONTH_LABELS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const FORMATS = [
  { key: "four", label: "4 días" },
  { key: "week", label: "Semanal" },
  { key: "month", label: "Mensual" },
];

export default function CalendarPicker({
  selectedDay,
  onSelectDay,
  minDate = new Date(),
  maxDaysAhead = 90,
}) {
  const today = startOfDay(minDate);
  const [format, setFormat] = useState("four");
  const [anchor, setAnchor] = useState(() => startOfDay(selectedDay || today));

  // Días visibles según formato
  const visibleDays = useMemo(() => {
    if (format === "four") {
      const days = [];
      for (let i = 0; i < 4; i++) days.push(addDays(anchor, i));
      return days;
    }
    if (format === "week") {
      // Desde el día actual (o anchor) hacia adelante, 7 días
      const days = [];
      for (let i = 0; i < 7; i++) days.push(addDays(anchor, i));
      return days;
    }
    // month
    const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const daysInMonth = new Date(
      anchor.getFullYear(),
      anchor.getMonth() + 1,
      0,
    ).getDate();
    const startWeekday = firstOfMonth.getDay(); // 0 = dom
    const days = [];
    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(anchor.getFullYear(), anchor.getMonth(), i));
    }
    return days;
  }, [format, anchor]);

  const canGoPrev = () => {
    if (format === "month") {
      const prevMonth = new Date(
        anchor.getFullYear(),
        anchor.getMonth() - 1,
        1,
      );
      const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return prevMonth >= minMonth;
    }
    return addDays(anchor, -1) >= today;
  };

  const canGoNext = () => {
    const limit = addDays(today, maxDaysAhead);
    if (format === "month") {
      const nextMonth = new Date(
        anchor.getFullYear(),
        anchor.getMonth() + 1,
        1,
      );
      return nextMonth <= limit;
    }
    const shift = format === "four" ? 4 : 7;
    return addDays(anchor, shift) <= limit;
  };

  const goPrev = () => {
    if (!canGoPrev()) return;
    if (format === "month") {
      setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1));
    } else {
      const shift = format === "four" ? 4 : 7;
      setAnchor(addDays(anchor, -shift));
    }
  };

  const goNext = () => {
    if (!canGoNext()) return;
    if (format === "month") {
      setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1));
    } else {
      const shift = format === "four" ? 4 : 7;
      setAnchor(addDays(anchor, shift));
    }
  };

  const selectDay = (d) => {
    if (!d) return;
    const day = startOfDay(d);
    if (day < today) return;
    onSelectDay(day);
  };

  const headerLabel = () => {
    if (format === "month") {
      return `${MONTH_LABELS[anchor.getMonth()]} ${anchor.getFullYear()}`;
    }
    return `${anchor.getDate()} ${MONTH_LABELS[anchor.getMonth()].slice(0, 3)} – ${addDays(anchor, format === "four" ? 3 : 6).getDate()} ${MONTH_LABELS[addDays(anchor, format === "four" ? 3 : 6).getMonth()].slice(0, 3)}`;
  };

  return (
    <div>
      {/* Selector de formato */}
      <div className="flex items-center gap-1 mb-3 p-1 bg-slate-100 rounded-xl w-fit">
        {FORMATS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => {
              setFormat(f.key);
              setAnchor(startOfDay(selectedDay || today));
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition
              ${
                format === f.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Header con navegación */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev()}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
          aria-label="Anterior"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-slate-700 capitalize">
          {headerLabel()}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext()}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
          aria-label="Siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Días */}
      {format === "month" ? (
        <>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="text-center text-[9px] uppercase tracking-wide text-slate-400 py-0.5"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {visibleDays.map((d, i) => {
              if (!d) return <div key={`empty-${i}`} />;
              const isPast = startOfDay(d) < today;
              const isSelected = selectedDay && isSameDay(d, selectedDay);
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  disabled={isPast}
                  onClick={() => selectDay(d)}
                  className={`h-8 rounded-md text-[11px] font-medium flex items-center justify-center transition
                    ${
                      isSelected
                        ? "bg-brand text-white"
                        : isPast
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-700 hover:bg-slate-100"
                    }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div
          className={`grid gap-2 ${format === "four" ? "grid-cols-4" : "grid-cols-7"}`}
        >
          {visibleDays.map((d) => {
            const isPast = startOfDay(d) < today;
            const isSelected = selectedDay && isSameDay(d, selectedDay);
            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={isPast}
                onClick={() => selectDay(d)}
                className={`py-2 rounded-xl flex flex-col items-center transition
                  ${
                    isSelected
                      ? "bg-brand text-white"
                      : isPast
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                <span className="text-[10px] uppercase tracking-wide opacity-80">
                  {DAY_LABELS[d.getDay()]}
                </span>
                <span className="text-lg font-semibold leading-tight">
                  {d.getDate()}
                </span>
                <span className="text-[10px] opacity-80">
                  {MONTH_LABELS[d.getMonth()].slice(0, 3)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
