import { useEffect, useRef, useState } from "react";
import { useInView } from "../../hooks/useInView";

interface AnimatedCounterProps {
  value: number;
  durationMs?: number;
  suffix?: string;
  className?: string;
}

/**
 * Counts up from 0 to `value` once the element scrolls into view. Used for
 * the Home page stats strip so the numbers feel "alive" on first reveal
 * rather than static text. Skips the animation under prefers-reduced-motion.
 */
export default function AnimatedCounter({ value, durationMs = 1200, suffix = "", className = "" }: AnimatedCounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Skip the count-up: jump straight to the final value.
      let raf = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(raf);
    }

    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
