import type { HeritageSite } from "../types";
import { apiClient, USE_MOCK_DATA } from "./apiClient";
import { mockSites } from "../mocks/sites.mock";
import { delay } from "../utils/delay";

export const siteService = {
  /** GET /api/sites */
  async getSites(): Promise<HeritageSite[]> {
    if (USE_MOCK_DATA) {
      await delay();
      return mockSites;
    }
    const { data } = await apiClient.get<HeritageSite[]>("/sites");
    return data;
  },

  /** GET /api/sites/:id */
  async getSiteById(siteId: string): Promise<HeritageSite | null> {
    if (USE_MOCK_DATA) {
      await delay();
      return mockSites.find((s) => s.id === siteId) ?? null;
    }
    const { data } = await apiClient.get<HeritageSite>(`/sites/${siteId}`);
    return data;
  },
};
