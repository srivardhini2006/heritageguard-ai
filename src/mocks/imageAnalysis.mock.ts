import type { DeteriorationIssue, ImageAnalysis } from "../types";
import { mockSites } from "./sites.mock";
import { clamp, pick, seededRandom } from "./seed";

const ALL_ISSUES: DeteriorationIssue[] = [
  "Cracking",
  "Erosion",
  "Discoloration",
  "Vegetation Growth",
  "Structural Displacement",
  "Salt Efflorescence",
];

export function generateImageAnalysis(siteId: string): ImageAnalysis {
  const site = mockSites.find((s) => s.id === siteId);
  const rand = seededRandom(siteId + "-image");
  const baseSeverity = (site?.riskScore ?? 50) / 100;

  const crackSeverity = clamp(baseSeverity + (rand() - 0.5) * 0.3, 0, 1) / 1;
  const erosionSeverity = clamp(baseSeverity + (rand() - 0.5) * 0.35, 0, 1);
  const discolorationSeverity = clamp(baseSeverity * 0.8 + rand() * 0.2, 0, 1);
  const vegetationSeverity = clamp(baseSeverity * 0.6 + rand() * 0.3, 0, 1);
  const overallVisualRisk = clamp(
    (crackSeverity + erosionSeverity + discolorationSeverity + vegetationSeverity) / 4,
    0,
    1
  );

  return {
    siteId,
    imageId: `${siteId}-img-01`,
    imageUrl: site?.imageUrl ?? "",
    capturedAt: site?.lastAssessment,
    detectedIssues: pick(rand, ALL_ISSUES, 2 + Math.floor(rand() * 3)),
    crackSeverity: round2(crackSeverity),
    erosionSeverity: round2(erosionSeverity),
    discolorationSeverity: round2(discolorationSeverity),
    vegetationSeverity: round2(vegetationSeverity),
    overallVisualRisk: round2(overallVisualRisk),
    annotatedImageUrl: undefined,
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
