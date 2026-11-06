import { useState, useEffect } from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import { Loader2, Menu, X } from "lucide-react";
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LayoutInner({ business }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const { customer } = useCustomerAuth();
  const location = useLocation();

  // Cierra el menú automáticamente si cambia la ruta
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

  return (
    <div className="min-h-screen flex flex-col bg-main">
      <header className="w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto relative z-50">
        {/* LOGO: Lleva al inicio del negocio */}
        <NavLink
          to={`/${business.slug}`}
          className="flex items-baseline gap-2"
          onClick={() => setIsOpen(false)}
        >
          <span className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
            {business.name}
          </span>
          <span className="text-sm font-medium text-slate-500 hidden sm:block">
            {business.category}
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-800">
          {/* Si ya está en el inicio, scrollea suave. Si no, navega al inicio. */}
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
            className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition shadow-sm"
          >
            {customer ? "Mi perfil" : "Reservar"}
          </NavLink>
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-slate-900 focus:outline-none transition-transform active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Menú Mobile Animado */}
      {isMounted && (
        <div
          className={`fixed inset-0 z-40 md:hidden bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
            animateIn ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`absolute top-0 left-0 right-0 bg-white shadow-2xl rounded-b-[2rem] pt-24 pb-10 px-6 flex flex-col gap-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
              className="mt-6 bg-brand text-white font-bold text-center px-6 py-4 rounded-full shadow-lg text-lg hover:opacity-90 transition"
            >
              {customer ? "Mi perfil" : "Reservar turno"}
            </NavLink>
          </div>
        </div>
      )}

      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-10 mt-20 border-t border-slate-300 flex justify-between items-center text-sm text-slate-500">
        <span className="font-bold text-slate-900">{business.name}</span>
        <span>
          © {new Date().getFullYear()} {business.name}
        </span>
      </footer>
    </div>
  );
}

export default function BookingLayout() {
  const { slug } = useParams();
  const { business, loading, error, fetchBusinessData } = useBusinessStore();

  useEffect(() => {
    fetchBusinessData(slug);
  }, [slug, fetchBusinessData]);

  useEffect(() => {
    if (business?.visual?.brandColor) {
      applyBrandPalette(business.visual.brandColor);
    }
  }, [business]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
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
              <LayoutInner business={business} />
            </BookingProvider>
          </ReviewsProvider>
        </PointsProvider>
      </BookingsProvider>
    </CustomerAuthProvider>
  );
}
