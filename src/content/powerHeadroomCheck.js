/** Power headroom check: UI copy and anchor (logic in src/lib/powerCheck.ts). */

import { POWER_CHECK_QUESTIONS } from "../lib/powerCheck.ts";

export const HEADROOM_CHECK_SECTION_ID = "headroom-check";
/** For shared links only; prefer scrollToSectionById — do not use href on in-page CTAs. */
export const HEADROOM_CHECK_ANCHOR = `#${HEADROOM_CHECK_SECTION_ID}`;
export const PRIVACY_PATH = "/privacy";

export const powerHeadroomCheck = {
  eyebrow: "Diagnostic",
  title: "Power headroom check",
  duration: "2 minutes",
  heroCtaLabel: "Power headroom check · 2 min",
  intro:
    "Six questions on the telemetry, queue state, and tests behind a power decision. Your result shows what you can see today and what is still missing, based on your own answers.",
  progressLabel: "Question",
  backLabel: "Back",
  restartLabel: "Retake the diagnostic",
  gapsHeading: "Visibility gaps",
  gapsLoadingLabel: "Inferring visibility gaps from your answers",
  urgencyHeading: "What this implies",
  ctaAssessment: "Request an assessment",
  ctaEmailEyebrow: "For your next capacity change",
  ctaEmailTitle: "Take these gaps to whoever owns the power budget",
  ctaEmailLedeWithGaps:
    "Your result, your {n} visibility gaps and what they imply, as plain text you can paste into Slack or forward to your platform and data center teams.",
  ctaEmailLedeNoGaps:
    "Your result and what it implies, as plain text you can paste into Slack or forward to your platform and data center teams.",
  ctaEmailPreviewLabel: "In the email",
  ctaEmailPreviewItems: [
    "Your result and score",
    "Each gap and why it matters",
    "What your power situation implies",
  ],
  ctaEmailSubmit: "Email me the report",
  ctaEmailWorkEmailLabel: "Work email",
  ctaEmailPlaceholder: "you@company.com",
  ctaEmailRoleLabel: "Your role",
  ctaEmailRolePlaceholder: "Platform lead, DC ops, capacity planning…",
  ctaEmailSuccess: "Sent. Check your inbox for the readout.",
  ctaEmailNoteBeforeLink: "We don't spam, we hate it too. ",
  ctaEmailPrivacyLinkLabel: "Privacy policy",
  questions: POWER_CHECK_QUESTIONS,
};
