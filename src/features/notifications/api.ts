import type { Notification } from "./types";
// import { apiFetch } from "@/libs/api";
import { INITIAL_NOTIFS } from "./mock";

export async function getNotifications(): Promise<Notification[]> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<Notification[]>("/api/v1/notifications");
  return INITIAL_NOTIFS;
}
