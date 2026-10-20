/**
 * Flip to `true` once `PATCH /api/v1/user/password` lands on the backend. Until
 * then the change-password form stays interactive (so the checklist and the
 * validation still demonstrate the rules) but its submit CTA stays disabled —
 * matching the honest placeholder precedent of `/forgot-password`.
 */
export const PASSWORD_CHANGE_ENABLED = false;
