export default function Card({
  children,
  className = "",
  as: As = "div",
  ...props
}) {
  return (
    <As
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </As>
  );
}
