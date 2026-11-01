import type { ReactNode } from "react";

/**
 * Responsive viewport shell for authentication gates.
 * On mobile (< md): No card container, plain vertical flow on canvas.
 * On tablet/desktop (>= md): Houses the max-w-7xl 50/50 split container.
 */
export default function AuthGateShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center px-4 py-16 md:px-6 md:py-16 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
