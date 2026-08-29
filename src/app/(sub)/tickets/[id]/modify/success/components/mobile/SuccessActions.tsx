"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function SuccessActions() {
  const params = useParams();
  const id = params.id as string;
  const { translate } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`px-4 space-y-3 pb-4 transition-all duration-700 delay-500 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <Link
        href={`/tickets/${id}`}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)] active:scale-[0.98] transition-all duration-150"
      >
        <Ticket size={17} />
        {translate("tickets.modify.success.view_ticket")}
      </Link>
    </div>
  );
}
