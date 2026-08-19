import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { RiskFactor } from "../../types";

const TREND_ICON = { up: TrendingUp, down: TrendingDown, stable: Minus };
const TREND_COLOR = { up: "text-rust-400", down: "text-verdigris-400", stable: "text-stone-400" };

export default function RiskFactorCard({ factor }: { factor: RiskFactor }) {
  const TrendIcon = factor.trend ? TREND_ICON[factor.trend] : Minus;
  const trendColor = factor.trend ? TREND_COLOR[factor.trend] : "text-stone-400";

  return (
    <div className="card-surface card-hover p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-stone-100">{factor.name}</span>
        <span className={`flex items-center gap-1 text-xs ${trendColor}`} aria-label={`Trend: ${factor.trend ?? "stable"}`}>
          <TrendIcon size={13} aria-hidden="true" />
          {factor.trend ?? "stable"}
        </span>
      </div>
      {factor.description && <p className="mt-1 text-xs text-stone-400">{factor.description}</p>}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-base-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-500 to-sandstone-500 transition-[width] duration-700 ease-out"
          style={{ width: `${factor.contribution}%` }}
          role="progressbar"
          aria-valuenow={factor.contribution}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${factor.name} contribution`}
        />
      </div>
      <span className="mt-1 block text-right font-mono text-xs text-stone-500">{factor.contribution}% weight</span>
    </div>
  );
}
