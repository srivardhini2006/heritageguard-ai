import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: LucideIcon;
}

export default function EmptyState({
  title = "Nothing here yet",
  message = "There's no data to show for this view right now.",
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-base-700 bg-base-800/40 py-16 text-center">
      <Icon className="text-stone-600" size={28} aria-hidden="true" />
      <p className="font-medium text-stone-200">{title}</p>
      <p className="max-w-sm text-sm text-stone-400">{message}</p>
    </div>
  );
}
