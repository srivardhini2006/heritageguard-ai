import { Link } from "react-router-dom";
import { AlertTriangle, CloudRain, ImageOff, ClipboardClock } from "lucide-react";
import type { AlertItem, AlertType } from "../../types";
import { formatDate } from "../../utils/format";

const TYPE_ICON: Record<AlertType, typeof AlertTriangle> = {
  RISK_INCREASE: AlertTriangle,
  ENVIRONMENTAL: CloudRain,
  IMAGE_DETERIORATION: ImageOff,
  CONSERVATION_OVERDUE: ClipboardClock,
};

const SEVERITY_CLASSES: Record<AlertItem["severity"], { bg: string; border: string; text: string; iconBg: string }> = {
  CRITICAL: {
    bg: "bg-red-50/50",
    border: "border-red-100",
    text: "text-[#C94B32]",
    iconBg: "bg-red-50 border-red-200 text-[#C94B32]",
  },
  WARNING: {
    bg: "bg-orange-50/50",
    border: "border-orange-100",
    text: "text-[#E28D38]",
    iconBg: "bg-orange-50 border-orange-200 text-[#E28D38]",
  },
  INFO: {
    bg: "bg-stone-50/50",
    border: "border-stone-100",
    text: "text-brand-text-muted",
    iconBg: "bg-stone-50 border-stone-200 text-brand-text-muted",
  },
};

export default function AlertCard({ alert }: { alert: AlertItem }) {
  const c = SEVERITY_CLASSES[alert.severity] || SEVERITY_CLASSES.INFO;
  const Icon = TYPE_ICON[alert.type] || AlertTriangle;

  return (
    <div className={`flex items-start gap-4 rounded-lg border p-3.5 transition-all duration-200 hover:shadow-sm ${c.bg} ${c.border}`}>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${c.iconBg}`} aria-hidden="true">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-brand-text-dark leading-tight">{alert.message}</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-brand-text-muted">
          <Link to={`/sites/${alert.siteId}`} className="font-semibold hover:underline text-brand-gold">
            {alert.siteName}
          </Link>
          <span aria-hidden="true" className="text-gray-300">•</span>
          <span>{formatDate(alert.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
