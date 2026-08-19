import { useState } from "react";
import type { HeritageType } from "../../types";
import { getFallbackTreatment } from "../../data/heritageImages";

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  heritageType?: HeritageType;
  className?: string;
  imgClassName?: string;
}

/**
 * Renders a photo when one loads successfully; if the URL is missing or
 * fails to load it falls back to a premium CSS gradient placeholder.
 * Never shows a broken-image icon or lets the app crash on a bad link.
 */
export default function ImageWithFallback({ src, alt, heritageType, className = "", imgClassName = "" }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const treatment = getFallbackTreatment(heritageType);
  const showFallback = !src || failed;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!showFallback && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={imgClassName}
        />
      )}
      {showFallback && (
        <div
          className={`bg-heritage-grid h-full w-full bg-gradient-to-br ${treatment.gradient}`}
          role="img"
          aria-label={alt}
        />
      )}
    </div>
  );
}
