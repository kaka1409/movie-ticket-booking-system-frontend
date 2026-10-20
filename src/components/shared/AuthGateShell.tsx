/**
 * Chrome shared by the two auth-gate fallbacks — the `LoginPrompt` and the
 * session-restore skeleton in `ProtectedRoute` — so the visitor sees the same
 * geometry before and after the restore settles.
 *
 * Below `md:` it is the plain mobile stack the prompt has always used; from
 * `md:` up the same content sits in one centred card. `md:` is the device
 * split here rather than a desktop enhancement: the device layout renders
 * this, so exactly one instance exists per request (see AGENTS "Desktop
 * variants"). `max-w-md` is a no-op on mobile — both mobile layouts are
 * already capped at 28rem.
 *
 * The card paints `--color-surface` while the inner wrapper carries
 * `.surface-raised`, so the prompt's own `bg-(--color-surface)` icon tile
 * steps up to `--color-surface-2` instead of vanishing into the card.
 */
export default function AuthGateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-24 md:px-6 md:py-16 lg:px-8">
      <div className="w-full max-w-md md:rounded-2xl md:border md:border-(--color-border) md:bg-(--color-surface) md:p-8 lg:p-10">
        <div className="surface-raised flex w-full flex-col items-center gap-4 md:gap-5">
          {children}
        </div>
      </div>
    </div>
  );
}
