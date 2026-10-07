/**
 * Client-side bot friction for Netlify forms (honeypot + trap field + min time + rate limit).
 * Netlify still applies netlify-honeypot="bot-field" server-side; enable Form spam filters in Netlify UI.
 */

export const HONEYPOT_FIELD = "bot-field";
/** Decoy field; real UI leaves empty. Bots often fill "website" / URL fields. */
export const TRAP_FIELD = "company_website";

const READY_PREFIX = "joule.formReady.v1.";
const RATE_PREFIX = "joule.formRate.v1.";

const DEFAULT_MIN_MS = 3500;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const LIMITS = {
  assessment: 4,
  "diagnostic-completion": 10,
};

function readRateTimestamps(formKey) {
  try {
    const raw = localStorage.getItem(RATE_PREFIX + formKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function writeRateTimestamps(formKey, values) {
  try {
    localStorage.setItem(RATE_PREFIX + formKey, JSON.stringify(values));
  } catch {
    /* private mode / quota */
  }
}

export function markFormReady(formKey, at = Date.now()) {
  try {
    sessionStorage.setItem(READY_PREFIX + formKey, String(at));
  } catch {
    /* ignore */
  }
}

export function getFormReadyAt(formKey) {
  try {
    const raw = sessionStorage.getItem(READY_PREFIX + formKey);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function canSubmitNetlifyForm(formKey) {
  const max = LIMITS[formKey] ?? 5;
  const now = Date.now();
  const recent = readRateTimestamps(formKey).filter((t) => now - t < RATE_WINDOW_MS);
  writeRateTimestamps(formKey, recent);
  return recent.length < max;
}

export function recordNetlifyFormSubmit(formKey) {
  const now = Date.now();
  const recent = readRateTimestamps(formKey).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  writeRateTimestamps(formKey, recent);
}

export const FORM_RATE_LIMIT_MESSAGE =
  "Too many submissions from this browser. Try again later or email hello@joule.lat.";

/**
 * @returns {{ ok: true } | { ok: false, silent: boolean, message?: string }}
 */
export function validateHumanSubmit(formKey, fields, { minMs = DEFAULT_MIN_MS } = {}) {
  if (fields[HONEYPOT_FIELD]?.trim()) {
    return { ok: false, silent: true };
  }
  if (fields[TRAP_FIELD]?.trim()) {
    return { ok: false, silent: true };
  }

  let readyAt = getFormReadyAt(formKey);
  if (readyAt == null) {
    markFormReady(formKey);
    readyAt = getFormReadyAt(formKey);
    if (minMs > 0) {
      return { ok: false, silent: true };
    }
  }
  if (Date.now() - readyAt < minMs) {
    return { ok: false, silent: true };
  }

  if (!canSubmitNetlifyForm(formKey)) {
    return { ok: false, silent: false, message: FORM_RATE_LIMIT_MESSAGE };
  }

  return { ok: true };
}
