import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, QrCode } from "lucide-react";
import Button from "./ui/Button";

export default function QrScannerModal({ open, onClose, onScan }) {
  const containerIdRef = useRef(
    "qr-scanner-" + Math.random().toString(36).slice(2),
  );
  const scannerRef = useRef(null);
  const runningRef = useRef(false);
  const [error, setError] = useState(null);

  // Detiene el escáner de forma segura, ignorando el throw sincrónico
  // que lanza html5-qrcode cuando el escáner no está corriendo.
  const safeStop = async (scanner) => {
    if (!scanner) return;
    try {
      if (runningRef.current) {
        runningRef.current = false;
        await scanner.stop();
      }
      scanner.clear();
    } catch (e) {
      // html5-qrcode lanza un string sincrónico si no está corriendo.
      // Lo ignoramos: el escáner ya está detenido o nunca arrancó.
      console.warn("[QR Scanner] stop ignorado:", e);
    }
  };

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const scanner = new Html5Qrcode(containerIdRef.current);
    scannerRef.current = scanner;

    const start = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            if (cancelled) return;
            cancelled = true;
            console.log("[QR ESCANEADO]", decodedText);
            onScan?.(decodedText);
            // Detenemos ANTES de cerrar el modal
            await safeStop(scanner);
            onClose();
          },
          () => {
            // Errores de frame: normales mientras busca QR. Ignorar.
          },
        );
        if (!cancelled) runningRef.current = true;
      } catch (err) {
        if (cancelled) return;
        console.error("[QR Scanner error]", err);
        setError(
          err?.message?.includes("Permission") ||
            String(err).includes("Permission")
            ? "No pudimos acceder a la cámara. Verificá los permisos."
            : "No pudimos iniciar el escáner. Probá de nuevo.",
        );
      }
    };

    start();

    return () => {
      cancelled = true;
      safeStop(scannerRef.current);
      scannerRef.current = null;
    };
  }, [open, onScan, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <QrCode size={16} /> Escanear QR
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          {error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <Button onClick={onClose} variant="outline" size="sm">
                Cerrar
              </Button>
            </div>
          ) : (
            <>
              {/*
                IMPORTANTE: este div es propiedad exclusiva de html5-qrcode.
                React NO debe renderizar nada adentro. Por eso está vacío
                y separado de cualquier otro nodo React.
              */}
              <div
                id={containerIdRef.current}
                className="rounded-xl overflow-hidden bg-black aspect-square w-full"
              />
              <p className="text-xs text-slate-500 text-center mt-3">
                Apuntá la cámara al código QR
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
