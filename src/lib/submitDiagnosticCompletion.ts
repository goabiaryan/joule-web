import { NETLIFY_FORM_DIAGNOSTIC } from "../content/netlifyForms.js";
import {
  HONEYPOT_FIELD,
  TRAP_FIELD,
  recordNetlifyFormSubmit,
  validateHumanSubmit,
} from "./formBotGuard.js";
import {
  buildPowerCheckSubmissionPayload,
  type PowerCheckResult,
} from "./powerCheck.ts";
import { formatPowerCheckEmailSummary } from "./powerCheck.ts";

export type DiagnosticCompletionContact = {
  email?: string;
  role?: string;
  contactProvided: boolean;
};

export function encodeDiagnosticCompletionBody(
  result: PowerCheckResult,
  contact: DiagnosticCompletionContact,
): string {
  const params = new URLSearchParams();
  params.set("form-name", NETLIFY_FORM_DIAGNOSTIC);
  params.set("contact_provided", contact.contactProvided ? "yes" : "no");
  params.set("tier", result.tier);
  params.set("score", String(result.score));
  params.set("q6", String(result.answers[5]));
  params.set("gap_count", String(result.gaps.length));
  params.set("result_title", result.title);
  params.set("headroomCheckSummary", formatPowerCheckEmailSummary(result));
  params.set("power_check", JSON.stringify(buildPowerCheckSubmissionPayload(result.answers)));
  if (result.gaps.length) {
    params.set("gaps_summary", result.gaps.join("\n"));
  }
  if (contact.email?.trim()) params.set("email", contact.email.trim());
  if (contact.role?.trim()) params.set("role", contact.role.trim());
  params.set(HONEYPOT_FIELD, "");
  params.set(TRAP_FIELD, "");
  return params.toString();
}

/** POST full quiz outcome to Netlify (with or without contact fields). */
export function submitDiagnosticCompletion(
  result: PowerCheckResult,
  contact: DiagnosticCompletionContact,
): boolean {
  if (typeof window === "undefined") return false;

  const guard = validateHumanSubmit(
    NETLIFY_FORM_DIAGNOSTIC,
    { [HONEYPOT_FIELD]: "", [TRAP_FIELD]: "" },
    { minMs: 0 },
  );
  if (!guard.ok) return false;

  const body = encodeDiagnosticCompletionBody(result, contact);
  const posted =
    navigator.sendBeacon &&
    navigator.sendBeacon(
      "/",
      new Blob([body], { type: "application/x-www-form-urlencoded" }),
    );

  if (!posted) {
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
  recordNetlifyFormSubmit(NETLIFY_FORM_DIAGNOSTIC);
  return true;
}
