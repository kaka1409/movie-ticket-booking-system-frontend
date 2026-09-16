import type { UpdateProfileRequest, User } from "./types";
import { apiFetch } from "@/libs/api";

export async function updateProfile(
  data: UpdateProfileRequest,
): Promise<User> {
  const response = await apiFetch<{ data: User }>("/user", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.data;
}
