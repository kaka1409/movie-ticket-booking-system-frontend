"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { LogOut, Star, Heart, UserCog, LockKeyhole } from "lucide-react";

// Desktop components
import DesktopProfileContent from "./components/desktop/ProfileContent";

// Mobile components
import Avatar from "./components/mobile/Avatar";
import UserInfo from "./components/mobile/UserInfo";
import MenuSection from "./components/mobile/MenuSection";

export default function ProfilePage() {
  const { translate } = useLocale();

  const activityItems = [
    { label: translate("profile.review_rating"), Icon: Star, href: "/profile/reviews" },
    { label: translate("profile.wishlist"), Icon: Heart, href: "/profile/wishlist" },
  ];

  const accountItems = [
    { label: translate("profile.edit_profile"), Icon: UserCog, href: "/profile/edit" },
    {
      label: translate("profile.change_password"),
      Icon: LockKeyhole,
      href: "/profile/password",
    },
  ];

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col items-center pt-10 pb-8">
          <Avatar />
          <UserInfo />

          <div className="mt-8 w-full space-y-6">
            <MenuSection label={translate("profile.activity")} items={activityItems} />
            <MenuSection label={translate("profile.account")} items={accountItems} />

            {/* Logout */}
            <div className="px-4">
              <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-[#0F0F0F] shadow-(--shadow-glow)">
                <LogOut size={17} />
                {translate("profile.logout")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopProfileContent />
      </div>
    </>
  );
}
