export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-14 px-6">
      <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <span className="text-slate-400 text-xl">✦</span>
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
