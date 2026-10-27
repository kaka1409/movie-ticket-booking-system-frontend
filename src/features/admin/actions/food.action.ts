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
  return mutateAdmin<AdminCombo>("POST", "/combos", token, input);
}

export async function updateComboAction(
  token: string,
  id: string,
  input: AdminComboInput,
): Promise<AdminActionResult<AdminCombo>> {
  return mutateAdmin<AdminCombo>("PATCH", `/combos/${id}`, token, input);
}

/** Answers `409 IN_USE` while booking history references the combo. */
export async function deleteComboAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/combos/${id}`, token);
}

export async function createFoodItemAction(
  token: string,
  input: AdminFoodItemInput & { name: string; category: string; price: number },
): Promise<AdminActionResult<AdminFoodItem>> {
  return mutateAdmin<AdminFoodItem>("POST", "/food-items", token, input);
}

export async function updateFoodItemAction(
  token: string,
  id: string,
  input: AdminFoodItemInput,
): Promise<AdminActionResult<AdminFoodItem>> {
  return mutateAdmin<AdminFoodItem>("PATCH", `/food-items/${id}`, token, input);
}

export async function deleteFoodItemAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/food-items/${id}`, token);
}
