/** @deprecated Use formBotGuard with form key diagnostic-completion. Kept for stable imports. */
import {
  FORM_RATE_LIMIT_MESSAGE,
  canSubmitNetlifyForm,
  recordNetlifyFormSubmit,
} from "./formBotGuard.js";
import { NETLIFY_FORM_DIAGNOSTIC } from "../content/netlifyForms.js";

const FORM = NETLIFY_FORM_DIAGNOSTIC;

export function canSubmitHeadroomEmail() {
  return canSubmitNetlifyForm(FORM);
}

export function recordHeadroomEmailSubmit() {
  recordNetlifyFormSubmit(FORM);
}

export const HEADROOM_EMAIL_RATE_LIMIT_MESSAGE = FORM_RATE_LIMIT_MESSAGE;
