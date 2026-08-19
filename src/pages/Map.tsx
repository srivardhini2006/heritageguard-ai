import { useMemo, useState } from "react";
import type { RiskLevel } from "../types";
import { useSites } from "../hooks/useSites";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import HeritageMap from "../components/map/HeritageMap";
import MapLegend from "../components/map/MapLegend";
import { Search } from "lucide-react";

export default function MapPage() {
  const { data: sites, isLoading, error, refetch } = useSites();
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel | "ALL">("ALL");

  const filtered = useMemo(() => {
    if (!sites) return [];
    return sites.filter((s) => {
      const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
      const matchesRisk = riskLevel === "ALL" || s.currentRiskLevel === riskLevel;
      return matchesSearch && matchesRisk;
    });
  }, [sites, search, riskLevel]);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="border-b border-brand-border pb-5">
        <h1 className="font-display text-3xl font-semibold text-brand-text-dark">Analysis</h1>
        <p className="mt-1 text-sm text-brand-text-muted">Geographic view of deterioration risk across all sites.</p>
      </div>

      {isLoading ? (
        <LoadingState label="Loading map data…" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !sites || sites.length === 0 ? (
        <EmptyState title="No sites to display" message="Site locations will appear on the map once data is available." />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative max-w-xs flex-1" htmlFor="map-search">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" size={15} />
              <input
                id="map-search"
                type="search"
                placeholder="Search sites on map…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-brand-border bg-white py-2 pl-9 pr-3 text-xs font-semibold text-brand-text-dark placeholder:text-brand-text-muted focus:border-brand-forest focus:outline-none shadow-sm transition-colors"
              />
            </label>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by risk level">
              {(["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRiskLevel(lvl)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all shadow-sm ${
                    riskLevel === lvl
                      ? "border-brand-forest bg-brand-forest text-white"
                      : "border-brand-border bg-white text-brand-text-muted hover:text-brand-text-dark hover:bg-stone-50"
                  }`}
                >
                  {lvl === "ALL" ? "All" : lvl}
                </button>
              ))}
            </div>
          </div>

          <MapLegend />

          {filtered.length === 0 ? (
            <EmptyState title="No matching sites" message="Try a different search term or risk filter." />
          ) : (
            <HeritageMap sites={filtered} />
          )}
        </>
      )}
    </div>
  );
}
