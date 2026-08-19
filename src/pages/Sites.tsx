import { useMemo, useState } from "react";
import type { HeritageType, RiskLevel } from "../types";
import { useSites } from "../hooks/useSites";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import SiteCard from "../components/sites/SiteCard";
import Reveal from "../components/common/Reveal";
import SiteFilters, { type SortOption } from "../components/sites/SiteFilters";

export default function Sites() {
  const { data: sites, isLoading, error, refetch } = useSites();
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel | "ALL">("ALL");
  const [heritageType, setHeritageType] = useState<HeritageType | "ALL">("ALL");
  const [sort, setSort] = useState<SortOption>("risk-desc");

  const heritageTypes = useMemo(
    () => Array.from(new Set((sites ?? []).map((s) => s.heritageType))).sort(),
    [sites]
  );

  const filtered = useMemo(() => {
    if (!sites) return [];
    let result = sites.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase());
      const matchesRisk = riskLevel === "ALL" || s.currentRiskLevel === riskLevel;
      const matchesType = heritageType === "ALL" || s.heritageType === heritageType;
      return matchesSearch && matchesRisk && matchesType;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "risk-desc":
          return b.riskScore - a.riskScore;
        case "risk-asc":
          return a.riskScore - b.riskScore;
        case "recent":
          return new Date(b.lastAssessment).getTime() - new Date(a.lastAssessment).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [sites, search, riskLevel, heritageType, sort]);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Dynamic Header */}
      <div className="border-b border-brand-border pb-5">
        <h1 className="font-display text-3xl font-semibold text-brand-text-dark">Sites</h1>
        <p className="mt-1 text-sm text-brand-text-muted">Browse and filter every monitored heritage site.</p>
      </div>

      {isLoading ? (
        <LoadingState label="Loading heritage sites…" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !sites || sites.length === 0 ? (
        <EmptyState title="No sites available" message="Site data will appear here once the backend is connected." />
      ) : (
        <>
          <SiteFilters
            search={search}
            onSearchChange={setSearch}
            riskLevel={riskLevel}
            onRiskLevelChange={setRiskLevel}
            heritageType={heritageType}
            onHeritageTypeChange={setHeritageType}
            sort={sort}
            onSortChange={setSort}
            heritageTypes={heritageTypes}
          />

          {filtered.length === 0 ? (
            <EmptyState title="No matching sites" message="Try adjusting your search or filters." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((site, i) => (
                <Reveal key={site.id} delayMs={(i % 8) * 60} className="h-full">
                  <SiteCard site={site} />
                </Reveal>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
