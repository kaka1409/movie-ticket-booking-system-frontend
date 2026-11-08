"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { ScanLine, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFormField from "@/app/(admin)/admin/components/shared/AdminFormField";
import { ADMIN_INPUT_CLASS, ADMIN_CARD_CLASS } from "@/features/admin/constants";
import { resolveAdminError } from "@/features/admin/utils/errorMessages";
import { getRoomDisplayName } from "@/libs/utils";
import { checkInTicketAction } from "@/features/admin/actions/tickets.action";
import type { AdminCheckinResult } from "@/features/admin/types";

// `qr-scanner` is heavy and only needed once an admin opens the camera — keep
// it out of the check-in chunk; the payload field works without it.
const QrCameraScanner = dynamic(() => import("./QrCameraScanner"), { ssr: false });

export default function CheckinScanner() {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const [payload, setPayload] = useState("");
  const [result, setResult] = useState<AdminCheckinResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (value?: string) => {
    if (!token) {
      setError(translate("admin.common.session_expired"));
      return;
    }
    const raw = (value ?? payload).trim();
    if (!raw) {
      setError(translate("admin.checkin.invalid"));
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      const res = await checkInTicketAction(token, raw);
      if (!res.success) {
        const message = resolveAdminError(res, translate, {
          NOT_FOUND: "admin.checkin.not_found",
        });
        setError(message);
        notify(message, { variant: "error" });
        return;
      }
      setResult(res.data);
      notify(translate("admin.checkin.success"), { variant: "success" });
      setPayload("");
    });
  };

  const handleScan = (scanned: string) => {
    setPayload(scanned);
    submit(scanned);
  };

  return (
    <div className="space-y-4">
    <QrCameraScanner onScan={handleScan} disabled={isPending} />
    <div className={ADMIN_CARD_CLASS + " p-5"}>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <AdminFormField labelKey="admin.checkin.payload" hintKey="admin.checkin.payload_hint">
          <input
            type="text"
            name="payload"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className={ADMIN_INPUT_CLASS}
            autoFocus
          />
        </AdminFormField>
        <div className="flex items-end">
          <AdminButton
            icon={ScanLine}
            variant="primary"
            size="md"
            disabled={isPending}
            onClick={() => submit()}
          >
            {translate("admin.checkin.submit")}
          </AdminButton>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-xl border border-(--color-border) bg-(--color-surface-2) p-4">
          <div className="mb-2 flex items-center gap-2 text-(--color-gold)">
            <CheckCircle2 size={16} />
            <span className="font-bold">{translate("admin.checkin.success")}</span>
          </div>
          <dl className="grid gap-1 text-[12px]">
            <div className="flex justify-between gap-2">
              <dt className="text-(--color-text-muted)">Ticket</dt>
              <dd className="font-mono">{result.ticketId}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-(--color-text-muted)">Owner</dt>
              <dd>{result.ownerName}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-(--color-text-muted)">Movie</dt>
              <dd>{result.movieTitle}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-(--color-text-muted)">Cinema</dt>
              <dd>
                {result.cinemaName} ·{" "}
                {getRoomDisplayName({ name: result.roomName, nameVi: result.roomNameVi }, locale)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-(--color-text-muted)">Format</dt>
              <dd>{result.format}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-(--color-text-muted)">Time</dt>
              <dd>
                {result.date} {result.startTime}–{result.endTime}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-(--color-text-muted)">Seats</dt>
              <dd>{result.seatLabels.join(", ")}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-(--color-text-muted)">Used at</dt>
              <dd>{new Date(result.usedAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
    </div>
  );
}
