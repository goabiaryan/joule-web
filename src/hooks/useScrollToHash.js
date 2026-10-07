import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to in-page hash after SPA mount (e.g. /#headroom-check). */
export function useScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash || pathname !== "/") return;

    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;

    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (!el) {
        if (attempts < 20) {
          attempts += 1;
          window.requestAnimationFrame(scrollToTarget);
        }
        return;
      }
      el.classList.add("scroll-reveal-visible");
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    scrollToTarget();
  }, [hash, pathname]);
}
