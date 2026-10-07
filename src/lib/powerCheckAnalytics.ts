/**
 * Anonymous power-check funnel events via Netlify Forms (no cookies, no PII).
 * Export submissions from Netlify → aggregate by event, question_id, tier, q6, session_id.
 */

import {
  HONEYPOT_FIELD,
  TRAP_FIELD,
  recordNetlifyFormSubmit,
  validateHumanSubmit,
} from "./formBotGuard.js";

export const POWER_CHECK_ANALYTICS_FORM = "power-check-analytics";

const SESSION_KEY = "joule.powerCheck.session.v1";

export type PowerCheckAnalyticsKind =
  | "started"
  | "answer"
  | "completed"
  | "scoping_click"
  | "email_sent"
  | "scoping_landed"
  | "retake";

export function getPowerCheckSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "no-storage";
  }
}

export function resetPowerCheckSessionId(): string {
  try {
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return "no-storage";
  }
}

export type PowerCheckAnalyticsPayload = {
  kind: PowerCheckAnalyticsKind;
  questionId?: string;
  answerValue?: number;
  stepIndex?: number;
  tier?: string;
  score?: number;
  q6?: number;
  gapCount?: number;
  role?: string;
};

function encodeAnalyticsBody(payload: PowerCheckAnalyticsPayload): string {
  const params = new URLSearchParams();
  params.set("form-name", POWER_CHECK_ANALYTICS_FORM);
  params.set("kind", payload.kind);
  params.set("session_id", getPowerCheckSessionId());
  const optional: (keyof PowerCheckAnalyticsPayload)[] = [
    "questionId",
    "answerValue",
    "stepIndex",
    "tier",
    "score",
    "q6",
    "gapCount",
    "role",
  ];
  for (const key of optional) {
    const value = payload[key];
    if (value !== undefined && value !== "") {
      const fieldName =
        key === "questionId"
          ? "question_id"
          : key === "answerValue"
            ? "answer_value"
            : key === "stepIndex"
              ? "step_index"
              : key === "gapCount"
                ? "gap_count"
                : key;
      params.set(fieldName, String(value));
    }
  }
  params.set("bot-field", "");
  return params.toString();
}

export function trackPowerCheckEvent(payload: PowerCheckAnalyticsPayload): void {
  if (typeof window === "undefined") return;

  const guard = validateHumanSubmit(
    POWER_CHECK_ANALYTICS_FORM,
    { [HONEYPOT_FIELD]: "", [TRAP_FIELD]: "" },
    { minMs: 0 },
  );
  if (!guard.ok) return;

  const body = encodeAnalyticsBody(payload);
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
  recordNetlifyFormSubmit(POWER_CHECK_ANALYTICS_FORM);
}
