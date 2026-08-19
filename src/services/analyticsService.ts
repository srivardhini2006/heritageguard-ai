import type { AnalyticsOverview } from "../types";
import { apiClient, USE_MOCK_DATA } from "./apiClient";
import { generateAnalyticsOverview } from "../mocks/analytics.mock";
import { delay } from "../utils/delay";

export const analyticsService = {
  /** GET /api/analytics */
  async getOverview(): Promise<AnalyticsOverview> {
    if (USE_MOCK_DATA) {
      await delay();
      return generateAnalyticsOverview();
    }
    const { data } = await apiClient.get<AnalyticsOverview>("/analytics");
    return data;
  },
};
