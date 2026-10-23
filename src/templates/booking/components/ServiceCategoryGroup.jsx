import { useEffect, useRef } from "react";
import {
  ChevronDown,
  Clock,
  Scissors,
  Sparkles,
  Palette,
  Hand,
  Droplets,
  Heart,
  CalendarPlus,
} from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

const CATEGORY_ICONS = {
  Cortes: Scissors,
  Barba: Scissors,
  Color: Palette,
  Uñas: Hand,
  Depilación: Droplets,
  Facial: Heart,
};

export default function ServiceCategoryGroup({
  slug,
  category,
  services,
  open = false,
  onToggle,
  onServicePick,
}) {
  const Icon = CATEGORY_ICONS[category] || Sparkles;
  const containerRef = useRef(null);
  const prevOpenRef = useRef(open);

  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;

    if (!open || wasOpen) return;

    const timeout = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const headerOffset = 80;
      const top =
        el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }, 320);

    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <div className="mb-4 scroll-mt-24" ref={containerRef}>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-300 text-left
          ${
            open
              ? "bg-brand/5 border-brand/20 shadow-sm"
              : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"
          }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
            ${open ? "bg-brand text-white rotate-0 scale-105" : "bg-slate-100 text-slate-500 scale-100"}`}
        >
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-base">{category}</h3>
          <p className="text-xs text-slate-500">
            {services.length} {services.length === 1 ? "servicio" : "servicios"}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-300
            ${open ? "bg-brand text-white" : "bg-slate-100 text-slate-600"}`}
        >
          {open ? "Cerrar" : "Ver"}
        </span>

        <ChevronDown
          size={18}
          className={`text-slate-400 transition-all duration-300 shrink-0 ${open ? "rotate-180 text-brand" : ""}`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-out overflow-hidden
          ${
            open
              ? "grid-rows-[1fr] opacity-100 mt-2.5"
              : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
      >
        <div className="min-h-0">
          <div className="grid gap-2.5 pl-2 sm:pl-4 border-l-2 border-brand/20 ml-4 pb-1">
            {services.map((s, idx) => {
              const deposit = s.requiresDeposit
                ? Math.round((s.price * s.depositPercent) / 100)
                : 0;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onServicePick?.(s)}
                  className="group text-left"
                  style={{ transitionDelay: open ? `${idx * 40}ms` : "0ms" }}
                >
                  <Card
                    className={`overflow-hidden hover:border-brand/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300
                      ${open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
                  >
                    {/* Info del servicio */}
                    <div className="p-4 flex items-start gap-3">
                      <div className="w-1 h-full min-h-[2.25rem] rounded-full bg-brand/30 group-hover:bg-brand transition" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-slate-900 truncate">
                            {s.name}
                          </h4>
                          {s.requiresDeposit && (
                            <Badge tone="warning">
                              Seña ${deposit.toLocaleString("es-AR")}
                            </Badge>
                          )}
                        </div>
                        {s.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {s.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={12} /> {s.duration} min
                          </span>
                          <span>·</span>
                          <span className="font-semibold text-slate-800">
                            ${s.price.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botón Agendar abajo a la derecha */}
                    <div className="px-4 pb-4 flex justify-end">
                      <span
                        className="inline-flex items-center gap-1.5 text-sm font-semibold
                                   px-3.5 py-2 rounded-xl bg-brand text-white
                                   group-hover:opacity-90 group-active:opacity-100
                                   transition shadow-sm"
                      >
                        <CalendarPlus size={15} />
                        Agendar
                      </span>
                    </div>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
