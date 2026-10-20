import DesktopShell from "@/layouts/components/DesktopShell";

/**
 * Desktop sub chrome. Unlike the mobile skin, desktop sub pages carry no back +
 * title strip: the shared main header already orients the visitor, and every sub
 * page owns its own context (the booking flow renders its own `StepRail`).
 *
 * The page band (container + vertical padding) is owned by each page — the
 * account pages and the booking steps want different widths (`max-w-6xl` for
 * the status pages, `max-w-7xl` elsewhere), so the shell only provides chrome.
 */
export default function DesktopSubLayout({ children }: { children: React.ReactNode }) {
  return <DesktopShell>{children}</DesktopShell>;
}
