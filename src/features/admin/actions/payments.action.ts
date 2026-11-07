"use server";

import { mutateAdmin } from "../mutation";
import type { AdminActionResult, AdminPaymentMethod, AdminPaymentMethodInput } from "../types";

/**
 * Labels, sort order and the live switch. `enabled` on the storefront is derived
 * (`isActive && adapterEnabled`), so this is the only place a method can be
 * taken off sale without a redeploy.
 */
export async function updatePaymentMethodAction(
  token: string,
  id: string,
  input: AdminPaymentMethodInput,
): Promise<AdminActionResult<AdminPaymentMethod>> {
  return mutateAdmin<AdminPaymentMethod>("PATCH", `/admin/payment-methods/${id}`, token, input);
}
