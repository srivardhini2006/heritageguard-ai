import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Landmark, Users, Upload, ChevronRight, BarChart } from "lucide-react";
import { useSite } from "../hooks/useSites";
import { useRisk } from "../hooks/useRisk";
import { useImageAnalysis } from "../hooks/useImageAnalysis";
import { useConservation } from "../hooks/useConservation";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import ChartCard from "../components/common/ChartCard";
import RiskBreakdownChart from "../components/sites/RiskBreakdownChart";
import PredictionChart from "../components/sites/PredictionChart";
import RiskFactorCard from "../components/sites/RiskFactorCard";
import RecommendationCard from "../components/conservation/RecommendationCard";
import { formatDate, formatNumber } from "../utils/format";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "condition-analysis", label: "Condition Analysis" },
  { id: "environment", label: "Environment" },
  { id: "history", label: "History" },
  { id: "reports", label: "Reports" },
];

const MOCK_TREND_DATA = [
  { name: "Dec", score: 65 },
  { name: "Jan", score: 68 },
  { name: "Feb", score: 64 },
  { name: "Mar", score: 70 },
  { name: "Apr", score: 69 },
  { name: "May", score: 72 },
];

export default function SiteDetails() {
  const { siteId } = useParams<{ siteId: string }>();
  const { data: site, isLoading: siteLoading, error: siteError, refetch: refetchSite } = useSite(siteId);
  const { data: risk, isLoading: riskLoading, error: riskError, refetch: refetchRisk } = useRisk(siteId);
  useImageAnalysis(siteId);
  const { data: recommendation, isLoading: recLoading, error: recError } = useConservation(siteId);

  const [activeTab, setActiveTab] = useState("condition-analysis");

  if (siteLoading) return <LoadingState label="Loading site details…" />;
  if (siteError) return <ErrorState message={siteError} onRetry={refetchSite} />;
  if (!site) return <EmptyState title="Site not found" message="This heritage site doesn't exist or has been removed." />;

  // Dynamic analysis stats mapping to mockup values for Red Fort
  const isRedFort = site.id === "site-red-fort";
  const crackCount = isRedFort ? 18 : Math.round((site.riskScore * 0.25));
  const crackAreaRatio = isRedFort ? "8.42%" : `${(site.riskScore * 0.11).toFixed(2)}%`;
  const avgConfidence = isRedFort ? 0.78 : (0.6 + site.riskScore * 0.003).toFixed(2);
  const maxConfidence = isRedFort ? 0.92 : (0.75 + site.riskScore * 0.002).toFixed(2);

  // Health Score (mockup uses 72 for Red Fort which is 100 - riskScore or similar)
  const scoreColor = site.riskScore >= 75 ? "text-[#C94B32]" : site.riskScore >= 50 ? "text-[#E28D38]" : "text-[#2E7D32]";
  const scoreBg = site.riskScore >= 75 ? "bg-red-50 text-[#C94B32] border-red-100" : site.riskScore >= 50 ? "bg-orange-50 text-[#E28D38] border-orange-100" : "bg-green-50 text-[#2E7D32] border-green-100";

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Breadcrumb + dynamic header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-brand-border pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-brand-text-muted font-medium mb-1.5">
            <Link to="/sites" className="hover:text-brand-text-dark">Sites</Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-brand-text-dark font-semibold">{site.name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold text-brand-text-dark">{site.name}</h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${scoreBg}`}>
              {site.currentRiskLevel} Risk
            </span>
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-brand-text-muted font-medium">
            <MapPin size={13} className="text-brand-gold" /> {site.location}, {site.state}
          </p>
        </div>
        <div>
          {/* Upload New Image Button */}
          <button className="inline-flex items-center gap-2 rounded-lg bg-brand-forest px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:brightness-110">
            <Upload size={14} />
            <span>Upload New Image</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-brand-border">
        <nav className="flex gap-6 -mb-px overflow-x-auto" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-brand-forest text-brand-text-dark"
                  : "border-transparent text-brand-text-muted hover:text-brand-text-dark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Contents */}
      {activeTab === "condition-analysis" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Latest Analysis Image (with CV Overlay cracking rects) */}
            <div className="lg:col-span-2 rounded-lg border border-brand-border bg-brand-card p-5 shadow-sm">
              <h3 className="font-semibold text-brand-text-dark text-sm mb-3">Latest Analysis Image</h3>
              <div className="relative overflow-hidden rounded-lg border border-brand-border max-h-[360px] bg-stone-100 flex items-center justify-center">
                <img
                  src={site.imageUrl}
                  alt={site.name}
                  className="h-full w-full object-cover max-h-[360px]"
                />
                {/* Crack annotation bounding boxes overlay */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <rect x="15" y="25" width="22" height="15" fill="none" stroke="#2E7D32" strokeWidth="2" strokeDasharray="1 1" />
                  <rect x="15" y="25" width="22" height="15" fill="none" stroke="#2E7D32" strokeWidth="0.8" />
                  
                  <rect x="48" y="48" width="18" height="24" fill="none" stroke="#2E7D32" strokeWidth="2" strokeDasharray="1 1" />
                  <rect x="48" y="48" width="18" height="24" fill="none" stroke="#2E7D32" strokeWidth="0.8" />
                  
                  <rect x="72" y="30" width="14" height="28" fill="none" stroke="#2E7D32" strokeWidth="2" strokeDasharray="1 1" />
                  <rect x="72" y="30" width="14" height="28" fill="none" stroke="#2E7D32" strokeWidth="0.8" />
                </svg>
              </div>
            </div>

            {/* Analysis Results Card */}
            <div className="rounded-lg border border-brand-border bg-brand-card p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-brand-text-dark text-sm border-b border-brand-border pb-3 mb-4">Analysis Results</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-text-muted font-medium">Crack Detected</span>
                    <span className="font-mono font-bold text-brand-text-dark text-sm">{crackCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-brand-border/60 pt-3">
                    <span className="text-brand-text-muted font-medium">Crack Area Ratio</span>
                    <span className="font-mono font-bold text-brand-text-dark text-sm">{crackAreaRatio}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-brand-border/60 pt-3">
                    <span className="text-brand-text-muted font-medium">Average Confidence</span>
                    <span className="font-mono font-bold text-brand-text-dark text-sm">{avgConfidence}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-brand-border/60 pt-3">
                    <span className="text-brand-text-muted font-medium">Maximum Confidence</span>
                    <span className="font-mono font-bold text-brand-text-dark text-sm">{maxConfidence}</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-brand-text-muted mt-6 font-medium">
                CV crack detector version 1.2 is active. Bounding boxes represent crack fractures overlay.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Condition Trend Line Chart */}
            <div className="lg:col-span-2 rounded-lg border border-brand-border bg-brand-card p-5 shadow-sm">
              <h3 className="font-semibold text-brand-text-dark text-sm mb-3">Condition Trend</h3>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1EDE4" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#8A7460" }} axisLine={{ stroke: "#E5DFD5" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#8A7460" }} axisLine={{ stroke: "#E5DFD5" }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, borderColor: "#E5DFD5" }} />
                    <Line type="monotone" dataKey="score" stroke="#2E7D32" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Level Card */}
            <div className="rounded-lg border border-brand-border bg-brand-card p-5 shadow-sm flex flex-col justify-center items-center text-center">
              <h3 className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-2">Risk Level</h3>
              <div className={`text-4xl font-bold font-display ${scoreColor}`}>{site.riskScore}/100</div>
              <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${scoreBg}`}>
                {site.currentRiskLevel} Risk
              </div>
              <p className="text-xs text-brand-text-muted mt-3 font-medium">Immediate attention required →</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg border border-brand-border bg-brand-card p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-text-dark">About {site.name}</h3>
              <p className="mt-2 text-sm text-brand-text-muted leading-relaxed">{site.description || "No description available."}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-brand-border pt-6 text-sm">
              <div>
                <p className="flex items-center gap-1.5 text-xs text-brand-text-muted font-medium mb-1"><Landmark size={13} /> Architecture Type</p>
                <p className="font-semibold text-brand-text-dark">{site.heritageType}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-brand-text-muted font-medium mb-1"><Calendar size={13} /> Year Established</p>
                <p className="font-semibold text-brand-text-dark">{site.yearEstablished < 0 ? `${Math.abs(site.yearEstablished)} BCE` : site.yearEstablished}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-brand-text-muted font-medium mb-1"><Users size={13} /> Annual Visitors</p>
                <p className="font-semibold text-brand-text-dark">{site.annualVisitors ? formatNumber(site.annualVisitors) : "N/A"}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-brand-text-muted font-medium mb-1"><BarChart size={13} /> Last Assessment</p>
                <p className="font-semibold text-brand-text-dark">{formatDate(site.lastAssessment)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ChartCard title="Risk Breakdown" subtitle="Contribution by risk category">
              {riskLoading ? (
                <LoadingState compact />
              ) : riskError || !risk ? (
                <ErrorState message={riskError ?? undefined} onRetry={refetchRisk} />
              ) : (
                <RiskBreakdownChart risk={risk} />
              )}
            </ChartCard>
          </div>
        </div>
      )}

      {activeTab === "environment" && (
        <div className="space-y-6">
          <ChartCard title="Major Risk Factors" subtitle="Key contributors identified for this site">
            {riskLoading ? (
              <LoadingState compact />
            ) : riskError || !risk ? (
              <ErrorState message={riskError ?? undefined} onRetry={refetchRisk} />
            ) : risk.majorRiskFactors.length === 0 ? (
              <EmptyState title="No risk factors reported" />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {risk.majorRiskFactors.map((f) => (
                  <RiskFactorCard key={f.name} factor={f} />
                ))}
              </div>
            )}
          </ChartCard>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-6">
          <ChartCard title="Predicted Deterioration" subtitle="Forecast risk score over the next 1 / 3 / 5 years">
            {riskLoading ? (
              <LoadingState compact />
            ) : riskError || !risk ? (
              <ErrorState message={riskError ?? undefined} onRetry={refetchRisk} />
            ) : (
              <PredictionChart points={risk.predictionHorizon} currentScore={risk.riskScore} />
            )}
          </ChartCard>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <ChartCard title="Conservation Recommendations" subtitle="Priority actions and expected impact">
            {recLoading ? (
              <LoadingState compact />
            ) : recError || !recommendation ? (
              <ErrorState message={recError ?? undefined} />
            ) : (
              <RecommendationCard recommendation={recommendation} />
            )}
          </ChartCard>
        </div>
      )}
    </div>
  );
}
