import { useState, useEffect } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { Loader2, ChevronLeft, Clock } from "lucide-react";
import { useBusinessStore } from "../../../store/useBusinessStore";
import { useBookingStore } from "../../../store/useBookingStore";
import { apiFetch } from "../../../api/client";
import AnimateOnScroll from "../components/AnimateOnScroll";
import Card from "../components/ui/Card";

export default function ExpertPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { business } = useBusinessStore();
  const { service, setExpert } = useBookingStore();

  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Si no hay servicio seleccionado, volvemos al inicio
  if (!service) {
    return <Navigate to={`/${slug}`} replace />;
  }

  useEffect(() => {
    // Traemos los expertos que hacen ESE servicio específico
    apiFetch(`/b/${slug}/experts?serviceId=${service.id}`)
      .then((data) => setExperts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug, service.id]);

  const handleSelectExpert = (expert) => {
    setExpert(expert);
    navigate(`/${slug}/fecha`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-main pb-20 pt-8 sm:pt-12 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate(`/${slug}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand transition mb-8 group"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Volver a servicios
        </button>

        <AnimateOnScroll>
          <header className="mb-10">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 leading-none mb-4">
              Elegí un profesional
            </h1>
            <p className="text-slate-500 text-lg">
              Para{" "}
              <span className="font-bold text-slate-900">{service.name}</span> (
              {service.duration} min)
            </p>
          </header>
        </AnimateOnScroll>

        {experts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No hay profesionales disponibles para este servicio en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {experts.map((expert, index) => (
              <AnimateOnScroll key={expert.id} delay={index * 100}>
                <Card
                  className="card-hover bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-6 cursor-pointer"
                  onClick={() => handleSelectExpert(expert)}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border-2 border-slate-200">
                    {expert.imageUrl ? (
                      <img
                        src={expert.imageUrl}
                        alt={expert.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-black text-slate-300">
                        {expert.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                      {expert.name}
                    </h2>
                    {expert.description && (
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {expert.description}
                      </p>
                    )}
                  </div>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
