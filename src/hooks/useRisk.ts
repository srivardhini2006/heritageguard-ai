import { riskService } from "../services/riskService";
import { useAsync } from "./useAsync";

export function useRisk(siteId: string | undefined) {
  return useAsync(() => {
    if (!siteId) return Promise.reject(new Error("Missing site id"));
    return riskService.getRiskAssessment(siteId);
  }, [siteId]);
}
