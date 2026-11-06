import { useState, useEffect } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import {
  Calendar,
  ShoppingBag,
  User,
  MapPin,
  GraduationCap,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useBusinessStore } from "../../store/useBusinessStore";
import { applyBrandPalette } from "../../utils/palettes";
import {
  CustomerAuthProvider,
  useCustomerAuth,
} from "./auth/CustomerAuthContext";
// 👇 VOLVEMOS A IMPORTAR EL BOOKING PROVIDER
import { BookingProvider } from "./context/BookingContext";
import { BookingsProvider } from "./context/BookingsContext";
import { PointsProvider } from "./context/PointsContext";
import { ReviewsProvider } from "./context/ReviewsContext";

function LayoutInner({ business }) {
  const { customer } = useCustomerAuth();
  const [page, setPage] = useState(0);

  const navItem = ({ isActive }) =>
    `flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition
     ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`;

  const mobileItem = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 py-3 text-[11px] w-full ${isActive ? "text-brand" : "text-slate-500"}`;

  const showExtras =
    business.address || business.modules?.courses || business.modules?.app;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <img
            src={
              business.visual?.logoUrl || "https://placehold.co/80x80?text=Logo"
            }
            alt={business.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-slate-900 truncate">
              {business.name}
            </h1>
            <p className="text-[11px] text-slate-500 truncate">
              {business.category}
            </p>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            <NavLink to={`/${business.slug}`} end className={navItem}>
              <Calendar size={16} /> Turnos
            </NavLink>
            {business.modules?.products && (
              <NavLink to={`/${business.slug}/productos`} className={navItem}>
                <ShoppingBag size={16} /> Productos
              </NavLink>
            )}
            {business.address && (
              <NavLink
                to={`/${business.slug}/donde-estamos`}
                className={navItem}
              >
                <MapPin size={16} /> Ubicación
              </NavLink>
            )}
            {business.modules?.courses && (
              <NavLink to={`/${business.slug}/cursos`} className={navItem}>
                <GraduationCap size={16} /> Cursos
              </NavLink>
            )}
            {business.modules?.app && (
              <NavLink to={`/${business.slug}/nuestra-app`} className={navItem}>
                <Smartphone size={16} /> App
              </NavLink>
            )}
            <NavLink to={`/${business.slug}/perfil`} className={navItem}>
              <User size={16} /> {customer ? "Mi perfil" : "Ingresar"}
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-8">
          <Outlet />
        </div>
      </main>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-20 overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ width: "200%", transform: `translateX(-${page * 50}%)` }}
        >
          <div className="w-1/2 grid grid-cols-4 items-stretch">
            <NavLink to={`/${business.slug}`} end className={mobileItem}>
              <Calendar size={18} /> Turnos
            </NavLink>
            {business.modules?.products && (
              <NavLink
                to={`/${business.slug}/productos`}
                className={mobileItem}
              >
                <ShoppingBag size={18} /> Productos
              </NavLink>
            )}
            <NavLink to={`/${business.slug}/perfil`} className={mobileItem}>
              <User size={18} /> {customer ? "Perfil" : "Ingresar"}
            </NavLink>
            {showExtras ? (
              <button
                type="button"
                onClick={() => setPage(1)}
                className="flex flex-col items-center justify-center gap-1 py-3 text-[11px] text-slate-500 w-full"
              >
                <ChevronLeft size={18} className="text-brand" /> Más
              </button>
            ) : (
              <div />
            )}
          </div>
          <div className="w-1/2 grid grid-cols-4 items-stretch">
            <button
              type="button"
              onClick={() => setPage(0)}
              className="flex flex-col items-center justify-center gap-1 py-3 text-[11px] text-slate-500 w-full"
            >
              <ChevronRight size={18} className="text-brand" /> Volver
            </button>
            {business.address && (
              <NavLink
                to={`/${business.slug}/donde-estamos`}
                className={mobileItem}
              >
                <MapPin size={18} /> Ubicación
              </NavLink>
            )}
            {business.modules?.courses && (
              <NavLink to={`/${business.slug}/cursos`} className={mobileItem}>
                <GraduationCap size={18} /> Cursos
              </NavLink>
            )}
            {business.modules?.app && (
              <NavLink
                to={`/${business.slug}/nuestra-app`}
                className={mobileItem}
              >
                <Smartphone size={18} /> App
              </NavLink>
            )}
          </div>
        </div>
      </nav>
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Negocio no encontrado
          </h2>
          <p className="text-sm text-slate-500 mt-1">
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
            {/* 👇 ACÁ ESTÁ EL PROVIDER QUE FALTABA */}
            <BookingProvider slug={slug}>
              <LayoutInner business={business} />
            </BookingProvider>
          </ReviewsProvider>
        </PointsProvider>
      </BookingsProvider>
    </CustomerAuthProvider>
  );
}
 