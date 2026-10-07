import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSectionById } from "../lib/scrollToSection.js";

/** Honor shared /#section links once, then drop the hash so scrolling elsewhere stays clean. */
export function useScrollToHash() {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    if (!hash || pathname !== "/") return;

    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;

    const scrollToTarget = () => {
      if (scrollToSectionById(id)) {
        window.history.replaceState(null, "", `${pathname}${search}`);
        return;
      }
      if (attempts < 20) {
        attempts += 1;
        window.requestAnimationFrame(scrollToTarget);
      }
    };

    scrollToTarget();
  }, [hash, pathname, search]);
}
