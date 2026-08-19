import type { AnalyticsOverview, RiskTrendPoint } from "../types";
import { mockSites } from "./sites.mock";
import { seededRandom } from "./seed";

function buildRiskTrend(): RiskTrendPoint[] {
  const rand = seededRandom("risk-trend");
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  let score = 48;
  return months.map((m) => {
    score = Math.max(20, Math.min(90, score + (rand() - 0.42) * 8));
    return { date: `${m} 2026`, averageRiskScore: Math.round(score) };
  });
}

export function generateAnalyticsOverview(): AnalyticsOverview {
  const rand = seededRandom("analytics-overview");

  const distribution = mockSites.reduce(
    (acc, s) => {
      if (s.currentRiskLevel === "LOW") acc.low++;
      else if (s.currentRiskLevel === "MEDIUM") acc.medium++;
      else if (s.currentRiskLevel === "HIGH") acc.high++;
      else acc.critical++;
      return acc;
    },
    { low: 0, medium: 0, high: 0, critical: 0 }
  );

  const averageRiskScore = Math.round(
    mockSites.reduce((sum, s) => sum + s.riskScore, 0) / mockSites.length
  );

  return {
    riskDistribution: distribution,
    riskTrend: buildRiskTrend(),
    averageRiskScore,
    environmentalFactors: [
      { factor: "Rainfall", impact: Math.round(50 + rand() * 40) },
      { factor: "Humidity", impact: Math.round(45 + rand() * 40) },
      { factor: "Air Pollution", impact: Math.round(40 + rand() * 45) },
      { factor: "Temperature Swing", impact: Math.round(30 + rand() * 35) },
      { factor: "Coastal Salt", impact: Math.round(25 + rand() * 45) },
    ],
    visitorImpact: mockSites.map((s) => ({
      site: s.name,
      visitors: s.annualVisitors ?? 0,
      riskScore: s.riskScore,
    })),
    pollutionImpact: mockSites.map((s) => ({
      site: s.name,
      pollutionIndex: Math.round(30 + rand() * 60),
      riskScore: s.riskScore,
    })),
    rainfallHumidity: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((month) => ({
      month,
      rainfall: Math.round(20 + rand() * 250),
      humidity: Math.round(40 + rand() * 45),
    })),
    siteComparison: mockSites.map((s) => ({ site: s.name, riskScore: s.riskScore })),
    predictionConfidence: mockSites.map((s) => ({
      site: s.name,
      confidence: Math.round((0.7 + rand() * 0.28) * 100),
    })),
  };
}
