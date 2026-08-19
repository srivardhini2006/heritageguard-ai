import { imageAnalysisService } from "../services/imageAnalysisService";
import { useAsync } from "./useAsync";

export function useImageAnalysis(siteId: string | undefined) {
  return useAsync(() => {
    if (!siteId) return Promise.reject(new Error("Missing site id"));
    return imageAnalysisService.getAnalysis(siteId);
  }, [siteId]);
}
