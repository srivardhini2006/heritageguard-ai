import type { RiskAssessment, RiskFactor, RiskLevel } from "../types";
import { mockSites } from "./sites.mock";
import { clamp, pick, seededRandom } from "./seed";

const ALL_FACTORS: Omit<RiskFactor, "contribution" | "trend">[] = [
  { name: "Heavy rainfall", description: "Sustained monsoon exposure accelerating stone erosion" },
  { name: "High humidity", description: "Elevated moisture promoting biological growth and salt migration" },
  { name: "Air pollution", description: "Particulate deposition and acidic weathering of surfaces" },
  { name: "Visitor pressure", description: "Foot traffic and physical contact stressing structural elements" },
  { name: "Structural weakness", description: "Pre-existing cracks or foundation settlement" },
  { name: "Coastal salt exposure", description: "Sea-salt aerosol accelerating surface decay" },
  { name: "Vegetation encroachment", description: "Root growth destabilizing masonry joints" },
  { name: "Temperature fluctuation", description: "Thermal expansion/contraction cycling stressing materials" },
];

function levelFromScore(score: number): RiskLevel {
  if (score >= 85) return "CRITICAL";
  if (score >= 65) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export function generateRiskAssessment(siteId: string): RiskAssessment {
  const site = mockSites.find((s) => s.id === siteId);
  const baseScore = site?.riskScore ?? 50;
  const rand = seededRandom(siteId + "-risk");

  const environmentalRisk = clamp(baseScore + (rand() - 0.5) * 20);
  const structuralRisk = clamp(baseScore + (rand() - 0.5) * 25);
  const visitorRisk = clamp(baseScore * 0.7 + rand() * 20);
  const pollutionRisk = clamp(baseScore * 0.8 + rand() * 15);
  const climateRisk = clamp(baseScore + (rand() - 0.4) * 18);

  const factors = pick(rand, ALL_FACTORS, 4).map((f, i) => ({
    ...f,
    contribution: clamp(70 - i * 12 + rand() * 10, 10, 95),
    trend: (["up", "down", "stable"] as const)[Math.floor(rand() * 3)],
  }));

  const predictionHorizon = [1, 3, 5].map((yearsAhead) => {
    const growth = (rand() * 6 + 3) * yearsAhead;
    const predicted = clamp(baseScore + growth);
    return {
      yearsAhead,
      predictedRiskScore: Math.round(predicted),
      lowerBound: Math.round(clamp(predicted - 6 - rand() * 4)),
      upperBound: Math.round(clamp(predicted + 6 + rand() * 4)),
    };
  });

  return {
    siteId,
    riskScore: baseScore,
    riskLevel: levelFromScore(baseScore),
    predictionHorizon,
    confidence: Math.round((0.72 + rand() * 0.24) * 100) / 100,
    majorRiskFactors: factors,
    environmentalRisk: Math.round(environmentalRisk),
    structuralRisk: Math.round(structuralRisk),
    visitorRisk: Math.round(visitorRisk),
    pollutionRisk: Math.round(pollutionRisk),
    climateRisk: Math.round(climateRisk),
    assessedAt: site?.lastAssessment ?? new Date().toISOString().slice(0, 10),
  };
}
