import type { HeritageSite } from "../types";
import { siteService } from "./siteService";

// Thin wrapper kept separate from siteService so Member 2 (GIS & Spatial
// Analytics) can extend this with map-specific endpoints (e.g. geofences,
// terrain layers, spatial risk overlays) without touching site listing logic.
export const mapService = {
  async getMapSites(): Promise<HeritageSite[]> {
    return siteService.getSites();
  },
};
