import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { useBusinessStore } from "../../../store/useBusinessStore";
import { useBooking } from "../context/BookingContext"; // Lo dejamos por ahora para la selección
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import ServiceCategoryGroup from "../components/ServiceCategoryGroup";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Función auxiliar para agrupar (como los servicios vienen planos del back, los agrupamos acá)
function groupServices(services) {
  const groups = new Map();
  for (const s of services) {
    const key = s.category || "Otros";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => {
    if (a === "Otros") return 1;
    if (b === "Otros") return -1;
    return a.localeCompare(b);
  });
}

export default function ServicesPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // 🔥 Traemos los datos del Store global
  const { business, services, loading } = useBusinessStore();

  const { setService } = useBooking();
  const { customer } = useCustomerAuth();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [openCategory, setOpenCategory] = useState(null);

  const groupedServices = useMemo(
    () => groupServices(services || []),
    [services],
  );
  const allCategories = useMemo(
    () => groupedServices.map(([cat]) => cat),
    [groupedServices],
  );

  const filteredGrouped = useMemo(() => {
    const q = normalize(query.trim());

    return groupedServices
      .map(([category, items]) => {
        if (activeCategory !== "Todas" && category !== activeCategory)
          return [category, []];

        const matches = items.filter((s) => {
          if (!q) return true;
          return (
            normalize(s.name).includes(q) ||
            normalize(s.description).includes(q)
          );
        });
        return [category, matches];
      })
      .filter(([, items]) => items.length > 0);
  }, [groupedServices, query, activeCategory]);

  const isFiltering = query.trim().length > 0 || activeCategory !== "Todas";
  const totalResults = filteredGrouped.reduce(
    (acc, [, s]) => acc + s.length,
    0,
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-brand" />
      </div>
    );
  }

  const handleServicePick = (service) => {
    // El backend nos dice si pide seña en el objeto del negocio
    const requiresDeposit = business?.depositMode !== "none";
    const depositAmount = requiresDeposit ? business.depositValue : 0;

    setService(service.id, requiresDeposit, depositAmount);

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

      {services.length === 0 ? (
        <EmptyState
          title="Sin servicios disponibles"
          description="Este negocio todavía no cargó servicios."
        />
      ) : (
        <>
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
              className="w-full pl-9 pr-9 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {allCategories.length >= 2 && (
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

          {isFiltering && (
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <span>
                {totalResults} {totalResults === 1 ? "resultado" : "resultados"}{" "}
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
              {filteredGrouped.map(([category, items]) => (
                <ServiceCategoryGroup
                  key={category}
                  slug={slug}
                  category={category}
                  services={items}
                  open={isFiltering ? true : openCategory === category}
                  onToggle={() =>
                    setOpenCategory((prev) =>
                      prev === category ? null : category,
                    )
                  }
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
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition border ${active ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
    >
      {label}
    </button>
  );
}
