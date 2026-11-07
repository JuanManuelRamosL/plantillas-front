import { useState, useEffect } from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import { Menu, X, MapPin, MessageCircle } from "lucide-react";
import { useBusinessStore } from "../../store/useBusinessStore";
import { applyBrandPalette } from "../../utils/palettes";
import {
  CustomerAuthProvider,
  useCustomerAuth,
} from "./auth/CustomerAuthContext";
import { BookingProvider } from "./context/BookingContext";
import { BookingsProvider } from "./context/BookingsContext";
import { PointsProvider } from "./context/PointsContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import ReviewsCarousel from "./components/ReviewsCarousel";
import SkeletonLoader from "./components/SkeletonLoader";
import AnimateOnScroll from "./components/AnimateOnScroll";
import SocialIcon from "./components/SocialIcon";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LayoutInner({ business, services }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const { customer } = useCustomerAuth();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const raf = requestAnimationFrame(() => {
        setTimeout(() => setAnimateIn(true), 20);
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setIsMounted(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const footerBg =
    business.visual?.coverImageUrl ||
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2000&auto=format&fit=crop";
  const isHome =
    location.pathname === `/${business.slug}` ||
    location.pathname === `/${business.slug}/`;

  // Armamos el array de redes sociales dinámicamente según lo que tenga cargado el negocio
  const socialNetworks = [
    { category: "instagram", url: business.visual?.instagramUrl },
    { category: "tiktok", url: business.visual?.tiktokUrl },
    { category: "facebook", url: business.visual?.facebookUrl },
    { category: "twitter", url: business.visual?.twitterUrl },
    { category: "whatsapp", url: business.visual?.whatsappUrl },
  ].filter((network) => network.url); // Filtramos solo las que tienen URL

  return (
    <div className="min-h-screen flex flex-col bg-main">
      {/* HEADER FIJO */}
      <header className="w-full sticky top-0 z-50 bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <NavLink
            to={`/${business.slug}`}
            className="flex items-baseline gap-2"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-xl sm:text-3xl font-black tracking-tighter text-slate-900 uppercase">
              {business.name}
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-800">
            <NavLink
              to={`/${business.slug}`}
              className="hover:text-brand transition"
            >
              Inicio
            </NavLink>
            <NavLink
              to={`/${business.slug}`}
              className="hover:text-brand transition"
            >
              Servicios
            </NavLink>
            <NavLink
              to={`/${business.slug}/contacto`}
              className="hover:text-brand transition"
            >
              Contacto
            </NavLink>
            <NavLink
              to={`/${business.slug}/perfil`}
              className="bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-slate-800 hover:scale-105 transition-all shadow-sm"
            >
              {customer ? "Mi perfil" : "Reservar"}
            </NavLink>
          </nav>

          <button
            className="md:hidden p-2 -mr-2 text-slate-900 focus:outline-none transition-transform active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MENÚ MOBILE */}
      {isMounted && (
        <div
          className={`fixed inset-0 z-40 md:hidden bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
            animateIn ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`absolute top-0 left-0 right-0 bg-white shadow-2xl rounded-b-[2rem] pt-20 pb-8 px-6 flex flex-col gap-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              animateIn
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <NavLink
              to={`/${business.slug}`}
              className="text-xl font-bold text-slate-800 border-b border-slate-100 py-4"
            >
              Inicio
            </NavLink>
            <NavLink
              to={`/${business.slug}`}
              className="text-xl font-bold text-slate-800 border-b border-slate-100 py-4"
            >
              Servicios
            </NavLink>
            <NavLink
              to={`/${business.slug}/contacto`}
              className="text-xl font-bold text-slate-800 border-b border-slate-100 py-4"
            >
              Contacto
            </NavLink>
            <NavLink
              to={`/${business.slug}/perfil`}
              className="mt-6 bg-brand text-white font-bold text-center px-6 py-3.5 rounded-full shadow-lg text-lg hover:opacity-90 transition"
            >
              {customer ? "Mi perfil" : "Reservar turno"}
            </NavLink>
          </div>
        </div>
      )}

      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>

      {isHome && (
        <AnimateOnScroll>
          <ReviewsCarousel />
        </AnimateOnScroll>
      )}

      {/* FOOTER MINIMALISTA */}
      <footer className="relative w-full overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0">
          <img
            src={footerBg}
            alt="Fondo contacto"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col md:grid md:grid-cols-3 gap-12 lg:gap-8 items-start">
            {/* 1. UBICACIÓN */}
            <AnimateOnScroll
              delay={0}
              className="order-1 md:order-none flex flex-col items-center text-center md:items-start md:text-left w-full"
            >
              <h3 className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm mb-6">
                Ubicación
              </h3>
              <div className="flex flex-row items-center md:items-start gap-3">
                <MapPin size={24} className="text-white shrink-0" />
                <p className="leading-relaxed text-sm sm:text-lg text-slate-300">
                  Dirección no especificada
                </p>
              </div>
            </AnimateOnScroll>

            {/* 2. REDES SOCIALES (Ahora dinámico) */}
            <AnimateOnScroll
              delay={150}
              className="order-2 md:order-none flex flex-col items-center text-center md:items-start md:text-left w-full"
            >
              <h3 className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm mb-6">
                Seguinos en redes
              </h3>
              <div className="flex gap-4">
                {socialNetworks.length > 0 ? (
                  socialNetworks.map((network) => (
                    <a
                      key={network.category}
                      href={network.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition hover:-translate-y-1 text-white capitalize"
                      title={network.category}
                    >
                      <SocialIcon category={network.category} size={20} />
                    </a>
                  ))
                ) : (
                  <p className="text-slate-500 italic text-sm">
                    No hay redes cargadas
                  </p>
                )}
              </div>
            </AnimateOnScroll>

            {/* 3. MARCA Y WHATSAPP */}
            <AnimateOnScroll
              delay={300}
              className="order-3 md:order-none flex flex-col items-center text-center md:items-start md:text-left w-full mt-4 md:mt-0 pt-8 md:pt-0 border-t border-white/10 md:border-0"
            >
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase text-white mb-4">
                {business.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mb-8 leading-relaxed max-w-xs mx-auto md:mx-0">
                Tu próximo turno te está esperando. Escribinos y coordinamos.
              </p>

              <button
                type="button"
                className="bg-brand text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-brand/30 text-sm sm:text-base w-full sm:w-auto"
              >
                <MessageCircle size={18} className="sm:w-5 sm:h-5" /> Contactar
                por WhatsApp
              </button>
            </AnimateOnScroll>
          </div>
        </div>

        {/* Línea de Copyright */}
        <div className="relative z-10 border-t border-white/10 w-full bg-black/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-slate-400 gap-2">
            <p className="font-bold text-white text-sm sm:text-base uppercase">
              {business.name}
            </p>
            <p className="text-center sm:text-right">
              © {new Date().getFullYear()} {business.name}. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function BookingLayout() {
  const { slug } = useParams();
  const { business, services, loading, error, fetchBusinessData } =
    useBusinessStore();

  useEffect(() => {
    fetchBusinessData(slug);
  }, [slug, fetchBusinessData]);

  useEffect(() => {
    if (business?.visual?.brandColor) {
      applyBrandPalette(business.visual.brandColor);
    }
  }, [business]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center bg-main">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Negocio no encontrado
          </h2>
          <p className="text-slate-500 mt-2">
            {error || `No existe un negocio con la URL "${slug}".`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <CustomerAuthProvider>
      <BookingsProvider>
        <PointsProvider>
          <ReviewsProvider slug={slug}>
            <BookingProvider slug={slug}>
              <ScrollToTop />
              <LayoutInner business={business} services={services} />
            </BookingProvider>
          </ReviewsProvider>
        </PointsProvider>
      </BookingsProvider>
    </CustomerAuthProvider>
  );
}
