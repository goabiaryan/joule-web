import type { PowerCheckResult } from "./powerCheck.ts";

/** Funnel signal in GA4 — does not consume Netlify form submission quota. */
export function trackDiagnosticCompleted(result: PowerCheckResult): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "diagnostic_completed", {
    tier: result.tier,
    score: result.score,
    q6: result.answers[5],
    gap_count: result.gaps.length,
  });
}
