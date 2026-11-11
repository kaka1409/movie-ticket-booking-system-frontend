"use client";

import type { Socket } from "socket.io-client";
import { publicEnv } from "@/libs/env/public";

/**
 * Backend origin for the Socket.IO handshake. In dev the browser talks to the
 * Next rewrite for REST, but rewrites do not upgrade WebSockets, so the socket
 * connects to the backend directly (allowed by its `CORS_ORIGINS` allowlist).
 *
 * - `NEXT_PUBLIC_BACKEND_URL` set: dial exactly that origin.
 * - unset in development: dial the page's own hostname on :8080, which keeps
 *   LAN/IP testing working without an env change (`localhost` would point at
 *   the visitor's own device instead).
 * - unset in production: no guess — realtime is off and REST (same-origin
 *   rewrite) keeps working.
 */
function resolveSocketUrl(): string | null {
  if (publicEnv.backendUrl) return publicEnv.backendUrl;
  if (publicEnv.isProduction) return null;
  if (typeof window === "undefined") return "http://localhost:8080";
  return `http://${window.location.hostname}:8080`;
}

/**
 * Open an authenticated push socket: the access token travels in the handshake
 * `auth` payload (api-contract §11), and the gateway drops the connection when
 * it is missing or invalid. `socket.io-client` is imported on demand so
 * anonymous visitors never download it — the provider mounts on every page.
 *
 * Resolves `null` when this deployment has no browser-reachable backend origin
 * (production without `NEXT_PUBLIC_BACKEND_URL`); the caller then skips the
 * socket and keeps the REST inbox.
 */
export async function createNotificationSocket(token: string): Promise<Socket | null> {
  const socketUrl = resolveSocketUrl();
  if (!socketUrl) return null;

  const { io } = await import("socket.io-client");
  return io(socketUrl, {
    path: "/socket.io",
    auth: { token },
    withCredentials: true,
  });
}
