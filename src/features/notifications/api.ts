import type { Notification } from "./types";
// import { apiFetch } from "@/libs/api";
import { INITIAL_NOTIFS } from "./mock";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- cookie is reserved for the real API call (currently mocked) */
export async function getNotifications(cookie?: string): Promise<Notification[]> {
  // TODO: replace with real fetch when backend is ready
  // const response = await apiFetch<Notification[]>("/notifications", undefined, undefined, cookie);
  // if ("error" in response) return [];
  // return response.data;

  return INITIAL_NOTIFS;
}
