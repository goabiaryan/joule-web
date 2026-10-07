import { useEffect } from "react";

export function useHeroPointerGlow(ref) {
  useEffect(() => {
    const hero = ref.current;
    if (!hero) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const onMove = (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      hero.style.setProperty("--hero-glow-x", `${x}px`);
      hero.style.setProperty("--hero-glow-y", `${y}px`);
      hero.classList.add("hero-pointer-active");
    };

    const onLeave = () => {
      hero.classList.remove("hero-pointer-active");
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}
