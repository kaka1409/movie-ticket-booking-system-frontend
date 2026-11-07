"use server";

import { mutateAdmin } from "../mutation";
import type {
  AdminActionResult,
  AdminCombo,
  AdminComboInput,
  AdminFoodItem,
  AdminFoodItemInput,
} from "../types";

/** Combos are standalone catalog rows — they never reference food items. */
export async function createComboAction(
  token: string,
  input: AdminComboInput & { name: string; price: number },
): Promise<AdminActionResult<AdminCombo>> {
  return mutateAdmin<AdminCombo>("POST", "/admin/combos", token, input);
}

export async function updateComboAction(
  token: string,
  id: string,
  input: AdminComboInput,
): Promise<AdminActionResult<AdminCombo>> {
  return mutateAdmin<AdminCombo>("PATCH", `/admin/combos/${id}`, token, input);
}

/** Answers `409 IN_USE` while booking history references the combo. */
export async function deleteComboAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/admin/combos/${id}`, token);
}

export async function createFoodItemAction(
  token: string,
  input: AdminFoodItemInput & { name: string; category: string; price: number },
): Promise<AdminActionResult<AdminFoodItem>> {
  return mutateAdmin<AdminFoodItem>("POST", "/admin/food-items", token, input);
}

export async function updateFoodItemAction(
  token: string,
  id: string,
  input: AdminFoodItemInput,
): Promise<AdminActionResult<AdminFoodItem>> {
  return mutateAdmin<AdminFoodItem>("PATCH", `/admin/food-items/${id}`, token, input);
}

export async function deleteFoodItemAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/admin/food-items/${id}`, token);
}
