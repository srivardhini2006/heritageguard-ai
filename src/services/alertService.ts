import type { AlertItem } from "../types";
import { apiClient, USE_MOCK_DATA } from "./apiClient";
import { generateAlerts } from "../mocks/alerts.mock";
import { delay } from "../utils/delay";

export const alertService = {
  /** GET /api/alerts */
  async getAlerts(): Promise<AlertItem[]> {
    if (USE_MOCK_DATA) {
      await delay();
      return generateAlerts();
    }
    const { data } = await apiClient.get<AlertItem[]>("/alerts");
    return data;
  },
};
