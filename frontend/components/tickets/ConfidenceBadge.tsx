export default function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 bg-slate-200 h-2 rounded">
        <div
          className={`h-2 rounded ${
            pct > 80
              ? "bg-green-500"
              : pct > 60
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs">{pct}%</span>
    </div>
  );
}
