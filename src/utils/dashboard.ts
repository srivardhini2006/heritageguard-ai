import type { DashboardSummary, HeritageSite } from "../types";

export function computeDashboardSummary(sites: HeritageSite[]): DashboardSummary {
  const totalSites = sites.length;
  const highRiskSites = sites.filter((s) => s.currentRiskLevel === "HIGH" || s.currentRiskLevel === "CRITICAL").length;
  const mediumRiskSites = sites.filter((s) => s.currentRiskLevel === "MEDIUM").length;
  const lowRiskSites = sites.filter((s) => s.currentRiskLevel === "LOW").length;
  const immediateActionSites = sites.filter((s) => s.currentRiskLevel === "CRITICAL").length;
  const averageRiskScore = totalSites
    ? Math.round(sites.reduce((sum, s) => sum + s.riskScore, 0) / totalSites)
    : 0;

  return {
    totalSites,
    highRiskSites,
    mediumRiskSites,
    lowRiskSites,
    immediateActionSites,
    averageRiskScore,
  };
}
