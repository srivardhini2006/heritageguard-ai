import type { ReactNode } from "react";
import { useInView } from "../../hooks/useInView";

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  as?: "div" | "li";
}

/**
 * Wraps a section/card so it fades and rises into place the first time it
 * scrolls into view, rather than animating on mount. Pass `delayMs` to
 * stagger a sequence of siblings (feature cards, stat cards, etc.).
 */
export default function Reveal({ children, delayMs = 0, className = "", as = "div" }: RevealProps) {
  const { ref, inView } = useInView();
  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
