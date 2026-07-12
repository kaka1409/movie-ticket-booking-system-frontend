"use client";

import { ShieldCheck } from "lucide-react";

export default function SecureBadge() {
  return (
    <div className="flex items-center justify-center gap-1.5 px-4">
      <ShieldCheck size={13} className="text-(--color-text-muted)" />
      <span className="text-xs text-(--color-text-muted)">
        256-bit SSL encrypted • PCI DSS compliant
      </span>
    </div>
  );
}
