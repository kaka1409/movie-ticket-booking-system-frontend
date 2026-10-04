"use client";

import RouteError from "@/components/errors/RouteError";

export default function BlankGroupError(props: { error: Error; reset: () => void }) {
  return <RouteError {...props} />;
}
