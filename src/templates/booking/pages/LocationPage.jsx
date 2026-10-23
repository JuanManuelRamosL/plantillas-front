import { useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import { getBusinessBySlug } from "../mocks/businesses";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

export default function LocationPage() {
  const { slug } = useParams();
  const business = getBusinessBySlug(slug);

  if (!business) return null;

  return (
    <div>
      <header className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <MapPin size={22} /> Dónde estamos
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Encontranos en nuestra dirección.
        </p>
      </header>

      {!business.location ? (
        <EmptyState
          title="Sin dirección cargada"
          description="Este negocio todavía no cargó su ubicación."
        />
      ) : (
        <Card className="p-4">
          <p className="text-sm font-medium text-slate-800 mb-3">
            {business.location.address}
          </p>
          <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-100">
            <iframe
              title="Mapa"
              src={business.location.mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
