import { Clock } from "lucide-react";
import Card from "./ui/Card";

export default function ServiceCategoryGroup({
  slug,
  category,
  services,
  onServicePick,
}) {
  return (
    <div className="mb-16 last:mb-0">
      {/* Título de la Categoría */}
      {category && category !== "Otros" && (
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 capitalize">
            {category}
          </h3>
          <div className="h-px bg-slate-300 flex-1 mt-2"></div>
          <span className="text-sm font-medium text-slate-400 mt-2">
            {services.length} {services.length === 1 ? "opción" : "opciones"}
          </span>
        </div>
      )}

      {/* Grilla de Servicios de esta categoría */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, idx) => (
          <Card
            key={s.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-slate-300">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock size={14} /> {s.duration} min
                </span>
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-2">
                {s.name}
              </h4>

              {s.description && (
                <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100">
              <div className="text-2xl font-bold text-slate-900">
                ${s.price.toLocaleString("es-AR")}
              </div>
              <button
                type="button"
                onClick={() => onServicePick(s)}
                className="bg-brand text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition shadow-sm"
              >
                Reservar
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
