import { conservationService } from "../services/conservationService";
import { useAsync } from "./useAsync";

export function useConservation(siteId: string | undefined) {
  return useAsync(() => {
    if (!siteId) return Promise.reject(new Error("Missing site id"));
    return conservationService.getRecommendation(siteId);
  }, [siteId]);
}

export function useConservationRanking() {
  return useAsync(() => conservationService.getPriorityRanking(), []);
}
