import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import {
  getBusinessBySlug,
  groupServicesByCategory,
} from "../mocks/businesses";
import { useBooking } from "../context/BookingContext";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import ServiceCategoryGroup from "../components/ServiceCategoryGroup";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

// Normaliza texto: minúsculas y sin tildes (para buscar "coloracion" y encontrar "Coloración")
function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function ServicesPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const business = getBusinessBySlug(slug);
  const { setService } = useBooking();
  const { customer } = useCustomerAuth();

  const allGrouped = business ? groupServicesByCategory(business.services) : [];
  const allCategories = allGrouped.map(([cat]) => cat);

  const [openCategory, setOpenCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");

  // Reset al cambiar de negocio
  useEffect(() => {
    setOpenCategory(null);
    setQuery("");
    setActiveCategory("Todas");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Filtrado reactivo
  const filteredGrouped = useMemo(() => {
    if (!business) return [];
    const q = normalize(query.trim());

    return allGrouped
      .map(([category, services]) => {
        // Filtro por categoría activa
        if (activeCategory !== "Todas" && category !== activeCategory) {
          return [category, []];
        }
        // Filtro por texto
        const matches = services.filter((s) => {
          if (!q) return true;
          return (
            normalize(s.name).includes(q) ||
            normalize(s.description).includes(q)
          );
        });
        return [category, matches];
      })
      .filter(([, services]) => services.length > 0);
  }, [allGrouped, query, activeCategory, business]);

  const isFiltering = query.trim().length > 0 || activeCategory !== "Todas";
  const totalResults = filteredGrouped.reduce(
    (acc, [, s]) => acc + s.length,
    0,
  );

  if (!business) return null;

  const toggle = (category) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  const handleServicePick = (service) => {
    const deposit = service.requiresDeposit
      ? Math.round((service.price * service.depositPercent) / 100)
      : 0;

    setService(service.id, service.requiresDeposit, deposit);

    if (!customer) {
      navigate(`/${slug}/ingresar`, { state: { from: `/${slug}/experto` } });
    } else {
      navigate(`/${slug}/experto`);
    }
  };

  const clearFilters = () => {
    setQuery("");
    setActiveCategory("Todas");
  };

  const showCategoryChips = allCategories.length >= 2;

  return (
    <div>
      <header className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Elegí un servicio
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Seleccioná lo que necesitás y avanzá con el turno.
        </p>
      </header>

      {business.services.length === 0 ? (
        <EmptyState
          title="Sin servicios disponibles"
          description="Este negocio todavía no cargó servicios."
        />
      ) : (
        <>
          {/* Buscador */}
          <div className="relative mb-3">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar servicio…"
              className="w-full pl-9 pr-9 py-3 rounded-2xl border border-slate-200 bg-white text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
                           flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                aria-label="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Chips de categoría */}
          {showCategoryChips && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              <CategoryChip
                label="Todas"
                active={activeCategory === "Todas"}
                onClick={() => setActiveCategory("Todas")}
              />
              {allCategories.map((cat) => (
                <CategoryChip
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </div>
          )}

          {/* Contador de resultados cuando se filtra */}
          {isFiltering && (
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <span>
                {totalResults} {totalResults === 1 ? "resultado" : "resultados"}
                {query && <> para "{query}"</>}
              </span>
              <button
                onClick={clearFilters}
                className="font-medium text-brand hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Lista agrupada */}
          {filteredGrouped.length === 0 ? (
            <EmptyState
              title="Sin resultados"
              description="No encontramos servicios que coincidan con tu búsqueda."
              action={
                <Button onClick={clearFilters} variant="outline">
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <div>
              {filteredGrouped.map(([category, services]) => (
                <ServiceCategoryGroup
                  key={category}
                  slug={slug}
                  category={category}
                  services={services}
                  // Si hay filtro activo, abrimos todas las categorías con resultados
                  open={isFiltering ? true : openCategory === category}
                  onToggle={() => toggle(category)}
                  onServicePick={handleServicePick}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CategoryChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition border
        ${
          active
            ? "bg-brand text-white border-brand"
            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
        }`}
    >
      {label}
    </button>
  );
}
