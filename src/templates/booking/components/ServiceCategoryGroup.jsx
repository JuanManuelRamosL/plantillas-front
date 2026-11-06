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
        <div className="flex items-center gap-2 sm:gap-4 mb-6">
          <h3 className="text-2xl sm:text-4xl font-black tracking-tighter text-slate-900 capitalize">
            {category}
          </h3>
          <div className="h-px bg-slate-300 flex-1 mt-2"></div>
          <span className="text-xs sm:text-sm font-medium text-slate-400 mt-2">
            {services.length} {services.length === 1 ? "opción" : "opciones"}
          </span>
        </div>
      )}

      {/* Grilla de Servicios (Usamos items-end para alinear al piso) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-end">
        {services.map((s) => (
          <Card
            key={s.id}
            className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* IMAGEN DEL SERVICIO (Solo se renderiza si existe) */}
            {s.imageUrl && (
              <div className="w-full h-40 sm:h-52 shrink-0 bg-slate-100">
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* CONTENIDO DE LA TARJETA */}
            <div className="p-4 sm:p-6 flex flex-col">
              <div>
                <div className="flex items-center mb-2 sm:mb-3">
                  <span className="text-[10px] sm:text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1">
                    <Clock size={12} className="sm:w-3.5 sm:h-3.5" />{" "}
                    {s.duration} min
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2 leading-tight">
                  {s.name}
                </h4>

                {s.description && (
                  <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>
                )}
              </div>

              {/* Botonera anclada al fondo de la tarjeta */}
              <div className="flex flex-col min-[360px]:flex-row items-start min-[360px]:items-center justify-between mt-auto pt-4 sm:pt-5 border-t border-slate-100 gap-3 min-[360px]:gap-0">
                <div className="text-xl sm:text-2xl font-bold text-slate-900">
                  ${s.price.toLocaleString("es-AR")}
                </div>
                <button
                  type="button"
                  onClick={() => onServicePick(s)}
                  className="bg-brand text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:opacity-90 transition shadow-sm w-full min-[360px]:w-auto text-center"
                >
                  Reservar
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
