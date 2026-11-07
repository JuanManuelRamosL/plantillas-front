import { useState, useEffect } from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  MapPin,
  MessageCircle,
  Camera,
  ArrowRight,
} from "lucide-react";
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
  const featuredServices = services?.slice(0, 5) || [];

  return (
    <div className="min-h-screen flex flex-col bg-main">
      {/* HEADER */}
      <header className="w-full px-4 sm:px-6 py-3 flex items-center justify-between max-w-7xl mx-auto relative z-50">
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
            Servicios
          </NavLink>
          <NavLink
            to={`/${business.slug}`}
            className="hover:text-brand transition"
          >
            Horarios
          </NavLink>
          <NavLink
            to={`/${business.slug}`}
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
              Servicios
            </NavLink>
            <NavLink
              to={`/${business.slug}`}
              className="text-xl font-bold text-slate-800 border-b border-slate-100 py-4"
            >
              Horarios
            </NavLink>
            <NavLink
              to={`/${business.slug}`}
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

      <AnimateOnScroll>
        <ReviewsCarousel />
      </AnimateOnScroll>

      {/* FOOTER */}
      <footer
        id="contacto"
        className="relative w-full overflow-hidden border-t border-slate-800"
      >
        <div className="absolute inset-0">
          <img
            src={footerBg}
            alt="Fondo contacto"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-8">
            <AnimateOnScroll delay={0}>
              <div className="text-white order-last md:order-none mt-8 md:mt-0 pt-8 md:pt-0 border-t border-white/10 md:border-0">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-4">
                  {business.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8 leading-relaxed">
                  Tu próximo turno te está esperando. Escribinos y coordinamos.
                </p>

                <button
                  type="button"
                  className="bg-brand text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-brand/30 text-sm sm:text-base w-full sm:w-auto mx-auto md:mx-0"
                >
                  <MessageCircle size={18} className="sm:w-5 sm:h-5" />{" "}
                  Contactar por WhatsApp
                </button>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={150}>
              <div className="text-slate-300">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm mb-4 sm:mb-6">
                  Navegación
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  <li>
                    <NavLink
                      to={`/${business.slug}`}
                      className="hover:text-brand transition flex items-center gap-2 text-sm sm:text-base"
                    >
                      <ArrowRight size={14} className="text-white shrink-0" />{" "}
                      Inicio
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/${business.slug}`}
                      className="hover:text-brand transition flex items-center gap-2 text-sm sm:text-base"
                    >
                      <ArrowRight size={14} className="text-white shrink-0" />{" "}
                      Servicios
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/${business.slug}/perfil`}
                      className="hover:text-brand transition flex items-center gap-2 text-sm sm:text-base"
                    >
                      <ArrowRight size={14} className="text-white shrink-0" />{" "}
                      Mi Perfil / Turnos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/${business.slug}/ingresar`}
                      className="hover:text-brand transition flex items-center gap-2 text-sm sm:text-base"
                    >
                      <ArrowRight size={14} className="text-white shrink-0" />{" "}
                      Iniciar Sesión
                    </NavLink>
                  </li>
                </ul>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={300}>
              <div className="text-slate-300">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm mb-4 sm:mb-6">
                  Servicios
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {featuredServices.length > 0 ? (
                    featuredServices.map((s) => (
                      <li key={s.id}>
                        <NavLink
                          to={`/${business.slug}`}
                          className="hover:text-brand transition flex items-center gap-2 text-sm sm:text-base"
                        >
                          <span className="text-slate-500 text-xs">•</span>{" "}
                          {s.name}
                        </NavLink>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic text-sm">
                      No hay servicios
                    </li>
                  )}
                </ul>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={450}>
              <div className="text-slate-300">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm mb-4 sm:mb-6">
                  Ubicación
                </h3>

                <div className="flex items-start gap-3 mb-6 sm:mb-8">
                  <MapPin
                    size={18}
                    className="text-white shrink-0 mt-0.5 sm:w-5 sm:h-5"
                  />
                  <p className="leading-relaxed text-sm sm:text-base">
                    Dirección no especificada
                  </p>
                </div>

                <h3 className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4">
                  Seguinos
                </h3>
                <div className="flex gap-3 sm:gap-4">
                  <a
                    href={business.visual?.instagramUrl || "#"}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition hover:-translate-y-1"
                  >
                    <Camera size={16} className="sm:w-4.5 sm:h-4.5" />
                  </a>
                  <a
                    href={business.visual?.tiktokUrl || "#"}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition hover:-translate-y-1"
                  >
                    <span className="font-bold text-[10px] sm:text-xs">TT</span>
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 w-full bg-black/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-slate-400 gap-2">
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
