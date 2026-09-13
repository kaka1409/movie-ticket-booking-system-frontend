import type { Notification } from "./types";
// import { apiFetch } from "@/libs/api";
import { INITIAL_NOTIFS } from "./mock";

export async function getNotifications(): Promise<Notification[]> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<Notification[]>("/notifications");
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(INITIAL_NOTIFS);
  //   }, 5000);
  // });

  return INITIAL_NOTIFS;
}
