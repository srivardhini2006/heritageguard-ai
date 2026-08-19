import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Calendar, ChevronDown, FileText } from "lucide-react";
import { useConservationRanking } from "../hooks/useConservation";
import { useSites } from "../hooks/useSites";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import { formatDate } from "../utils/format";

export default function Conservation() {
  const { data: recommendations, isLoading: recLoading, error: recError, refetch } = useConservationRanking();
  const { data: sites, isLoading: sitesLoading } = useSites();

  const [selectedSiteId, setSelectedSiteId] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("2024-05-01");
  const [dateTo, setDateTo] = useState<string>("2026-05-18");

  const reports = useMemo(() => {
    if (!sites) return [];
    return sites
      .map((site) => {
        const rec = recommendations?.find((r) => r.siteId === site.id);
        return {
          id: site.id,
          reportName: `${site.name.replace("Complex, ", "").replace("Shore Temple, ", "")} Analysis Report`,
          siteName: site.name,
          location: site.location,
          date: site.lastAssessment,
          riskLevel: site.currentRiskLevel,
          priorityScore: rec?.priorityScore ?? site.riskScore,
        };
      })
      .filter((report) => {
        const matchesSite = selectedSiteId === "ALL" || report.id === selectedSiteId;
        const matchesDate =
          (!dateFrom || new Date(report.date) >= new Date(dateFrom)) &&
          (!dateTo || new Date(report.date) <= new Date(dateTo));
        return matchesSite && matchesDate;
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }, [sites, recommendations, selectedSiteId, dateFrom, dateTo]);

  if (recLoading || sitesLoading) return <LoadingState label="Loading reports…" />;
  if (recError) return <ErrorState message={recError} onRetry={refetch} />;
  if (!sites || sites.length === 0) return <EmptyState title="No report data" />;

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case "CRITICAL":
      case "HIGH":
        return "bg-red-50 text-[#C94B32] border-red-100";
      case "MEDIUM":
        return "bg-orange-50 text-[#E28D38] border-orange-100";
      default:
        return "bg-green-50 text-[#2E7D32] border-green-100";
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="border-b border-brand-border pb-5">
        <h1 className="font-display text-3xl font-semibold text-brand-text-dark">Reports</h1>
        <p className="mt-1 text-sm text-brand-text-muted">View and download analysis reports.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-brand-card p-4 rounded-lg border border-brand-border shadow-sm">
        {/* Site select dropdown */}
        <div className="relative">
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="appearance-none rounded-lg border border-brand-border bg-white pl-3 pr-8 py-2 text-xs font-semibold text-brand-text-dark shadow-sm cursor-pointer hover:bg-stone-50 focus:border-brand-forest focus:outline-none"
          >
            <option value="ALL">All Sites</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
        </div>

        {/* Date From */}
        <div className="flex items-center gap-2 rounded-lg border border-brand-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-text-dark shadow-sm">
          <Calendar size={13} className="text-brand-text-muted" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="focus:outline-none bg-transparent cursor-pointer"
            aria-label="Start date"
          />
        </div>

        {/* Date To */}
        <div className="flex items-center gap-2 rounded-lg border border-brand-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-text-dark shadow-sm">
          <Calendar size={13} className="text-brand-text-muted" />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="focus:outline-none bg-transparent cursor-pointer"
            aria-label="End date"
          />
        </div>

        {/* Action Button */}
        <button className="ml-auto inline-flex items-center gap-2 rounded-lg bg-brand-forest px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110">
          <FileText size={13} />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Reports Table Card */}
      <div className="rounded-lg border border-brand-border bg-brand-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-brand-border bg-stone-50/50 text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">
                <th className="px-6 py-3.5">Report Name</th>
                <th className="px-6 py-3.5">Site</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-center">Risk Level</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {reports.map((report) => (
                <tr key={report.id} className="transition-colors hover:bg-stone-50/30">
                  <td className="px-6 py-4 font-semibold text-brand-text-dark">{report.reportName}</td>
                  <td className="px-6 py-4 text-brand-text-muted">
                    <Link to={`/sites/${report.id}`} className="hover:underline">
                      {report.siteName}, {report.location}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-brand-text-muted font-medium">{formatDate(report.date)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold border ${getRiskBadgeClass(report.riskLevel)}`}>
                      {report.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-brand-border bg-white text-brand-text-muted shadow-sm hover:text-brand-text-dark hover:bg-stone-50"
                      aria-label={`Download report for ${report.siteName}`}
                    >
                      <Download size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-brand-text-muted font-medium">
                    No reports match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Banner Card (Taj Mahal quote card) */}
      <div className="relative rounded-lg border border-brand-border bg-[#18120D] p-10 flex flex-col items-center justify-center text-center overflow-hidden min-h-[160px] shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80"
          alt="Taj Mahal silhouette at sunset"
          className="absolute inset-0 h-full w-full object-cover opacity-35 pointer-events-none brightness-75"
        />
        {/* Soft vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#18120D]/60 to-[#18120D] opacity-90" />
        
        <div className="relative z-10 space-y-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold mx-auto mb-2">
            ✨
          </span>
          <h2 className="font-display text-lg font-bold text-white tracking-wide">Preserve Today, Protect Tomorrow.</h2>
          <p className="text-xs text-[#DECBAE]/80 font-medium">Heritage is our legacy.</p>
        </div>
      </div>
    </div>
  );
}
