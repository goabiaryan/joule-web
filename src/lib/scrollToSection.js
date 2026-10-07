/** In-page scroll without changing the URL hash. */
export function scrollToSectionById(id, { behavior = "smooth" } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.classList.add("scroll-reveal-visible");
  el.scrollIntoView({ behavior, block: "start" });
  return true;
}
