import type { LucideIcon } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "sandstone" | "verdigris" | "ochre" | "rust" | "stone" | "gold" | "forest";
  hint?: string;
}

const ACCENT_TEXT_CLASSES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  sandstone: "text-sandstone-600",
  verdigris: "text-[#2E7D32]", // deep green for low risk
  ochre: "text-[#E28D38]", // warm orange for medium risk
  rust: "text-[#C94B32]", // deep red for high risk
  stone: "text-brand-text-dark",
  gold: "text-brand-gold",
  forest: "text-brand-forest",
};

const ACCENT_HINT_CLASSES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  sandstone: "text-sandstone-500",
  verdigris: "text-[#2E7D32]/90",
  ochre: "text-[#E28D38]/90",
  rust: "text-[#C94B32]/90",
  stone: "text-brand-text-muted",
  gold: "text-brand-gold/90",
  forest: "text-brand-forest/90",
};

const ACCENT_BG_CLASSES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  sandstone: "bg-sandstone-50 text-sandstone-600 border-sandstone-200",
  verdigris: "bg-green-50 text-green-700 border-green-200",
  ochre: "bg-orange-50 text-orange-700 border-orange-200",
  rust: "bg-red-50 text-red-700 border-red-200",
  stone: "bg-stone-50 text-stone-600 border-stone-200",
  gold: "bg-amber-50 text-amber-700 border-amber-200",
  forest: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function StatCard({ label, value, icon: Icon, accent = "stone", hint }: StatCardProps) {
  const textClass = ACCENT_TEXT_CLASSES[accent];
  const hintClass = ACCENT_HINT_CLASSES[accent];
  const iconClass = ACCENT_BG_CLASSES[accent];

  return (
    <div className="rounded-lg border border-brand-border bg-brand-card p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-text-muted">{label}</span>
        <span className={`rounded-md border p-1.5 transition-transform duration-300 ${iconClass}`}>
          <Icon size={16} aria-hidden="true" />
        </span>
      </div>
      <div className={`mt-3 font-mono text-3xl font-bold ${textClass}`}>
        {typeof value === "number" ? <AnimatedCounter value={value} durationMs={900} /> : value}
      </div>
      {hint && <p className={`mt-1.5 text-xs font-medium ${hintClass}`}>{hint}</p>}
    </div>
  );
}
