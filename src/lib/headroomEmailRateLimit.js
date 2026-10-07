/** @deprecated Use formBotGuard with form key headroom-check-email. Kept for stable imports. */
import {
  FORM_RATE_LIMIT_MESSAGE,
  canSubmitNetlifyForm,
  recordNetlifyFormSubmit,
} from "./formBotGuard.js";

const FORM = "headroom-check-email";

export function canSubmitHeadroomEmail() {
  return canSubmitNetlifyForm(FORM);
}

export function recordHeadroomEmailSubmit() {
  recordNetlifyFormSubmit(FORM);
}

export const HEADROOM_EMAIL_RATE_LIMIT_MESSAGE = FORM_RATE_LIMIT_MESSAGE;
