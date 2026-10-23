import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  getBusinessBySlug,
  getService,
  getExpertsForService,
} from "../mocks/businesses";
import { useBooking } from "../context/BookingContext";
import Card from "../components/ui/Card";
import Stepper from "../components/ui/Stepper";
import EmptyState from "../components/ui/EmptyState";

export default function ExpertPage() {
  const { slug } = useParams();
  const business = getBusinessBySlug(slug);
  const { state, setExpert } = useBooking();

  if (!business) return null;

  if (!state.serviceId) {
    return <Navigate to={`/${slug}`} replace />;
  }

  const service = getService(business, state.serviceId);
  const experts = getExpertsForService(business, state.serviceId);

  return (
    <div>
      <Stepper current="experto" />

      <header className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Elegí un profesional
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Para{" "}
          <span className="font-medium text-slate-700">{service?.name}</span>
        </p>
      </header>

      {experts.length === 0 ? (
        <EmptyState
          title="Sin profesionales disponibles"
          description="No hay profesionales que ofrezcan este servicio."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {experts.map((e) => {
            const isSelected = state.expertId === e.id;
            return (
              <Link
                key={e.id}
                to={`/${slug}/fecha`}
                onClick={() => setExpert(e.id)}
                className="group"
              >
                <Card
                  className={`p-4 flex items-start gap-4 transition h-full
                    ${
                      isSelected
                        ? "border-brand ring-2 ring-brand/20"
                        : "hover:border-slate-200 hover:shadow-md"
                    }
                  `}
                >
                  <img
                    src={e.avatar}
                    alt={e.name}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">
                      {e.name}
                    </h3>
                    {e.bio && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {e.bio}
                      </p>
                    )}
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-400 group-hover:text-slate-700 transition shrink-0 mt-1"
                  />
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
