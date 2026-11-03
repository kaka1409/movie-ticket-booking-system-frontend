import type { Coordinates } from "@/libs/geo";

export type LocationStatus = "idle" | "locating" | "ready" | "unavailable" | "denied";

export interface UserLocationSnapshot {
  coordinates: Coordinates | null;
  status: LocationStatus;
}

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10_000,
  maximumAge: 300_000,
};

const INITIAL_SNAPSHOT: UserLocationSnapshot = { coordinates: null, status: "idle" };

let snapshot = INITIAL_SNAPSHOT;
let pendingRequest: Promise<void> | null = null;
const listeners = new Set<() => void>();

function publish(next: UserLocationSnapshot): void {
  snapshot = next;
  for (const listener of listeners) listener();
}

/** Current answer, read by `useSyncExternalStore` (same reference while unchanged). */
export function getUserLocationSnapshot(): UserLocationSnapshot {
  return snapshot;
}

export function subscribeUserLocation(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Ask the browser for the user's position, once per page session. Both device
 * trees render the cinema cards at the same time, so the request is shared: one
 * prompt, one answer, and every card repaints from the same snapshot.
 */
export function locateUser(): void {
  if (pendingRequest) return;
  pendingRequest = readPosition();
}

/**
 * Drop the cached answer and ask again — the "Try again" action after a timeout
 * or a dismissed prompt. A permanently denied permission still resolves to
 * `denied`; only the browser settings can undo that.
 */
export function retryUserLocation(): void {
  pendingRequest = null;
  publish({ coordinates: null, status: "locating" });
  locateUser();
}

async function readPosition(): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    publish({ coordinates: null, status: "unavailable" });
    return;
  }

  // Denied never prompts again: calling the API would only spend a round trip
  // and hide the reason behind the generic "unavailable" copy.
  if ((await readPermissionState()) === "denied") {
    publish({ coordinates: null, status: "denied" });
    return;
  }

  publish({ coordinates: null, status: "locating" });

  await new Promise<void>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        publish({
          coordinates: { latitude: coords.latitude, longitude: coords.longitude },
          status: "ready",
        });
        resolve();
      },
      () => {
        publish({ coordinates: null, status: "unavailable" });
        resolve();
      },
      GEOLOCATION_OPTIONS,
    );
  });
}

async function readPermissionState(): Promise<PermissionState | "unknown"> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) return "unknown";

  try {
    const { state } = await navigator.permissions.query({ name: "geolocation" });
    return state;
  } catch {
    return "unknown";
  }
}
