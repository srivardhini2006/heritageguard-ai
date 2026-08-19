import type { ImageAnalysis } from "../types";
import { apiClient, USE_MOCK_DATA } from "./apiClient";
import { generateImageAnalysis } from "../mocks/imageAnalysis.mock";
import { delay } from "../utils/delay";

export const imageAnalysisService = {
  /** GET /api/sites/:id/image-analysis */
  async getAnalysis(siteId: string): Promise<ImageAnalysis> {
    if (USE_MOCK_DATA) {
      await delay();
      return generateImageAnalysis(siteId);
    }
    const { data } = await apiClient.get<ImageAnalysis>(`/sites/${siteId}/image-analysis`);
    return data;
  },
};
