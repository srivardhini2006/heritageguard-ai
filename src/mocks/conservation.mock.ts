import type { ConservationRecommendation, PriorityLevel } from "../types";
import { mockSites } from "./sites.mock";
import { clamp, pick, seededRandom } from "./seed";

const ACTION_POOL = [
  "Apply protective consolidant to exposed stone surfaces",
  "Install localized drainage to divert monsoon runoff",
  "Conduct structural survey of load-bearing elements",
  "Introduce visitor flow management at high-contact zones",
  "Clean biological growth and re-apply anti-fungal treatment",
  "Repoint eroded mortar joints in vulnerable sections",
  "Install micro-climate sensors for continuous monitoring",
  "Schedule detailed condition mapping of painted surfaces",
  "Reinforce foundation in areas showing settlement",
  "Restrict access to actively deteriorating structural bays",
];

function priorityFromScore(score: number): PriorityLevel {
  if (score >= 80) return "IMMEDIATE";
  if (score >= 55) return "HIGH";
  return "MONITOR";
}

const URGENCY_BY_PRIORITY: Record<PriorityLevel, string> = {
  IMMEDIATE: "Within 3 months",
  HIGH: "Within 6–12 months",
  MONITOR: "Routine annual review",
};

export function generateConservationRecommendation(siteId: string): ConservationRecommendation {
  const site = mockSites.find((s) => s.id === siteId);
  const rand = seededRandom(siteId + "-conservation");
  const priorityScore = clamp((site?.riskScore ?? 50) + (rand() - 0.3) * 15);
  const priorityLevel = priorityFromScore(priorityScore);

  return {
    siteId,
    priorityScore: Math.round(priorityScore),
    priorityLevel,
    recommendations: pick(rand, ACTION_POOL, 3 + Math.floor(rand() * 2)),
    estimatedUrgency: URGENCY_BY_PRIORITY[priorityLevel],
    interventionImpact: Math.round(clamp(30 + rand() * 45)),
    rationale: [
      `Current risk score of ${site?.riskScore ?? "—"} places this site above the regional average.`,
      "Structural and environmental indicators show a converging upward trend.",
      "Visitor volume compounds physical wear on already-weathered surfaces.",
    ],
  };
}
