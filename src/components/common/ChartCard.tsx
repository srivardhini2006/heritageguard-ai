import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function ChartCard({ title, subtitle, children, action }: ChartCardProps) {
  return (
    <div className="rounded-lg border border-brand-border bg-brand-card p-5 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-up">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-brand-text-dark text-base">{title}</h3>
          {subtitle && <p className="text-xs text-brand-text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
