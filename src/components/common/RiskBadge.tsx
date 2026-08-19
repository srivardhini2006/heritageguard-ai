import type { RiskLevel } from "../../types";
import { riskLevelColor } from "../../utils/format";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
}

export default function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const c = riskLevelColor(level);
  const sizeClasses = size === "sm" ? "text-[11px] px-2 py-0.5 gap-1" : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono font-medium uppercase tracking-wide backdrop-blur-sm transition-transform duration-200 hover:scale-105 ${c.text} ${c.bg} ${c.border} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${level === "CRITICAL" || level === "HIGH" ? "animate-pulse-glow" : ""}`} aria-hidden="true" />
      {level}
    </span>
  );
}
