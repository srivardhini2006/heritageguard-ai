import { CheckCircle2 } from "lucide-react";
import type { ConservationRecommendation } from "../../types";

const PRIORITY_STYLE: Record<ConservationRecommendation["priorityLevel"], string> = {
  IMMEDIATE: "text-rust-400 bg-rust-500/10 border-rust-500/30",
  HIGH: "text-ochre-400 bg-ochre-500/10 border-ochre-500/30",
  MONITOR: "text-verdigris-400 bg-verdigris-500/10 border-verdigris-500/30",
};

export default function RecommendationCard({ recommendation }: { recommendation: ConservationRecommendation }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full border px-3 py-1 font-mono text-xs font-medium uppercase tracking-wide ${PRIORITY_STYLE[recommendation.priorityLevel]}`}
        >
          {recommendation.priorityLevel} PRIORITY
        </span>
        <span className="text-sm text-stone-400">
          Priority score <span className="font-mono text-stone-200">{recommendation.priorityScore}</span>/100
        </span>
        <span className="text-sm text-stone-400">
          Urgency: <span className="text-stone-200">{recommendation.estimatedUrgency}</span>
        </span>
        <span className="text-sm text-stone-400">
          Expected impact: <span className="text-stone-200">{recommendation.interventionImpact}%</span>
        </span>
      </div>

      <ul className="space-y-2">
        {recommendation.recommendations.map((r, i) => (
          <li key={i} className="flex animate-fade-up items-start gap-2 text-sm text-stone-200" style={{ animationDelay: `${i * 60}ms` }}>
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-verdigris-400" aria-hidden="true" />
            {r}
          </li>
        ))}
      </ul>

      {recommendation.rationale && recommendation.rationale.length > 0 && (
        <div className="rounded-md border border-base-700 bg-base-700/40 p-3">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-stone-400">
            Why this site is prioritized
          </p>
          <ul className="space-y-1 text-sm text-stone-300">
            {recommendation.rationale.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
