import type { CSSProperties } from "react";

const LEVELS: { level: string; color: string }[] = [
  { level: "Low", color: "#4E8479" },
  { level: "Medium", color: "#C99A3A" },
  { level: "High", color: "#CC6A4C" },
  { level: "Critical", color: "#B5482F" },
];

export default function MapLegend() {
  return (
    <div className="glass-panel flex flex-wrap items-center gap-4 rounded-md border border-base-700 px-4 py-2.5 text-sm shadow-panel">
      <span className="text-xs font-medium uppercase tracking-wide text-stone-400">Legend</span>
      {LEVELS.map((l) => (
        <span key={l.level} className="flex items-center gap-1.5 text-stone-300">
          <span
            className="h-2.5 w-2.5 rounded-full shadow-[0_0_6px_1px_var(--dot-glow)]"
            style={{ backgroundColor: l.color, "--dot-glow": `${l.color}80` } as CSSProperties}
            aria-hidden="true"
          />
          {l.level}
        </span>
      ))}
    </div>
  );
}
