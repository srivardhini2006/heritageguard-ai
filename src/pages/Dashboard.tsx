import { Landmark, Bell, Calendar, ChevronDown, ShieldAlert, Gauge, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useSites } from "../hooks/useSites";
import { useAlerts } from "../hooks/useAlerts";
import { useAnalytics } from "../hooks/useAnalytics";
import { computeDashboardSummary } from "../utils/dashboard";
import StatCard from "../components/common/StatCard";
import ChartCard from "../components/common/ChartCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import RiskDistributionChart from "../components/dashboard/RiskDistributionChart";
import AlertCard from "../components/alerts/AlertCard";

export default function Dashboard() {
  const { data: sites, isLoading: sitesLoading, error: sitesError, refetch: refetchSites } = useSites();
  const { data: alerts, isLoading: alertsLoading, error: alertsError } = useAlerts();
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useAnalytics();

  if (sitesLoading) return <LoadingState label="Loading dashboard…" />;
  if (sitesError) return <ErrorState message={sitesError} onRetry={refetchSites} />;
  if (!sites || sites.length === 0) return <EmptyState title="No heritage sites yet" message="Once site data is available, your risk overview will appear here." />;

  const summary = computeDashboardSummary(sites);

  // In our mockup, the health score is 72.
  // We can calculate the health score as 100 - averageRiskScore.
  const healthScore = Math.max(0, 100 - Math.round(summary.averageRiskScore));
  let healthLabel = "Stable";
  let healthProgressColor = "bg-[#2E7D32]"; // green
  if (healthScore < 50) {
    healthLabel = "Critical";
    healthProgressColor = "bg-[#C94B32]"; // red
  } else if (healthScore < 80) {
    healthLabel = "Moderate";
    healthProgressColor = "bg-[#E28D38]"; // yellow/orange
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Premium Dynamic Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-brand-border pb-5">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-text-dark">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Monitor and protect our heritage sites with intelligent insights.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Selector Dropdown */}
          <div className="flex items-center gap-2 rounded-lg border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-text-dark shadow-sm cursor-pointer hover:bg-stone-50">
            <Calendar size={14} className="text-brand-text-muted" />
            <span>May 18, 2024</span>
            <ChevronDown size={12} className="text-brand-text-muted" />
          </div>
          {/* Circular Bell Icon */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-white text-brand-text-muted shadow-sm hover:text-brand-text-dark cursor-pointer">
            <Bell size={16} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white" />
          </div>
        </div>
      </div>

      {/* Row of 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Sites" value={summary.totalSites} icon={Landmark} accent="stone" hint="Active Heritage Sites" />
        <StatCard label="High Risk Sites" value={summary.highRiskSites} icon={ShieldAlert} accent="rust" hint="Require Immediate Attention" />
        <StatCard label="Medium Risk Sites" value={summary.mediumRiskSites} icon={Gauge} accent="ochre" hint="Under Monitoring" />
        <StatCard label="Low Risk Sites" value={summary.lowRiskSites} icon={TrendingUp} accent="verdigris" hint="Stable Condition" />
      </div>

      {/* 3-Column Panels: Donut Chart, Recent Alerts, Site Health Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Risk Distribution */}
        <ChartCard title="Risk Distribution" subtitle="Sites grouped by current risk level">
          {analyticsLoading ? (
            <LoadingState compact />
          ) : analyticsError || !analytics ? (
            <ErrorState message={analyticsError ?? undefined} />
          ) : (
            <RiskDistributionChart distribution={analytics.riskDistribution} />
          )}
        </ChartCard>

        {/* Recent Alerts */}
        <ChartCard
          title="Recent Alerts"
          subtitle="Latest signals across all sites"
          action={
            <Link to="/alerts" className="text-xs font-semibold text-brand-gold hover:underline">
              View All Alerts
            </Link>
          }
        >
          {alertsLoading ? (
            <LoadingState compact />
          ) : alertsError || !alerts ? (
            <ErrorState message={alertsError ?? undefined} />
          ) : alerts.length === 0 ? (
            <EmptyState title="No alerts" message="You're all caught up." />
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </ChartCard>

        {/* Site Health Summary */}
        <div className="rounded-lg border border-brand-border bg-brand-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full min-h-[280px]">
          {/* Top segment with background image */}
          <div className="relative flex-1 p-5 flex flex-col justify-end min-h-[180px] bg-[#18120D]">
            <img
              src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80"
              alt="Taj Mahal Monument"
              className="absolute inset-0 h-full w-full object-cover opacity-60 pointer-events-none"
            />
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#18120D] via-transparent to-transparent opacity-90" />
            
            <div className="relative z-10 space-y-1">
              <span className="text-[10px] font-semibold tracking-wider text-[#DECBAE] uppercase">Site Health Summary</span>
              <h4 className="font-display text-xs text-gray-300">Overall Health Score</h4>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-white">{healthScore}</span>
                <span className="text-xs font-mono text-gray-300">/100</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E28D38]/20 border border-[#E28D38]/30 px-2.5 py-0.5 text-[10px] font-semibold text-[#E28D38]">
                {healthLabel}
              </div>
            </div>
          </div>
          {/* Bottom segment with progress bar */}
          <div className="p-5 border-t border-brand-border bg-white">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${healthProgressColor}`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-brand-text-muted mt-2 font-medium">
              <span>0 (Critical)</span>
              <span>100 (Optimal)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
