"use server";

import type { UpdateProfileRequest } from "./types";
import type { User } from "@/features/auth/types";
import { apiMutation, apiUpload, toActionFailure, type ActionFailure } from "@/libs/api";

export type ProfileActionResult = { success: true; data: User } | ActionFailure;

export async function updateProfileAction(
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
    return toActionFailure(error);
  }
}

export async function uploadAvatarAction(
  token: string,
  file: File,
): Promise<ProfileActionResult> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiUpload<{ data: User }>("/user/avatar", formData, token);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}

export async function removeAvatarAction(token: string): Promise<ProfileActionResult> {
  try {
    const response = await apiMutation<{ data: User }>(
      "/user/avatar",
      { method: "DELETE" },
      token,
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}
