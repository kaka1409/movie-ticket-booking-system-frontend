"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { formatVND } from "@/libs/utils";
import { useLocale } from "@/contexts/LocaleContext";

interface SelectionInfo {
  label?: string;
  subLabel?: string;
  secondaryLabel?: string;
  secondaryLabelKey?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

interface TotalInfo {
  label?: string;
  amount?: number;
  showEmptyState?: boolean;
  useEmptyState?: boolean;
}

interface BookingBottomBarProps {
  selectionInfo?: SelectionInfo;
  totalInfo?: TotalInfo;
  canProceed: boolean;
  ctaText: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  isLoading?: boolean;
  promptText?: string;
  alwaysEnabled?: boolean;
}

export default function BookingBottomBar({
  selectionInfo,
  totalInfo,
  canProceed,
  ctaText,
  ctaHref,
  onCtaClick,
  isLoading = false,
  promptText,
  alwaysEnabled = false,
}: BookingBottomBarProps) {
  const { translate } = useLocale();
  const hasSelection = selectionInfo?.label || selectionInfo?.subLabel;
  const hasTotal = totalInfo?.amount !== undefined;

  const renderButton = () => {
    const buttonContent = (
      <>
        {isLoading ? ctaText : ctaText}
        {!isLoading && <ArrowRight size={17} />}
      </>
    );

    const activeClasses =
      "flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)]";

    const disabledClasses =
      "flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase bg-(--color-surface) text-(--color-text-muted) border border-(--color-border) cursor-not-allowed";

    const effectivelyEnabled = alwaysEnabled || canProceed;

    if (onCtaClick) {
      return (
        <button
          type="button"
          onClick={onCtaClick}
          disabled={!effectivelyEnabled || isLoading}
          className={effectivelyEnabled ? activeClasses : disabledClasses}
        >
          {buttonContent}
        </button>
      );
    }

    if (ctaHref) {
      return (
        <Link
          href={effectivelyEnabled ? ctaHref : "#"}
          aria-disabled={!effectivelyEnabled}
          onClick={(event) => {
            if (!effectivelyEnabled) {
              event.preventDefault();
            }
          }}
          className={effectivelyEnabled ? activeClasses : disabledClasses}
        >
          {buttonContent}
        </Link>
      );
    }

    return null;
  };

  return (
    <div className="sticky bottom-0 z-50 px-4 pb-6 pt-3 bg-(--color-bg) border-t border-(--color-border)">
      {/* Selection Info */}
      {selectionInfo && (
        <div className="flex items-center justify-between mb-3 px-1">
          {hasSelection ? (
            <>
              <div>
                {selectionInfo.label && (
                  <p className="font-bold text-sm text-(--color-text-primary)">
                    {selectionInfo.label}
                  </p>
                )}
                {selectionInfo.subLabel && (
                  <p className="text-xs text-(--color-text-muted)">{selectionInfo.subLabel}</p>
                )}
              </div>
              {selectionInfo.secondaryLabel && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[9px] font-bold tracking-widest uppercase text-(--color-text-muted)">
                      {selectionInfo.secondaryLabelKey || "Showtime"}
                    </p>
                    <p className="font-extrabold text-base text-(--color-gold)">
                      {selectionInfo.secondaryLabel}
                    </p>
                  </div>
                  {selectionInfo.showClearButton && selectionInfo.onClear && (
                    <button
                      type="button"
                      onClick={selectionInfo.onClear}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-(--color-surface-2) text-(--color-text-muted)"
                      aria-label={translate("common.clear_selection")}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-(--color-text-muted)">
              {promptText || selectionInfo.subLabel || "Please make a selection"}
            </p>
          )}
        </div>
      )}

      {/* Total Info */}
      {totalInfo && (
        <div className="flex items-end justify-between mb-3 min-h-[40px]">
          {totalInfo.label && (
            <p className="text-[9px] font-bold tracking-widest uppercase text-(--color-text-muted)">
              {totalInfo.label}
            </p>
          )}
          <p
            className={`font-extrabold text-xl tabular-nums ${
              hasTotal ? "text-(--color-gold)" : "text-(--color-text-muted)"
            }`}
          >
            {totalInfo.amount !== undefined ? formatVND(totalInfo.amount) : "—"}
          </p>
        </div>
      )}

      {/* CTA Button */}
      {renderButton()}
    </div>
  );
}
