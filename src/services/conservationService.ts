import type { ConservationRecommendation } from "../types";
import { apiClient, USE_MOCK_DATA } from "./apiClient";
import { generateConservationRecommendation } from "../mocks/conservation.mock";
import { mockSites } from "../mocks/sites.mock";
import { delay } from "../utils/delay";

export const conservationService = {
  /** GET /api/sites/:id/conservation */
  async getRecommendation(siteId: string): Promise<ConservationRecommendation> {
    if (USE_MOCK_DATA) {
      await delay();
      return generateConservationRecommendation(siteId);
    }
    const { data } = await apiClient.get<ConservationRecommendation>(`/sites/${siteId}/conservation`);
    return data;
  },

  /** GET /api/conservation (priority ranking across all sites) */
  async getPriorityRanking(): Promise<ConservationRecommendation[]> {
    if (USE_MOCK_DATA) {
      await delay();
      return mockSites.map((s) => generateConservationRecommendation(s.id));
    }
    const { data } = await apiClient.get<ConservationRecommendation[]>("/conservation");
    return data;
  },
};
