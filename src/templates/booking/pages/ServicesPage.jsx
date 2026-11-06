import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, MapPin } from "lucide-react";
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
  const { business, services, loading } = useBusinessStore();
  const { setService } = useBooking();
  const { customer } = useCustomerAuth();

  const groupedServices = useMemo(
    () => groupServices(services || []),
    [services],
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand" />
      </div>
    );
  }

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
    <div className="bg-main pb-20">
      {/* 1. BANNER DE FONDO */}
      <div className="w-full h-[30vh] min-h-[200px] max-h-[250px] relative">
        <img
          src={heroBg}
          alt="Portada"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-transparent opacity-80"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* 2. INFO DEL LOCAL (Ajustes PC) */}
        <div className="relative -mt-20 sm:-mt-28 md:-mt-20 lg:-mt-24 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[var(--bg-main)] bg-white shadow-md flex items-center justify-center shrink-0 overflow-hidden">
            {business.visual?.logoUrl ? (
              <img
                src={business.visual.logoUrl}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-black text-brand">{initial}</span>
            )}
          </div>

          <div className="mt-0 sm:mt-6">
            {/* 👇 TÍTULO NEGRO PURO EN PC */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 md:text-black tracking-tight mb-1">
              {business.name}
            </h1>
            <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-500">
              <MapPin size={18} className="text-brand" />
              <span>Dirección no especificada</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN DE SERVICIOS (Ajustes PC) */}
      {/* 👇 EN PC BAJAMOS LA SECCIÓN (md:mt-12) Y ACHICAMOS EL TÍTULO (md:text-6xl) */}
      <section
        id="servicios"
        className="max-w-7xl mx-auto px-6 pt-0 pb-10 mb-10 md:mt-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 text-left">
          <h2 className="text-5xl sm:text-7xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">
            Servicios
            <br />y precios
          </h2>
          <p className="text-slate-500 max-w-[250px] text-sm mt-4 md:mt-0 text-left">
            Tocá "Reservar" en el servicio que quieras y elegí día y horario.
          </p>
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

      {/* 4. CONTACTO */}
      <section id="contacto" className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-white rounded-3xl p-8 sm:p-16 flex flex-col lg:flex-row gap-12 border border-slate-200 shadow-sm">
          <div className="flex-1">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-8 text-slate-900">
              Contacto
            </h2>
            <p className="text-2xl sm:text-4xl font-bold mb-8 text-slate-800">
              {business.supportPhone || "+54 9 11 0000-0000"}
            </p>

            <div className="flex gap-3 mb-10">
              <button
                type="button"
                className="bg-brand text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition"
              >
                WhatsApp
              </button>
              <button
                type="button"
                className="border border-slate-300 text-slate-700 px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-slate-50 transition"
              >
                Llamar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-slate-400 font-bold mb-1 uppercase tracking-wider text-xs">
                  Dirección
                </p>
                <p className="text-slate-700 font-medium">
                  Dirección no especificada
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-bold mb-1 uppercase tracking-wider text-xs">
                  Seguinos
                </p>
                <div className="flex gap-4 font-medium text-slate-700">
                  <a
                    href={business.visual?.instagramUrl || "#"}
                    className="hover:text-brand transition"
                  >
                    Instagram
                  </a>
                  <a
                    href={business.visual?.tiktokUrl || "#"}
                    className="hover:text-brand transition"
                  >
                    TikTok
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center min-h-[300px]">
            <p className="text-slate-400">Mapa de ubicación</p>
          </div>
        </div>
      </section>
    </div>
  );
}
