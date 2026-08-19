import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * Wraps routed page content so navigating between pages produces a soft
 * fade + rise instead of an instant swap. Keying on the pathname forces
 * React to remount the wrapper (and therefore replay the CSS animation)
 * on every navigation. Respects prefers-reduced-motion globally via the
 * animation-duration override in index.css.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
}
