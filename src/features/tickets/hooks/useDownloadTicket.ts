"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";

export function useDownloadTicket() {
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadTicket = useCallback(
    async (filename: string = "ticket.png", target?: HTMLElement | null) => {
      const element = target ?? ticketRef.current;
      if (!element) return;

      setIsDownloading(true);
      try {
        const dataUrl = await toPng(element, {
          quality: 0.95,
          cacheBust: true,
          pixelRatio: 2,
        });

        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Failed to download ticket:", error);
      } finally {
        setIsDownloading(false);
      }
    },
    [],
  );

  return { ticketRef, downloadTicket, isDownloading };
}
