import type { ImageAnalysis } from "../../types";
import SeverityMeter from "./SeverityMeter";
import { formatDate } from "../../utils/format";
import { ScanEye } from "lucide-react";

export default function ImageAnalysisSection({ analysis }: { analysis: ImageAnalysis }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div>
        <div className="relative overflow-hidden rounded-md border border-base-700 bg-base-700">
          {analysis.imageUrl ? (
            <>
              <img src={analysis.imageUrl} alt="Site condition capture" className="h-56 w-full object-cover" loading="lazy" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-forest-900/20" />
              <div className="scan-line absolute animate-scanline" aria-hidden="true" />
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full border border-gold-500/30 bg-base-950/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-gold-300">
                <ScanEye size={11} aria-hidden="true" /> CV Inspection
              </span>
            </>
          ) : (
            <div className="flex h-56 items-center justify-center text-stone-600">No image available</div>
          )}
        </div>
        {analysis.capturedAt && (
          <p className="mt-2 text-xs text-stone-500">Captured {formatDate(analysis.capturedAt)}</p>
        )}
        {analysis.detectedIssues.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {analysis.detectedIssues.map((issue) => (
              <span
                key={issue}
                className="rounded-full border border-rust-500/30 bg-rust-500/10 px-2.5 py-1 text-xs font-medium text-rust-400"
              >
                {issue}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="card-surface p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-100">Overall Visual Risk</span>
            <span className="font-mono text-lg text-stone-50">{Math.round(analysis.overallVisualRisk * 100)}%</span>
          </div>
        </div>
        <div className="space-y-3">
          <SeverityMeter label="Crack Severity" value={analysis.crackSeverity} />
          <SeverityMeter label="Erosion Severity" value={analysis.erosionSeverity} />
          <SeverityMeter label="Discoloration Severity" value={analysis.discolorationSeverity} />
          <SeverityMeter label="Vegetation Growth Severity" value={analysis.vegetationSeverity} />
        </div>
        <p className="text-xs text-stone-500">
          Detection results are supplied by the computer-vision service and rendered as-is. This panel
          automatically reflects updated results once Member 3's image-analysis API is connected.
        </p>
      </div>
    </div>
  );
}
