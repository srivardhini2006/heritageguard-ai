import type { AlertItem, AlertSeverity, AlertType } from "../types";
import { mockSites } from "./sites.mock";
import { seededRandom } from "./seed";

const TEMPLATES: { type: AlertType; severity: AlertSeverity; message: (n: string) => string }[] = [
  { type: "RISK_INCREASE", severity: "CRITICAL", message: (n) => `Risk score for ${n} increased by 12% since last assessment` },
  { type: "ENVIRONMENTAL", severity: "WARNING", message: (n) => `High rainfall detected near ${n}` },
  { type: "IMAGE_DETERIORATION", severity: "WARNING", message: (n) => `New image deterioration detected at ${n}` },
  { type: "CONSERVATION_OVERDUE", severity: "INFO", message: (n) => `Conservation assessment overdue for ${n}` },
  { type: "ENVIRONMENTAL", severity: "INFO", message: (n) => `Humidity levels trending upward at ${n}` },
  { type: "RISK_INCREASE", severity: "WARNING", message: (n) => `Structural risk factor elevated at ${n}` },
];

export function generateAlerts(): AlertItem[] {
  const rand = seededRandom("global-alerts");
  const alerts: AlertItem[] = [];
  let idx = 0;

  mockSites.forEach((site) => {
    const count = 1 + Math.floor(rand() * 2);
    for (let i = 0; i < count; i++) {
      const template = TEMPLATES[Math.floor(rand() * TEMPLATES.length)];
      const daysAgo = Math.floor(rand() * 21);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      alerts.push({
        id: `alert-${idx++}`,
        siteId: site.id,
        siteName: site.name,
        type: template.type,
        severity: template.severity,
        message: template.message(site.name),
        createdAt: date.toISOString(),
      });
    }
  });

  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
