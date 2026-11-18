"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Ticket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Reveal from "@/components/ui/Reveal";

export default function SuccessActions() {
  const params = useParams();
  const id = params.id as string;
  const { translate } = useLocale();

  return (
    <Reveal delay={500} className="px-4 space-y-3 pb-4">
      <Link
        href={`/tickets/${id}`}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase bg-(--color-gold) text-(--color-bg) shadow-(--shadow-glow) active:scale-[0.98] transition duration-150"
      >
        <Ticket size={17} />
        {translate("tickets.modify.success.view_ticket")}
      </Link>
    </Reveal>
  );
}
