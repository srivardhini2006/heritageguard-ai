// ─────────────────────────────────────────────────────────────────────────
// Shared domain types for the Heritage Site Risk & Conservation platform.
//
// These interfaces are the CONTRACT between this frontend and every
// backend/ML module (Members 1, 2, 3, 5, 6). They intentionally stay
// close to plain JSON so any teammate's API can be mapped onto them.
//
// NOTE: fields marked optional (`?`) are allowed to be absent from a
// backend response — the UI degrades gracefully (see EmptyState/utils).
// See API_CONTRACT.md for the full endpoint-by-endpoint specification.
// ─────────────────────────────────────────────────────────────────────────

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type HeritageType =
  | "Temple"
  | "Fort"
  | "Monument"
  | "Rock-Cut Architecture"
  | "Stupa"
  | "Palace"
  | "Archaeological Site"
  | "Mausoleum";

export interface HeritageSite {
  id: string;
  name: string;
  location: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  heritageType: HeritageType;
  yearEstablished: number;
  currentRiskLevel: RiskLevel;
  riskScore: number; // 0–100
  lastAssessment: string; // ISO date
  imageUrl?: string;
  description?: string;
  unescoListed?: boolean;
  annualVisitors?: number;
}

export interface RiskFactor {
  name: string;
  contribution: number; // 0–100, relative weight in the overall score
  trend?: "up" | "down" | "stable";
  description?: string;
}

export interface RiskAssessment {
  siteId: string;
  riskScore: number; // 0–100
  riskLevel: RiskLevel;
  predictionHorizon: PredictionPoint[]; // forecast over time
  confidence: number; // 0–1
  majorRiskFactors: RiskFactor[];
  environmentalRisk: number; // 0–100
  structuralRisk: number; // 0–100
  visitorRisk: number; // 0–100
  pollutionRisk: number; // 0–100
  climateRisk: number; // 0–100
  assessedAt: string; // ISO date
}

export interface PredictionPoint {
  yearsAhead: number; // 1, 3, 5 ...
  predictedRiskScore: number; // 0–100
  lowerBound?: number;
  upperBound?: number;
}

export type DeteriorationIssue =
  | "Cracking"
  | "Erosion"
  | "Discoloration"
  | "Vegetation Growth"
  | "Structural Displacement"
  | "Salt Efflorescence";

export interface ImageAnalysis {
  siteId: string;
  imageId: string;
  imageUrl: string;
  capturedAt?: string; // ISO date
  detectedIssues: DeteriorationIssue[];
  crackSeverity: number; // 0–1
  erosionSeverity: number; // 0–1
  discolorationSeverity: number; // 0–1
  vegetationSeverity: number; // 0–1
  overallVisualRisk: number; // 0–1
  annotatedImageUrl?: string; // image with CV overlays, if provided
}

export type PriorityLevel = "IMMEDIATE" | "HIGH" | "MONITOR";

export interface ConservationRecommendation {
  siteId: string;
  priorityScore: number; // 0–100
  priorityLevel: PriorityLevel;
  recommendations: string[];
  estimatedUrgency: string; // e.g. "Within 3 months"
  interventionImpact: number; // 0–100, expected risk reduction
  rationale?: string[]; // "why this site is prioritized"
}

export type AlertType =
  | "RISK_INCREASE"
  | "ENVIRONMENTAL"
  | "IMAGE_DETERIORATION"
  | "CONSERVATION_OVERDUE";

export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface AlertItem {
  id: string;
  siteId: string;
  siteName: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  createdAt: string; // ISO date
}

export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface RiskTrendPoint {
  date: string; // ISO date, monthly buckets typically
  averageRiskScore: number;
}

export interface AnalyticsOverview {
  riskDistribution: RiskDistribution;
  riskTrend: RiskTrendPoint[];
  averageRiskScore: number;
  environmentalFactors: { factor: string; impact: number }[];
  visitorImpact: { site: string; visitors: number; riskScore: number }[];
  pollutionImpact: { site: string; pollutionIndex: number; riskScore: number }[];
  rainfallHumidity: { month: string; rainfall: number; humidity: number }[];
  siteComparison: { site: string; riskScore: number }[];
  predictionConfidence: { site: string; confidence: number }[];
}

export interface DashboardSummary {
  totalSites: number;
  highRiskSites: number;
  mediumRiskSites: number;
  lowRiskSites: number;
  immediateActionSites: number;
  averageRiskScore: number;
}

// Generic async-resource shape used by hooks (loading / error / empty aware)
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
