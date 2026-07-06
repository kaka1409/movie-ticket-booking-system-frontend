import { Ticket } from "lucide-react";

export default function BookTicketCTA() {
  return (
    <div className="px-4">
      <button className="w-full py-4 rounded-2xl bg-(--color-gold) text-(--color-bg) font-extrabold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-(--color-gold-dark) active:scale-[0.98] transition-all duration-150 shadow-[0_0_24px_rgba(255,204,77,0.3)]">
        {/*<Ticket size={18} className="fill-(--color-bg)" />*/}
        Book Ticket
      </button>
    </div>
  );
}
