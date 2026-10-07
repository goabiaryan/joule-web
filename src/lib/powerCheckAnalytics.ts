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
const ANSWER_BUFFER_KEY = "joule.powerCheck.analytics.answers.v1";

type BufferedAnswer = {
  questionId: string;
  answerValue: number;
  stepIndex: number;
};

function readAnswerBuffer(): BufferedAnswer[] {
  try {
    const raw = sessionStorage.getItem(ANSWER_BUFFER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is BufferedAnswer =>
        row != null &&
        typeof row === "object" &&
        typeof (row as BufferedAnswer).questionId === "string" &&
        typeof (row as BufferedAnswer).answerValue === "number" &&
        typeof (row as BufferedAnswer).stepIndex === "number",
    );
  } catch {
    return [];
  }
}

function writeAnswerBuffer(rows: BufferedAnswer[]): void {
  try {
    if (rows.length === 0) {
      sessionStorage.removeItem(ANSWER_BUFFER_KEY);
      return;
    }
    sessionStorage.setItem(ANSWER_BUFFER_KEY, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

function clearAnswerBuffer(): void {
  writeAnswerBuffer([]);
}

function bufferAnswerEvent(payload: PowerCheckAnalyticsPayload): void {
  if (payload.questionId == null || payload.answerValue == null || payload.stepIndex == null) {
    return;
  }
  const rows = readAnswerBuffer();
  rows.push({
    questionId: payload.questionId,
    answerValue: payload.answerValue,
    stepIndex: payload.stepIndex,
  });
  writeAnswerBuffer(rows);
}

/** Netlify emails fire per submission — never POST per-question events. */
const NETLIFY_POST_KINDS: ReadonlySet<PowerCheckAnalyticsKind> = new Set([
  "completed",
  "scoping_click",
  "email_sent",
  "scoping_landed",
  "retake",
]);

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
  /** JSON array of per-question answers (set on `completed`). */
  answerTrail?: string;
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
    "answerTrail",
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
                : key === "answerTrail"
                  ? "answer_trail"
                  : key;
      params.set(fieldName, String(value));
    }
  }
  params.set("bot-field", "");
  return params.toString();
}

function postPowerCheckAnalytics(payload: PowerCheckAnalyticsPayload): void {
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

export function trackPowerCheckEvent(payload: PowerCheckAnalyticsPayload): void {
  if (typeof window === "undefined") return;

  if (payload.kind === "started") {
    return;
  }

  if (payload.kind === "answer") {
    bufferAnswerEvent(payload);
    return;
  }

  if (payload.kind === "retake") {
    clearAnswerBuffer();
  }

  if (!NETLIFY_POST_KINDS.has(payload.kind)) {
    return;
  }

  let toPost = payload;
  if (payload.kind === "completed") {
    const trail = readAnswerBuffer();
    toPost = {
      ...payload,
      answerTrail: trail.length > 0 ? JSON.stringify(trail) : undefined,
    };
    clearAnswerBuffer();
  }

  postPowerCheckAnalytics(toPost);
}
