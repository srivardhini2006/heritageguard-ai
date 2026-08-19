import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = "Something went wrong while loading this data.", onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 rounded-md border border-rust-500/30 bg-rust-500/5 py-12 text-center">
      <AlertTriangle className="text-rust-400" size={26} aria-hidden="true" />
      <p className="max-w-sm text-sm text-stone-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded border border-base-600 bg-base-700 px-3 py-1.5 text-sm font-medium text-stone-100 transition-colors hover:bg-base-600"
        >
          Try again
        </button>
      )}
    </div>
  );
}
