import { Check } from "lucide-react";

const STEPS = [
  { key: "servicio", label: "Servicio" },
  { key: "experto", label: "Profesional" },
  { key: "fecha", label: "Fecha" },
  { key: "pago", label: "Pago" },
];

export default function Stepper({ current = "servicio" }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <ol className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={step.key} className="flex items-center gap-2 shrink-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
                ${done || active ? "bg-brand text-white" : "bg-slate-100 text-slate-500"}`}
            >
              {done ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={`text-xs font-medium ${active ? "text-slate-900" : "text-slate-500"}`}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && <div className="w-6 h-px bg-slate-200" />}
          </li>
        );
      })}
    </ol>
  );
}
