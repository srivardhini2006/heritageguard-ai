import type { RiskLevel } from "../types";

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function riskLevelColor(level: RiskLevel): {
  text: string;
  bg: string;
  border: string;
  dot: string;
} {
  switch (level) {
    case "LOW":
      return { text: "text-verdigris-400", bg: "bg-verdigris-500/10", border: "border-verdigris-500/30", dot: "bg-verdigris-400" };
    case "MEDIUM":
      return { text: "text-ochre-400", bg: "bg-ochre-500/10", border: "border-ochre-500/30", dot: "bg-ochre-400" };
    case "HIGH":
      return { text: "text-rust-400", bg: "bg-rust-500/10", border: "border-rust-500/30", dot: "bg-rust-400" };
    case "CRITICAL":
      return { text: "text-rust-400", bg: "bg-rust-600/20", border: "border-rust-600/40", dot: "bg-rust-500" };
    default:
      return { text: "text-stone-400", bg: "bg-stone-400/10", border: "border-stone-400/30", dot: "bg-stone-400" };
  }
}

export function severityColor(severity: "INFO" | "WARNING" | "CRITICAL") {
  switch (severity) {
    case "CRITICAL":
      return { text: "text-rust-400", bg: "bg-rust-500/10", border: "border-rust-500/30" };
    case "WARNING":
      return { text: "text-ochre-400", bg: "bg-ochre-500/10", border: "border-ochre-500/30" };
    default:
      return { text: "text-stone-400", bg: "bg-stone-400/10", border: "border-stone-400/30" };
  }
}
