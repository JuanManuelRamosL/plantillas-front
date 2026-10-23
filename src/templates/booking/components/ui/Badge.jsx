export default function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700",
    brand: "bg-brand/10 text-brand",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
  };
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-1 rounded-full ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
