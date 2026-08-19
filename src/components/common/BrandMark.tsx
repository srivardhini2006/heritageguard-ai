interface BrandMarkProps {
  size?: "sm" | "lg";
  className?: string;
  theme?: "light" | "dark";
}

/**
 * The platform's brand lockup: a custom arch-and-compass icon (built from
 * plain SVG so no external asset is needed) paired with the wordmark.
 * Used in the Sidebar (compact) and on the Home page header (large).
 */
export default function BrandMark({ size = "sm", className = "", theme = "dark" }: BrandMarkProps) {
  const iconBox = size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const iconInner = size === "lg" ? 30 : 24;
  const nameClasses = size === "lg" ? "text-2xl sm:text-3xl" : "text-base";
  const subClasses = size === "lg" ? "text-xs tracking-[0.2em]" : "text-[10px] tracking-[0.16em]";

  const textColor = theme === "light" ? "text-brand-text-dark" : "text-stone-50";
  const subColor = theme === "light" ? "text-brand-gold" : "text-brand-gold/90";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 via-sandstone-500 to-brand-forest text-base-950 shadow-md ${iconBox}`}
      >
        <svg
          viewBox="0 0 32 32"
          width={iconInner}
          height={iconInner}
          fill="none"
          aria-hidden="true"
        >
          {/* Arch — heritage architecture */}
          <path
            d="M6 27V16a10 10 0 0 1 20 0v11"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Base line */}
          <path d="M4 27h24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          {/* Compass needle — predictive intelligence */}
          <path d="M16 10.5 19 16l-3 5.5-3-5.5 3-5.5Z" fill="currentColor" />
        </svg>
      </span>
      <div className="min-w-0 leading-tight">
        <p className={`font-display font-semibold uppercase tracking-wide ${textColor} ${nameClasses}`}>
          Heritage<span className="text-brand-gold">Guard</span>
        </p>
        <p className={`font-mono uppercase ${subColor} ${subClasses}`}>
          {size === "lg" ? "Predictive Intelligence for Cultural Heritage" : "Conservation Intelligence"}
        </p>
      </div>
    </div>
  );
}
