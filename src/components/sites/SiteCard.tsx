import { Link } from "react-router-dom";
import type { HeritageSite } from "../../types";
import RiskBadge from "../common/RiskBadge";
import ImageWithFallback from "../common/ImageWithFallback";
import { formatDate } from "../../utils/format";
import { ArrowUpRight, MapPin } from "lucide-react";

export default function SiteCard({ site }: { site: HeritageSite }) {
  return (
    <div className="rounded-lg border border-brand-border bg-brand-card flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative h-40 w-full overflow-hidden">
        <ImageWithFallback
          src={site.imageUrl}
          alt={site.name}
          heritageType={site.heritageType}
          className="h-full w-full"
          imgClassName="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute right-2.5 top-2.5">
          <RiskBadge level={site.currentRiskLevel} size="sm" />
        </div>
        <div className="absolute bottom-2.5 left-3 right-3">
          <p className="flex items-center gap-1 truncate font-mono text-[10px] uppercase tracking-wide text-white/90">
            <MapPin size={11} aria-hidden="true" /> {site.heritageType}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-brand-text-dark text-sm leading-snug truncate">{site.name}</h3>
        <p className="mt-0.5 text-xs text-brand-text-muted">{site.location}</p>
        {site.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-brand-text-muted">{site.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-brand-border/60">
          <span className="font-mono font-bold text-brand-text-dark">
            {site.riskScore}
            <span className="text-gray-400 font-normal">/100</span>
          </span>
          <span className="text-[10px] text-brand-text-muted">Assessed {formatDate(site.lastAssessment)}</span>
        </div>
        <Link
          to={`/sites/${site.id}`}
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-border bg-white py-2 text-xs font-semibold text-brand-text-dark shadow-sm hover:bg-stone-50 transition-colors"
        >
          View details <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
