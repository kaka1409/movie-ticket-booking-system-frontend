import type { User } from "./types";
// import { apiFetch } from "@/libs/api";
import { USER } from "./mock";

export async function getUser(): Promise<User> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<User>("/api/v1/user");
  return USER;
}
