"use client";

import RouteError from "@/components/shared/RouteError";

export default function MainGroupError(props: { error: Error; reset: () => void }) {
  return <RouteError {...props} />;
}
