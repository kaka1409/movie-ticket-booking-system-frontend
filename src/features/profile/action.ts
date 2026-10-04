"use server";

import type { UpdateProfileRequest, User } from "./types";
import { apiMutation } from "@/libs/api";

export type ProfileActionResult =
  { success: true; data: User } | { success: false; error: string; status?: number };

export async function updateProfile(
  prevState: ProfileActionResult,
  data: UpdateProfileRequest & { token: string },
): Promise<ProfileActionResult> {
  try {
    const { token, ...body } = data;
    const response = await apiMutation<{ data: User }>(
      "/user",
      { method: "PATCH", body: JSON.stringify(body) },
      token,
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const status = (error as { status?: number }).status;
    return { success: false, error: (error as Error).message, status };
  }
}
