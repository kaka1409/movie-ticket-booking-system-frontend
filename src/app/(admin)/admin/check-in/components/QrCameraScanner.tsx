"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";

interface QrCameraScannerProps {
  /** Called once per decoded QR payload; the parent owns submission. */
  onScan: (payload: string) => void;
  disabled?: boolean;
}

/**
 * Rear-camera QR reader for the gate demo: `qr-scanner` owns the
 * `getUserMedia` stream and decode loop, so the component only toggles the
 * scanner and forwards the first payload it reads. The preview frame renders
 * unconditionally — it shows a placeholder until the stream lands.
 */
export default function QrCameraScanner({ onScan, disabled }: QrCameraScannerProps) {
  const { translate } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const autoStartRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setIsActive(false);
  }, []);

  const start = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    setIsStarting(true);
    setError(null);
    try {
      const scanner = new QrScanner(
        video,
        (result) => {
          onScan(result.data);
          scanner.destroy();
          scannerRef.current = null;
          setIsActive(false);
        },
        {
          preferredCamera: "environment",
          highlightScanRegion: true,
          maxScansPerSecond: 10,
        },
      );
      scannerRef.current = scanner;
      await scanner.start();
      setIsActive(true);
    } catch {
      scannerRef.current?.destroy();
      scannerRef.current = null;
      setError(translate("admin.checkin.camera_error"));
    } finally {
      setIsStarting(false);
    }
  }, [onScan, translate]);

  // Auto-open on mount so the operator sees the preview immediately; the
  // retry button re-runs `start` after a failure.
  useEffect(() => {
    if (disabled || autoStartRef.current) return;
    autoStartRef.current = true;
    void start();
  }, [disabled, start]);

  // The stream must die with the component — leaving /admin/check-in mid-scan
  // would keep the camera LED on.
  useEffect(() => () => scannerRef.current?.destroy(), []);

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-(--color-border)">
        <video
          ref={videoRef}
          className="aspect-video w-full bg-black object-cover"
          muted
          playsInline
        />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <p className="flex items-center gap-2 text-xs text-(--color-text-muted)">
              {isStarting ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              {isStarting
                ? translate("admin.checkin.camera_starting")
                : translate("admin.checkin.camera_waiting")}
            </p>
          </div>
        )}
        {isActive && (
          <div className="pointer-events-none absolute inset-6 rounded-lg border-2 border-(--color-gold)/70" />
        )}
      </div>
      <p className="mt-2 text-center text-2xs text-(--color-text-muted)">
        {translate("admin.checkin.camera_hint")}
      </p>

      <div className="mt-3 flex items-center gap-3">
        {isActive ? (
          <AdminButton
            icon={CameraOff}
            variant="outline"
            size="md"
            onClick={stop}
          >
            {translate("admin.checkin.camera_stop")}
          </AdminButton>
        ) : (
          <AdminButton
            icon={isStarting ? Loader2 : Camera}
            variant="primary"
            size="md"
            disabled={disabled || isStarting}
            onClick={start}
          >
            {isStarting
              ? translate("admin.checkin.camera_starting")
              : translate("admin.checkin.camera_open")}
          </AdminButton>
        )}
      </div>

      {error && (
        <p className="mt-2 text-2xs text-red-400">{error}</p>
      )}
    </div>
  );
}
