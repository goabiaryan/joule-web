/**
 * Power-check funnel bookkeeping in the browser (no cookies, no PII).
 * Netlify notifications are reserved for completed lead forms only
 * (headroom-check-email, power-slo-assessment) — nothing posts here.
 */

/** Hidden form name kept for Netlify build registration only; we do not POST to it. */
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

export function trackPowerCheckEvent(payload: PowerCheckAnalyticsPayload): void {
  if (typeof window === "undefined") return;

  if (payload.kind === "answer") {
    bufferAnswerEvent(payload);
    return;
  }

  if (payload.kind === "completed" || payload.kind === "retake") {
    clearAnswerBuffer();
  }
}
