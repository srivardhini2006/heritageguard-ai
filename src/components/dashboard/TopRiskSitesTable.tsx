import { useNavigate } from "react-router-dom";
import type { HeritageSite } from "../../types";
import RiskBadge from "../common/RiskBadge";
import { formatDate } from "../../utils/format";
import { ArrowRight } from "lucide-react";

export default function TopRiskSitesTable({ sites }: { sites: HeritageSite[] }) {
  const navigate = useNavigate();
  const topSites = [...sites].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-base-700 text-xs uppercase tracking-wide text-stone-400">
            <th className="py-2 pr-3 font-medium">Site</th>
            <th className="py-2 pr-3 font-medium">Location</th>
            <th className="py-2 pr-3 font-medium">Risk Score</th>
            <th className="py-2 pr-3 font-medium">Level</th>
            <th className="py-2 pr-3 font-medium">Last Assessed</th>
            <th className="py-2 pr-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {topSites.map((site) => (
            <tr
              key={site.id}
              className="cursor-pointer border-b border-base-700/60 transition-colors hover:bg-base-700/40"
              onClick={() => navigate(`/sites/${site.id}`)}
            >
              <td className="py-2.5 pr-3 font-medium text-stone-100">{site.name}</td>
              <td className="py-2.5 pr-3 text-stone-400">{site.location}</td>
              <td className="py-2.5 pr-3 font-mono text-stone-200">{site.riskScore}</td>
              <td className="py-2.5 pr-3">
                <RiskBadge level={site.currentRiskLevel} size="sm" />
              </td>
              <td className="py-2.5 pr-3 text-stone-400">{formatDate(site.lastAssessment)}</td>
              <td className="py-2.5 pr-3 text-right">
                <button
                  className="inline-flex items-center gap-1 text-xs font-medium text-gold-400 transition-colors hover:text-gold-300"
                  aria-label={`View details for ${site.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/sites/${site.id}`);
                  }}
                >
                  View <ArrowRight size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
