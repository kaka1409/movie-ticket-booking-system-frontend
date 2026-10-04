import type { Notification } from "./types";
import { INITIAL_NOTIFS } from "./mock";

// TODO(api): replace mock data with a real fetch when the backend is ready.
/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- cookie is reserved for the real API call (currently mocked) */
export async function getNotifications(cookie?: string): Promise<Notification[]> {
  return INITIAL_NOTIFS;
}
