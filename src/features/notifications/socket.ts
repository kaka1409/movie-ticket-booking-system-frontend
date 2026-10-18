"use client";

import { io, type Socket } from "socket.io-client";

/**
 * Backend origin for the Socket.IO handshake. In dev the browser talks to the
 * Next rewrite for REST, but rewrites do not upgrade WebSockets, so the socket
 * connects to the backend directly (allowed by its `CORS_ORIGINS` allowlist).
 * Set `NEXT_PUBLIC_BACKEND_URL` in production if the API is not on the same
 * origin as the site.
 */
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

/**
 * Open an authenticated push socket: the access token travels in the handshake
 * `auth` payload (api-contract §11), and the gateway drops the connection when
 * it is missing or invalid.
 */
export function createNotificationSocket(token: string): Socket {
  return io(SOCKET_URL, {
    path: "/socket.io",
    auth: { token },
    withCredentials: true,
  });
}
