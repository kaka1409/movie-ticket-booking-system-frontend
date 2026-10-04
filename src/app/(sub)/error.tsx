"use client";

import RouteError from "@/components/shared/RouteError";

export default function SubGroupError(props: { error: Error; reset: () => void }) {
  return <RouteError {...props} />;
}
