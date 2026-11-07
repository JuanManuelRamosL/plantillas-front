import { useState } from "react";
import { Clock, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import Card from "./ui/Card";

export default function ServiceCategoryGroup({
  slug,
  category,
  services,
  onServicePick,
}) {
  const [isExpandedList, setIsExpandedList] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);

  const sortedServices = [...services].sort((a, b) => {
    if (a.imageUrl && !b.imageUrl) return -1;
    if (!a.imageUrl && b.imageUrl) return 1;
    return 0;
  });

  const hasMoreThanThree = sortedServices.length >= 4;
  const displayedServices =
    hasMoreThanThree && !isExpandedList
      ? sortedServices.slice(0, 3)
      : sortedServices;

  const toggleDescription = (id) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

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

      {/* Grilla de Servicios (items-end para que las cards chicas se anclen al piso) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-end">
        {displayedServices.map((s) => {
          const isDescExpanded = expandedCardId === s.id;

          return (
            <Card
              key={s.id}
              /* h-full solo si tiene imagen para estirarse, si no, tamaño natural */
              className={`bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 ${s.imageUrl ? "h-full" : ""}`}
            >
              {/* IMAGEN */}
              {s.imageUrl && (
                <div className="w-full h-44 sm:h-48 relative shrink-0 bg-slate-100 overflow-hidden">
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              {/* CONTENIDO DE LA TARJETA */}
              {/* flex-1 solo si tiene imagen, para empujar el botón abajo */}
              <div
                className={`p-4 sm:p-6 flex flex-col ${s.imageUrl ? "flex-1" : ""}`}
              >
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
                    <div
                      className="relative cursor-pointer group/desc"
                      onClick={() => toggleDescription(s.id)}
                    >
                      <p
                        className={`text-xs sm:text-sm text-slate-500 leading-relaxed transition-all duration-300 ease-in-out ${
                          isDescExpanded ? "line-clamp-none" : "line-clamp-2"
                        }`}
                      >
                        {s.description}
                      </p>

                      {!isDescExpanded && s.description.length > 60 && (
                        <div className="flex items-center gap-0.5 text-[10px] sm:text-xs font-bold text-brand mt-1 group-hover/desc:opacity-80 transition">
                          Ver más <ChevronRight size={12} />
                        </div>
                      )}

                      {isDescExpanded && (
                        <div className="flex items-center gap-0.5 text-[10px] sm:text-xs font-bold text-brand mt-2 group-hover/desc:opacity-80 transition">
                          Ver menos <ChevronUp size={12} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Botonera (mt-auto solo si tiene imagen para irse al fondo) */}
                <div
                  className={`flex flex-col min-[360px]:flex-row items-start min-[360px]:items-center justify-between border-t border-slate-100 gap-3 min-[360px]:gap-0 pt-4 sm:pt-5 ${s.imageUrl ? "mt-auto" : "mt-5"}`}
                >
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
          );
        })}
      </div>

      {/* Botón para expandir/colapsar categoría */}
      {hasMoreThanThree && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setIsExpandedList(!isExpandedList)}
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-600 font-bold text-sm hover:border-brand hover:text-brand transition-colors bg-white shadow-sm"
          >
            {isExpandedList ? (
              <>
                Ver menos <ChevronUp size={18} />
              </>
            ) : (
              <>
                Ver más servicios <ChevronDown size={18} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
