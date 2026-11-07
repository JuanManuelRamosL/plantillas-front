import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useBusinessStore } from "../../../store/useBusinessStore";
import { useBooking } from "../context/BookingContext";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import ServiceCategoryGroup from "../components/ServiceCategoryGroup";

function groupServices(services) {
  const groups = new Map();
  for (const s of services) {
    const key = s.category || "Otros";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export default function ServicesPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { business, services } = useBusinessStore();
  const { setService } = useBooking();
  const { customer } = useCustomerAuth();

  const groupedServices = useMemo(
    () => groupServices(services || []),
    [services],
  );

  if (!business) return null;

  const handleServicePick = (service) => {
    const requiresDeposit = business?.depositMode !== "none";
    const depositAmount = requiresDeposit ? business.depositValue : 0;
    setService(service.id, requiresDeposit, depositAmount);

    if (!customer) {
      navigate(`/${slug}/ingresar`, { state: { from: `/${slug}/experto` } });
    } else {
      navigate(`/${slug}/experto`);
    }
  };

  const heroBg =
    business.visual?.coverImageUrl ||
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2000&auto=format&fit=crop";
  const initial = business.name.charAt(0).toUpperCase();

  return (
    <div className="bg-main pb-10">
      {/* 1. BANNER DE FONDO CON BLUR Y DIFUMINADO HACIA ABAJO */}
      <div className="w-full h-[30vh] min-h-[200px] max-h-[250px] relative overflow-hidden">
        <img
          src={heroBg}
          alt="Portada"
          className="w-full h-full object-cover object-center blur-[2px] scale-105"
        />
        {/* Gradiente más sutil: empieza a difuminar recién en el último 30% de la imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* 2. INFO DEL LOCAL */}
        <div className="relative -mt-16 sm:-mt-20 md:-mt-20 lg:-mt-24 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-[var(--bg-main)] bg-white shadow-md flex items-center justify-center shrink-0 overflow-hidden">
            {business.visual?.logoUrl ? (
              <img
                src={business.visual.logoUrl}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl sm:text-4xl font-black text-brand">
                {initial}
              </span>
            )}
          </div>

          <div className="mt-0 sm:mt-6">
            <h1 className="text-2xl sm:text-5xl font-black text-slate-900 md:text-black tracking-tight mb-1">
              {business.name}
            </h1>
            <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-500">
              <MapPin size={16} className="text-black" />
              <span>Dirección no especificada</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN DE SERVICIOS */}
      <section
        id="servicios"
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-0 pb-10 mb-10 md:mt-12"
      >
        <div className="mb-8 text-left">
          <h2 className="text-4xl sm:text-6xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-none">
            Servicios
            <br />y precios
          </h2>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            Este negocio no tiene servicios cargados.
          </div>
        ) : (
          <div>
            {groupedServices.map(([category, items]) => (
              <ServiceCategoryGroup
                key={category}
                slug={slug}
                category={category}
                services={items}
                open={true}
                onToggle={() => {}}
                onServicePick={handleServicePick}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
