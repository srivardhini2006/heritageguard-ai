import { useState } from "react";
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle, ChevronDown, CheckCircle, FileText } from "lucide-react";
import { useSites, useSite } from "../hooks/useSites";
import { useRisk } from "../hooks/useRisk";
import { useConservation } from "../hooks/useConservation";
import ChartCard from "../components/common/ChartCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

const AXIS_STYLE = { fontSize: 10, fill: "#8A7460" };
const GRID_STROKE = "#E5DFD5";
const TOOLTIP_STYLE = { background: "#FFFFFF", border: "1px solid #E5DFD5", borderRadius: 6, fontSize: 12 };

export default function Analytics() {
  const { data: sites, isLoading: sitesLoading, error: sitesError } = useSites();
  const [selectedSiteId, setSelectedSiteId] = useState<string>("site-red-fort");
  const [activeTab, setActiveTab] = useState<"prediction" | "charts">("prediction");

  const { data: site, isLoading: siteLoading, error: siteError } = useSite(selectedSiteId);
  const { data: risk, isLoading: riskLoading, error: riskError } = useRisk(selectedSiteId);
  const { data: recommendation } = useConservation(selectedSiteId);

  if (sitesLoading || siteLoading || riskLoading) return <LoadingState label="Loading risk prediction…" />;
  if (sitesError || siteError || riskError) return <ErrorState message={sitesError || siteError || riskError || "Error"} />;
  if (!sites || sites.length === 0 || !site || !risk) return <EmptyState title="No data available" />;

  // Mock factors list mapping dynamically from the risk assessment
  const factors = [
    { name: "Crack Condition (Severity & Spread)", value: risk.structuralRisk / 100, level: risk.structuralRisk >= 70 ? "High" : "Medium" },
    { name: "Rainfall (Last 30 Days)", value: risk.climateRisk / 100, level: risk.climateRisk >= 70 ? "High" : "Medium" },
    { name: "Humidity (Current Level)", value: risk.environmentalRisk / 100, level: risk.environmentalRisk >= 70 ? "High" : "Medium" },
    { name: "Air Pollution (AQI)", value: risk.pollutionRisk / 100, level: risk.pollutionRisk >= 70 ? "High" : "Medium" },
    { name: "Visitor Count (Weekly Average)", value: risk.visitorRisk / 100, level: risk.visitorRisk >= 70 ? "High" : "Medium" },
    { name: "Historical Damage (Past Records)", value: Math.min(1.0, (risk.riskScore + 10) / 100), level: risk.riskScore >= 70 ? "High" : "Medium" },
  ];

  const scoreColor = risk.riskScore >= 75 ? "text-[#C94B32]" : risk.riskScore >= 50 ? "text-[#E28D38]" : "text-[#2E7D32]";
  const barColor = risk.riskScore >= 75 ? "bg-[#C94B32]" : risk.riskScore >= 50 ? "bg-[#E28D38]" : "bg-[#2E7D32]";

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-brand-border pb-5">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-text-dark">Risk Prediction</h1>
          <p className="mt-1 text-sm text-brand-text-muted">AI-powered risk assessment based on multiple factors.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-brand-text-muted" htmlFor="site-select">
            Site
            <div className="relative">
              <select
                id="site-select"
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="appearance-none rounded-lg border border-brand-border bg-white pl-3 pr-8 py-2 text-xs font-semibold text-brand-text-dark shadow-sm cursor-pointer hover:bg-stone-50 focus:border-brand-forest focus:outline-none"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
            </div>
          </label>
        </div>
      </div>

      {/* Navigation tabs for Risk Prediction view vs Original charts */}
      <div className="flex gap-4 border-b border-brand-border pb-3">
        <button
          onClick={() => setActiveTab("prediction")}
          className={`text-xs font-bold pb-1 border-b-2 transition-all ${
            activeTab === "prediction" ? "border-brand-forest text-brand-text-dark" : "border-transparent text-brand-text-muted hover:text-brand-text-dark"
          }`}
        >
          Risk Prediction Card
        </button>
        <button
          onClick={() => setActiveTab("charts")}
          className={`text-xs font-bold pb-1 border-b-2 transition-all ${
            activeTab === "charts" ? "border-brand-forest text-brand-text-dark" : "border-transparent text-brand-text-muted hover:text-brand-text-dark"
          }`}
        >
          Environmental Factors Charts
        </button>
      </div>

      {activeTab === "prediction" && (
        <div className="space-y-6">
          {/* Top Row: Prediction details and Monument preview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Card: Predicted Risk Level */}
            <div className="lg:col-span-2 rounded-lg border border-brand-border bg-brand-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-brand-text-muted uppercase">Predicted Risk Level</span>
                <div className="flex items-center gap-3 mt-4">
                  <span className={`text-4xl font-bold font-display ${scoreColor}`}>{risk.riskLevel} Risk</span>
                  <AlertTriangle className={`h-8 w-8 ${scoreColor}`} />
                </div>
              </div>
              <div className="mt-8">
                <div className="flex justify-between items-center text-xs font-semibold text-brand-text-dark mb-2">
                  <span>Probability Score</span>
                  <span>{risk.riskScore}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${barColor}`} style={{ width: `${risk.riskScore}%` }} />
                </div>
              </div>
            </div>

            {/* Right Card: Monument Preview */}
            <div className="rounded-lg border border-brand-border bg-brand-card p-5 shadow-sm">
              <span className="text-[10px] font-semibold tracking-wider text-brand-text-muted uppercase block mb-3">Monument Preview</span>
              <div className="relative h-[160px] overflow-hidden rounded-lg border border-brand-border bg-stone-100">
                <img src={site.imageUrl} alt={site.name} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          {/* Bottom Row: Factors contributing and Recommendations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Card: Factors list */}
            <div className="lg:col-span-2 rounded-lg border border-brand-border bg-brand-card p-6 shadow-sm">
              <h3 className="font-semibold text-brand-text-dark text-sm border-b border-brand-border pb-3 mb-4">Factors Contributing to Risk</h3>
              <div className="space-y-4">
                {factors.map((f, idx) => {
                  const factorColor = f.value >= 0.7 ? "bg-[#C94B32]" : f.value >= 0.5 ? "bg-[#E28D38]" : "bg-[#2E7D32]";
                  const labelColor = f.value >= 0.7 ? "text-[#C94B32]" : f.value >= 0.5 ? "text-[#E28D38]" : "text-[#2E7D32]";
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-brand-text-dark">{f.name}</span>
                        <span className={`font-semibold ${labelColor}`}>{f.level}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${factorColor}`} style={{ width: `${f.value * 100}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-brand-text-muted w-8 text-right">{(f.value).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Card: Recommendations */}
            <div className="rounded-lg border border-brand-border bg-brand-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-brand-text-dark text-sm border-b border-brand-border pb-3 mb-4">Recommendations</h3>
                <ul className="space-y-3.5 text-xs text-brand-text-muted font-medium">
                  {recommendation?.recommendations.slice(0, 4).map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-brand-forest shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  )) || (
                    <>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-brand-forest shrink-0 mt-0.5" />
                        <span>Immediate structural inspection recommended</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-brand-forest shrink-0 mt-0.5" />
                        <span>Monitor crack progression weekly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-brand-forest shrink-0 mt-0.5" />
                        <span>Control moisture exposure</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="pt-6 border-t border-brand-border mt-6">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-forest px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:brightness-110">
                  <FileText size={14} />
                  <span>Generate Detailed Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "charts" && (
        <div className="space-y-6">
          <ChartCard title="Environmental Factors Impact" subtitle="Relative impact of environmental drivers on risk">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={[
                  { factor: "Rainfall", impact: risk.climateRisk },
                  { factor: "Humidity", impact: risk.environmentalRisk },
                  { factor: "Air Pollution", impact: risk.pollutionRisk },
                  { factor: "Visitor Count", impact: risk.visitorRisk },
                  { factor: "Structural", impact: risk.structuralRisk },
                ]}
                margin={{ left: -20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="factor" tick={AXIS_STYLE} axisLine={{ stroke: "#E5DFD5" }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={AXIS_STYLE} axisLine={{ stroke: "#E5DFD5" }} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#2C2520" }} />
                <Bar dataKey="impact" fill="#C6944A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard title="Visitor Impact" subtitle="Annual visitors vs. risk score">
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis type="number" dataKey="visitors" name="Annual visitors" tick={AXIS_STYLE} axisLine={{ stroke: "#E5DFD5" }} tickLine={false} />
                  <YAxis type="number" dataKey="riskScore" name="Risk score" domain={[0, 100]} tick={AXIS_STYLE} axisLine={{ stroke: "#E5DFD5" }} tickLine={false} />
                  <ZAxis range={[70, 70]} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={[{ visitors: site.annualVisitors || 0, riskScore: risk.riskScore }]} fill="#1A3D2F" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Pollution Impact" subtitle="Pollution index vs. risk score">
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis type="number" dataKey="pollutionIndex" name="Pollution index" tick={AXIS_STYLE} axisLine={{ stroke: "#E5DFD5" }} tickLine={false} />
                  <YAxis type="number" dataKey="riskScore" name="Risk score" domain={[0, 100]} tick={AXIS_STYLE} axisLine={{ stroke: "#E5DFD5" }} tickLine={false} />
                  <ZAxis range={[70, 70]} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={[{ pollutionIndex: risk.pollutionRisk, riskScore: risk.riskScore }]} fill="#C94B32" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}
    </div>
  );
}
