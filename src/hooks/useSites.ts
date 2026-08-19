import { siteService } from "../services/siteService";
import { useAsync } from "./useAsync";

export function useSites() {
  return useAsync(() => siteService.getSites(), []);
}

export function useSite(siteId: string | undefined) {
  return useAsync(() => {
    if (!siteId) return Promise.resolve(null);
    return siteService.getSiteById(siteId);
  }, [siteId]);
}
