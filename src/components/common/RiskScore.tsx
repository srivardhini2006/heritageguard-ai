import { useEffect, useState } from "react";
import type { RiskLevel } from "../../types";
import { riskLevelColor } from "../../utils/format";

interface RiskScoreProps {
  score: number; // 0–100
  level: RiskLevel;
  size?: number;
  label?: string;
}

const STROKE_COLOR: Record<RiskLevel, string> = {
  LOW: "#6FA79A",
  MEDIUM: "#E0B75C",
  HIGH: "#CC6A4C",
  CRITICAL: "#B5482F",
};

/**
 * Signature "weathering gauge" — modeled loosely on the graduated dials used
 * in conservation instruments to read material loss. The tick marks around
 * the rim stand for a measurement scale rather than decoration. The ring
 * animates in from zero on mount/update for a premium reveal.
 */
export default function RiskScore({ score, level, size = 168, label }: RiskScoreProps) {
  const c = riskLevelColor(level);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const targetProgress = (clamped / 100) * circumference;
  const ticks = Array.from({ length: 40 });

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setProgress(targetProgress));
    return () => cancelAnimationFrame(raf);
  }, [targetProgress]);

  return (
    <div className="flex flex-col items-center" role="img" aria-label={`Risk score ${score} out of 100, ${level} risk`}>
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-3 rounded-full opacity-30 blur-xl"
          style={{ background: STROKE_COLOR[level] }}
          aria-hidden="true"
        />
        <svg viewBox="0 0 180 180" className="relative h-full w-full -rotate-90">
          {ticks.map((_, i) => {
            const angle = (i / ticks.length) * 360;
            const isMajor = i % 5 === 0;
            return (
              <line
                key={i}
                x1="90"
                y1={isMajor ? "10" : "14"}
                x2="90"
                y2="20"
                stroke="#374146"
                strokeWidth={isMajor ? 1.5 : 1}
                transform={`rotate(${angle} 90 90)`}
              />
            );
          })}
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#242C30" strokeWidth="10" />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={STROKE_COLOR[level]}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference - progress}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-semibold text-stone-50">{score}</span>
          <span className="font-mono text-xs text-stone-400">/ 100</span>
        </div>
      </div>
      <div className={`mt-2 rounded-full border px-3 py-1 font-mono text-xs font-medium uppercase tracking-wide ${c.text} ${c.bg} ${c.border}`}>
        {level} RISK
      </div>
      {label && <p className="mt-2 text-center text-sm text-stone-400">{label}</p>}
    </div>
  );
}
