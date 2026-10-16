"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Logo from "@/layouts/components/Logo";
import { getSubTitle, getBackHref } from "../utils";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { translate } = useLocale();
  const title = getSubTitle(pathname, translate);
  const backHref = getBackHref(pathname);

  const handleBack = () => {
    if (backHref) {
      router.replace(backHref);
    } else {
      router.back();
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-(--color-border) bg-black/92 backdrop-blur-md">
      <div className="mx-auto flex h-15 max-w-7xl items-center gap-4 px-4 lg:gap-8 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="flex shrink-0 items-center gap-2 no-underline"
        >
          <ArrowLeft size={20} className="text-(--color-gold)" />
          <Logo size="lg" href="" />
        </button>

        {title && (
          <h1 className="min-w-0 flex-1 truncate text-lg font-bold text-(--color-gold-light)">
            {title}
          </h1>
        )}
      </div>
    </nav>
  );
}
