import { useEffect } from "react";
import { brandMeta } from "../content/phase1Product.js";

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Aligns runtime document meta with brandMeta (SPA + crawlers that execute JS). */
export function useBrandMeta({ pageTitle, pageDescription } = {}) {
  useEffect(() => {
    document.title = pageTitle ?? brandMeta.documentTitle;
    const description = pageDescription ?? brandMeta.metaDescription;
    setMeta("name", "description", description);
    setMeta("property", "og:title", pageTitle ?? brandMeta.documentTitle);
    setMeta("property", "og:description", description);
    setMeta("name", "twitter:title", pageTitle ?? brandMeta.documentTitle);
    setMeta("name", "twitter:description", description);
    setMeta("property", "og:site_name", brandMeta.name);
  }, [pageTitle, pageDescription]);
}
