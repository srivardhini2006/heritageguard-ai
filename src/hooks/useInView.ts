import { useEffect, useRef, useState } from "react";

/**
 * Lightweight scroll-reveal primitive. Returns a ref to attach to the
 * element and a boolean that flips to true the first time the element
 * enters the viewport, then stays true (no re-trigger on scroll away).
 * Used to stagger section/card reveals on the Home page and other
 * long-scrolling views without pulling in a full animation library.
 */
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  // Reveal immediately (no observed delay) when the user prefers reduced motion.
  const [inView, setInView] = useState(prefersReducedMotion);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
