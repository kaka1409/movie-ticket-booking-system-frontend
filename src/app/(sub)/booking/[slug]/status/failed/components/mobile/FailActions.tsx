"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { RefreshCw, Home, ChevronRight, HeadphonesIcon } from "lucide-react";
import { useStatus } from "../../../components/mobile/StatusContext";

export default function FailActions() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { mounted } = useStatus();

  return (
    <>
      <div
        className={`px-4 space-y-3 transition-all duration-700 delay-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={() => router.push(`/booking/${slug}/payment`)}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-wide bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)] hover:opacity-90 active:scale-[0.98] transition-all duration-150"
        >
          <RefreshCw size={17} />
          Retry Payment
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm text-(--color-text-secondary) bg-(--color-surface) border border-(--color-border) hover:border-(--color-gold)/30 hover:text-(--color-gold) active:scale-[0.98] transition-all duration-150"
        >
          <Home size={17} />
          Back to Home
        </button>
      </div>

      {/* Help link */}
      <div
        className={`px-4 pb-4 transition-all duration-700 delay-[600ms] ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <Link
          href="/help"
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-(--color-surface) border border-(--color-border) hover:border-(--color-gold)/20 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-(--color-surface-2) flex items-center justify-center text-(--color-text-muted) group-hover:text-(--color-gold) transition-colors">
              <HeadphonesIcon size={15} />
            </div>
            <div>
              <p className="text-sm font-semibold text-(--color-text-secondary) group-hover:text-(--color-gold) transition-colors">
                Need help?
              </p>
              <p className="text-xs text-(--color-text-muted)">
                Contact our support team
              </p>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-(--color-text-muted) group-hover:text-(--color-gold) transition-colors"
          />
        </Link>
      </div>
    </>
  );
}
