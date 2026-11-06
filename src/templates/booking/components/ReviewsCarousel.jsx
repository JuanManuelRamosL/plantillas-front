import { useState, useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function ReviewsCarousel() {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Comentarios de prueba
  const reviews = [
    {
      id: 1,
      name: "Juan Pérez",
      rating: 5,
      text: "Excelente atención. El corte quedó perfecto y el lugar es muy cómodo. Súper recomendable.",
      date: "Hace 2 días",
    },
    {
      id: 2,
      name: "María González",
      rating: 5,
      text: "Me encantó el detalle con el que trabajan. Fui por un cambio de look y superó mis expectativas.",
      date: "Hace 1 semana",
    },
    {
      id: 3,
      name: "Lucas Rodríguez",
      rating: 4,
      text: "Muy buena onda y profesionalismo. El turno fue puntual y el lugar tiene una estética increíble.",
      date: "Hace 2 semanas",
    },
    {
      id: 4,
      name: "Sofía Martínez",
      rating: 5,
      text: "El mejor lugar de la zona. Salí sintiéndome renovada. Ya agendé mi próximo turno.",
      date: "Hace 3 semanas",
    },
    {
      id: 5,
      name: "Carlos Ruiz",
      rating: 5,
      text: "Atención de 10. El lugar es impecable y los precios son muy justos.",
      date: "Hace 1 mes",
    },
  ];

  // Auto-scroll
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { current } = scrollRef;

        if (
          current.scrollLeft >=
          current.scrollWidth - current.clientWidth - 10
        ) {
          current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const scrollAmount = window.innerWidth > 768 ? 400 : 300;
          current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = window.innerWidth > 768 ? 400 : 300;

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="w-full bg-slate-50 py-20 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 flex items-end justify-between">
        {/* Título limpio, sin el texto "Opiniones" arriba */}
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Lo que dicen de nosotros
        </h2>

        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!showLeftArrow}
            className={`w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center transition
              ${showLeftArrow ? "hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700" : "opacity-30 cursor-not-allowed text-slate-400"}`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!showRightArrow}
            className={`w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center transition
              ${showRightArrow ? "hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700" : "opacity-30 cursor-not-allowed text-slate-400"}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Contenedor del Carrusel */}
      <div
        className="max-w-7xl mx-auto pl-6 sm:pl-8 md:pl-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="snap-start shrink-0 w-[280px] sm:w-[350px] bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      }
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  "{review.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    {review.name}
                  </p>
                  <p className="text-xs text-slate-400">{review.date}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="w-6 shrink-0"></div>
        </div>
      </div>
    </div>
  );
}
