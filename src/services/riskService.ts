import type { RiskAssessment } from "../types";
import { apiClient, USE_MOCK_DATA } from "./apiClient";
import { generateRiskAssessment } from "../mocks/risk.mock";
import { delay } from "../utils/delay";

export const riskService = {
  /** GET /api/sites/:id/risk */
  async getRiskAssessment(siteId: string): Promise<RiskAssessment> {
    if (USE_MOCK_DATA) {
      await delay();
      return generateRiskAssessment(siteId);
    }
    const { data } = await apiClient.get<RiskAssessment>(`/sites/${siteId}/risk`);
    return data;
  },
};
