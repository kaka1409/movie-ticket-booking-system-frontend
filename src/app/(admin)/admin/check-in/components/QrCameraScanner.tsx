"use client";

import { useEffect, useRef, useState } from "react";
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
 * scanner and forwards the first payload it reads.
 */
export default function QrCameraScanner({ onScan, disabled }: QrCameraScannerProps) {
  const { translate } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = () => {
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setIsActive(false);
  };

  const start = async () => {
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
  };

  // The stream must die with the component — leaving /admin/check-in mid-scan
  // would keep the camera LED on.
  useEffect(() => () => scannerRef.current?.destroy(), []);

  return (
    <div>
      {/* Mounted while hidden so `videoRef` exists before the first start(). */}
      <div className={isActive ? "block" : "hidden"}>
        <div className="relative overflow-hidden rounded-xl border border-(--color-border)">
          <video
            ref={videoRef}
            className="aspect-video w-full bg-black object-cover"
            muted
            playsInline
          />
          {isActive && (
            <div className="pointer-events-none absolute inset-6 rounded-lg border-2 border-(--color-gold)/70" />
          )}
        </div>
        <p className="mt-2 text-center text-2xs text-(--color-text-muted)">
          {translate("admin.checkin.camera_hint")}
        </p>
      </div>

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
