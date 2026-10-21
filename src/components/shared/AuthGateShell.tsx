/**
 * Chrome shared by `LoginPrompt` and `ProtectedRoute`'s restore skeleton, so
 * nothing shifts when the restore settles. `md:` is the split (not `lg:`) — the
 * device layout renders exactly one instance per request. `.surface-raised`
 * keeps the prompt's `--color-surface` icon tile visible on the card.
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
