import { Ticket } from "lucide-react";

export default function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Ticket size={40} className="text-(--color-border)" />
      <p className="text-sm text-(--color-text-muted)">{label}</p>
    </div>
  );
}
