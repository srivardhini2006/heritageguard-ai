interface SeverityMeterProps {
  label: string;
  value: number; // 0–1
}

function severityColorFor(value: number) {
  if (value >= 0.7) return "bg-rust-500";
  if (value >= 0.4) return "bg-ochre-500";
  return "bg-verdigris-500";
}

export default function SeverityMeter({ label, value }: SeverityMeterProps) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-stone-300">{label}</span>
        <span className="font-mono text-stone-400">{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-base-700">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${severityColorFor(value)}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}
