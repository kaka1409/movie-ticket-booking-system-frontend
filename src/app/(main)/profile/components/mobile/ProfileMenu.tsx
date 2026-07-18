"use client";

import { LogOut, Star, Heart, UserCog, LockKeyhole } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import MenuSection from "./MenuSection";

export default function ProfileMenu() {
  const { translate } = useLocale();

  return (
    <div className="mt-8 w-full space-y-6">
      <MenuSection
        labelKey="profile.activity"
        items={[
          { labelKey: "profile.review_rating", Icon: Star, href: "/profile/reviews" },
          { labelKey: "profile.wishlist_label", Icon: Heart, href: "/profile/wishlist" },
        ]}
      />
      <MenuSection
        labelKey="profile.account"
        items={[
          { labelKey: "profile.edit_profile", Icon: UserCog, href: "/profile/edit" },
          { labelKey: "profile.change_password", Icon: LockKeyhole, href: "/profile/password" },
        ]}
      />

      <div className="px-4">
        <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-[#0F0F0F] shadow-(--shadow-glow)">
          <LogOut size={17} />
          {translate("profile.logout")}
        </button>
      </div>
    </div>
  );
}
