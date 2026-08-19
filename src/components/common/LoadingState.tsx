import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  label?: string;
  compact?: boolean;
}

export default function LoadingState({ label = "Loading data…", compact = false }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-2 text-stone-400 ${compact ? "py-6" : "py-16"}`}
    >
      <Loader2 className="animate-spin text-sandstone-400" size={compact ? 20 : 28} aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
