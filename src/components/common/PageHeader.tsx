import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({ icon: Icon, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex animate-fade-up items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500/15 to-forest-500/10 text-gold-400 shadow-panel">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-50">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-stone-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
