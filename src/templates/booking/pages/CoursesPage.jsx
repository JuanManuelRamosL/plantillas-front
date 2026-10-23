import { useParams } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { getBusinessBySlug } from "../mocks/businesses";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

export default function CoursesPage() {
  const { slug } = useParams();
  const business = getBusinessBySlug(slug);

  if (!business) return null;

  return (
    <div>
      <header className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <GraduationCap size={22} /> Cursos
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Formaciones que ofrece {business.name}.
        </p>
      </header>

      {!business.courses || business.courses.length === 0 ? (
        <EmptyState
          title="Sin cursos disponibles"
          description="Este negocio todavía no cargó cursos."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {business.courses.map((c) => (
            <Card key={c.id} className="p-4 flex flex-col">
              <h4 className="font-medium text-slate-900">{c.name}</h4>
              <p className="text-xs text-slate-500 mt-1 flex-1">
                {c.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-semibold text-slate-900">
                  ${c.price.toLocaleString("es-AR")}
                </span>
                <Button
                  as="a"
                  href={c.contactUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  size="sm"
                >
                  Más info
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
