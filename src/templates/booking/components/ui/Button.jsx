export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  as: As = "button",
  type,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

  const variants = {
    primary: "bg-brand text-white hover:opacity-90 active:opacity-100",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline:
      "border border-slate-200 text-slate-800 bg-white hover:border-slate-300 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-5 py-3",
  };

  // Fuerza type="button" por defecto cuando se renderiza como <button>.
  // Si necesitás un submit, pasá type="submit" explícito (ej: en forms de login).
  const finalType = As === "button" ? (type ?? "button") : type;

  return (
    <As
      type={finalType}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}
