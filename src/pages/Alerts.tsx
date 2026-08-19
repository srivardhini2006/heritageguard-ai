import { useMemo, useState } from "react";
import type { AlertSeverity, AlertType } from "../types";
import { useAlerts } from "../hooks/useAlerts";
import { useSites } from "../hooks/useSites";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import AlertCard from "../components/alerts/AlertCard";

const TYPE_LABEL: Record<AlertType, string> = {
  RISK_INCREASE: "Risk Increase",
  ENVIRONMENTAL: "Environmental",
  IMAGE_DETERIORATION: "Image Deterioration",
  CONSERVATION_OVERDUE: "Conservation Overdue",
};

export default function Alerts() {
  const { data: alerts, isLoading, error, refetch } = useAlerts();
  const { data: sites } = useSites();

  const [severity, setSeverity] = useState<AlertSeverity | "ALL">("ALL");
  const [type, setType] = useState<AlertType | "ALL">("ALL");
  const [siteId, setSiteId] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");

  const filtered = useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((a) => {
      const matchesSeverity = severity === "ALL" || a.severity === severity;
      const matchesType = type === "ALL" || a.type === type;
      const matchesSite = siteId === "ALL" || a.siteId === siteId;
      const matchesDate = !dateFrom || new Date(a.createdAt) >= new Date(dateFrom);
      return matchesSeverity && matchesType && matchesSite && matchesDate;
    });
  }, [alerts, severity, type, siteId, dateFrom]);

  const selectClasses = "rounded-lg border border-brand-border bg-white px-3 py-2 text-xs font-semibold text-brand-text-dark shadow-sm focus:border-brand-forest focus:outline-none transition-colors cursor-pointer";

  if (isLoading) return <LoadingState label="Loading alerts…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="border-b border-brand-border pb-5">
        <h1 className="font-display text-3xl font-semibold text-brand-text-dark">Alerts</h1>
        <p className="mt-1 text-sm text-brand-text-muted">Risk, environmental, image, and conservation alerts across all sites.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-brand-text-muted">
          Severity
          <select value={severity} onChange={(e) => setSeverity(e.target.value as AlertSeverity | "ALL")} className={selectClasses}>
            <option value="ALL">All</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs font-semibold text-brand-text-muted">
          Type
          <select value={type} onChange={(e) => setType(e.target.value as AlertType | "ALL")} className={selectClasses}>
            <option value="ALL">All</option>
            {Object.entries(TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs font-semibold text-brand-text-muted">
          Site
          <select value={siteId} onChange={(e) => setSiteId(e.target.value)} className={selectClasses}>
            <option value="ALL">All sites</option>
            {(sites ?? []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs font-semibold text-brand-text-muted">
          From
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={selectClasses}
            aria-label="Filter alerts from date"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No matching alerts" message="Try adjusting your filters." />
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
