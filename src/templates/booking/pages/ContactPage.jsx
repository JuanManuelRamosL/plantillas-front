import { useParams } from "react-router-dom";
import { MapPin, MessageCircle, ArrowUpRight, Clock } from "lucide-react";
import { useBusinessStore } from "../../../store/useBusinessStore";
import AnimateOnScroll from "../components/AnimateOnScroll";
import SocialIcon from "../components/SocialIcon";

export default function ContactPage() {
  const { slug } = useParams();
  const { business, loading } = useBusinessStore();

  if (loading || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main">
        Cargando...
      </div>
    );
  }

  const mapQuery = encodeURIComponent(
    business.address || "Av. Corrientes 1234, CABA",
  );
  const mapUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  // Armamos el array de redes sociales (misma lógica que en el footer)
  const socialNetworks = [
    { category: "instagram", url: business.visual?.instagramUrl },
    { category: "tiktok", url: business.visual?.tiktokUrl },
    { category: "facebook", url: business.visual?.facebookUrl },
    { category: "twitter", url: business.visual?.twitterUrl },
    { category: "whatsapp", url: business.visual?.whatsappUrl },
  ].filter((network) => network.url);

  return (
    <div className="bg-main pb-20 pt-8 sm:pt-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll>
          <header className="mb-10 text-center sm:text-left">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-black leading-none mb-4">
              Contacto
            </h1>
            <p className="text-black text-lg sm:text-xl max-w-2xl font-medium mx-auto sm:mx-0">
              ¿Tenés alguna duda o querés coordinar algo? Escribinos por
              WhatsApp o acercate a nuestro local.
            </p>
          </header>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <div className="w-full h-[300px] sm:h-[500px] rounded-3xl overflow-hidden relative bg-slate-200 shadow-sm border border-slate-200 mb-16">
            <iframe
              title="Ubicación del negocio"
              src={mapUrl}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Ubicación */}
          <AnimateOnScroll
            delay={200}
            className="flex flex-col items-center text-center md:items-start md:text-left"
          >
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-black mb-5">
              <MapPin size={28} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-3">
                Ubicación
              </h3>
              <p className="text-lg font-medium text-black mb-4">
                {business.address || "Dirección no especificada"}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-bold text-black hover:text-brand transition border-b border-black pb-0.5"
              >
                Abrir en Google Maps <ArrowUpRight size={16} />
              </a>
            </div>
          </AnimateOnScroll>

          {/* Contacto Directo */}
          <AnimateOnScroll
            delay={300}
            className="flex flex-col items-center text-center md:items-start md:text-left border-y md:border-y-0 border-slate-200 py-10 md:py-0"
          >
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-black mb-5">
              <MessageCircle size={28} />
            </div>
            <div className="w-full">
              <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-3">
                Contacto Directo
              </h3>
              <p className="text-lg font-medium text-black mb-6">
                {business.supportPhone || "+54 9 11 0000-0000"}
              </p>

              <button
                type="button"
                className="bg-black text-white w-full sm:w-auto px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform text-sm mx-auto md:mx-0"
              >
                <MessageCircle size={18} /> Escribir por WhatsApp
              </button>
            </div>
          </AnimateOnScroll>

          {/* Horarios y Redes */}
          <AnimateOnScroll
            delay={400}
            className="flex flex-col items-center text-center md:items-start md:text-left"
          >
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-black mb-5">
              <Clock size={28} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-3">
                Horarios y Redes
              </h3>
              <p className="text-lg font-medium text-black mb-6">
                Lun a Sáb de 10 a 20 hs.
              </p>

              <div className="flex justify-center md:justify-start gap-6">
                {socialNetworks.length > 0 ? (
                  socialNetworks.map((network) => (
                    <a
                      key={network.category}
                      href={network.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-black hover:text-brand transition capitalize"
                    >
                      <SocialIcon category={network.category} size={18} />
                      {network.category === "twitter" ? "X" : network.category}
                    </a>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-sm">
                    No hay redes cargadas
                  </p>
                )}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </div>
  );
}
