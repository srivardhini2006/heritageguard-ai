import { alertService } from "../services/alertService";
import { useAsync } from "./useAsync";

export function useAlerts() {
  return useAsync(() => alertService.getAlerts(), []);
}
