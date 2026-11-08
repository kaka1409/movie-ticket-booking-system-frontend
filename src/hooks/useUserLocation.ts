"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  getUserLocationSnapshot,
  locateUser,
  retryUserLocation,
  subscribeUserLocation,
  type Coordinates,
  type LocationStatus,
  type UserLocationSnapshot,
} from "@/libs/geo";

const SERVER_SNAPSHOT: UserLocationSnapshot = { coordinates: null, status: "idle" };

export interface UserLocation {
  userCoordinates: Coordinates | null;
  status: LocationStatus;
  /** Re-asks the browser (used after a timeout or a dismissed prompt). */
  retry: () => void;
}

/**
 * The user's position as one shared answer: the module store holds the single
 * browser read, so the mobile and desktop trees cannot prompt twice or drift
 * apart, and a step change does not re-ask.
 */
export function useUserLocation(): UserLocation {
  const snapshot = useSyncExternalStore(
    subscribeUserLocation,
    getUserLocationSnapshot,
    () => SERVER_SNAPSHOT,
  );

  useEffect(() => {
    locateUser();
  }, []);

  const retry = useCallback(() => retryUserLocation(), []);

  return { userCoordinates: snapshot.coordinates, status: snapshot.status, retry };
}
