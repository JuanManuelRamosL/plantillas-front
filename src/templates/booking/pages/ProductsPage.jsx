import { useParams } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { getBusinessBySlug } from "../mocks/businesses";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";

export default function ProductsPage() {
  const { slug } = useParams();
  const business = getBusinessBySlug(slug);

  if (!business) return null;

  return (
    <div>
      <header className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Productos
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Productos que vende {business.name}.
        </p>
      </header>

      {business.products.length === 0 ? (
        <EmptyState
          title="Sin productos"
          description="Este negocio todavía no cargó productos."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {business.products.map((p) => (
            <Card key={p.id} className="overflow-hidden group">
              <div className="aspect-square bg-slate-50 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-slate-900 truncate">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-slate-900">
                    ${p.price.toLocaleString("es-AR")}
                  </span>
                  <Badge tone="brand">
                    <ShoppingBag size={10} className="mr-1" /> Ver
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
