import { useParams } from "react-router-dom";
import { Smartphone, Download } from "lucide-react";
import { getBusinessBySlug } from "../mocks/businesses";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

export default function AppPage() {
  const { slug } = useParams();
  const business = getBusinessBySlug(slug);

  if (!business) return null;

  const hasStores = business.app?.playStoreUrl || business.app?.appStoreUrl;
  const hasApk = business.app?.apkUrl;

  return (
    <div>
      <header className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <Smartphone size={22} /> Nuestra app
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Descargá la app de {business.name} para reservar más rápido.
        </p>
      </header>

      {!business.app ? (
        <EmptyState
          title="Sin app disponible"
          description="Este negocio todavía no tiene app publicada."
        />
      ) : (
        <Card className="p-5">
          <p className="text-sm text-slate-700 mb-4">
            Llevá tus turnos en el bolsillo. Descargá la app oficial y gestioná
            tus reservas desde cualquier lugar.
          </p>

          {hasStores && (
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              {business.app.playStoreUrl && (
                <Button
                  as="a"
                  href={business.app.playStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  size="md"
                >
                  Google Play
                </Button>
              )}
              {business.app.appStoreUrl && (
                <Button
                  as="a"
                  href={business.app.appStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  size="md"
                >
                  App Store
                </Button>
              )}
            </div>
          )}

          {hasApk && (
            <div className="border-t border-slate-100 pt-3">
              <Button
                as="a"
                href={business.app.apkUrl}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
              >
                <Download size={16} /> Descargar APK (Android)
              </Button>
              <p className="text-[11px] text-slate-400 mt-2">
                Instalación directa para Android, fuera de Google Play. Puede
                requerir habilitar la instalación desde orígenes desconocidos en
                tu dispositivo.
              </p>
            </div>
          )}

          {!hasStores && !hasApk && (
            <p className="text-xs text-slate-500">
              Este negocio todavía no publicó links de descarga.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
