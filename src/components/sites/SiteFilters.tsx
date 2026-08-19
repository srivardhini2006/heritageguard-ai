import { Search } from "lucide-react";
import type { HeritageType, RiskLevel } from "../../types";

export type SortOption = "risk-desc" | "risk-asc" | "recent" | "name";

interface SiteFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  riskLevel: RiskLevel | "ALL";
  onRiskLevelChange: (v: RiskLevel | "ALL") => void;
  heritageType: HeritageType | "ALL";
  onHeritageTypeChange: (v: HeritageType | "ALL") => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  heritageTypes: HeritageType[];
}

export default function SiteFilters({
  search,
  onSearchChange,
  riskLevel,
  onRiskLevelChange,
  heritageType,
  onHeritageTypeChange,
  sort,
  onSortChange,
  heritageTypes,
}: SiteFiltersProps) {
  const inputClasses =
    "rounded-lg border border-brand-border bg-white px-3 py-2 text-xs font-semibold text-brand-text-dark shadow-sm focus:border-brand-forest focus:outline-none transition-colors";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <label className="relative flex-1 sm:max-w-xs" htmlFor="site-search">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
        <input
          id="site-search"
          type="search"
          placeholder="Search by name or location…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${inputClasses} w-full pl-9`}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-stone-400">
        Risk
        <select
          value={riskLevel}
          onChange={(e) => onRiskLevelChange(e.target.value as RiskLevel | "ALL")}
          className={inputClasses}
          aria-label="Filter by risk level"
        >
          <option value="ALL">All levels</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-stone-400">
        Type
        <select
          value={heritageType}
          onChange={(e) => onHeritageTypeChange(e.target.value as HeritageType | "ALL")}
          className={inputClasses}
          aria-label="Filter by heritage type"
        >
          <option value="ALL">All types</option>
          {heritageTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-stone-400">
        Sort
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={inputClasses}
          aria-label="Sort sites"
        >
          <option value="risk-desc">Highest risk</option>
          <option value="risk-asc">Lowest risk</option>
          <option value="recent">Recently assessed</option>
          <option value="name">Name</option>
        </select>
      </label>
    </div>
  );
}
