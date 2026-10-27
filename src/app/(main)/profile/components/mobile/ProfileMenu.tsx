"use client";

import { LogOut, Star, Heart, UserCog, LockKeyhole, ShieldCheck } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import MenuSection from "./MenuSection";
import Button from "@/components/ui/Button";

export default function ProfileMenu() {
  const { translate } = useLocale();
  const { user } = useAuth();
  const { logout, isLoggingOut } = useLogout();

  return (
    <div className="mt-8 w-full space-y-6">
      {user?.role === "ADMIN" && (
        <MenuSection
          labelKey="admin.nav.overview"
          items={[{ labelKey: "admin.nav.dashboard", Icon: ShieldCheck, href: "/admin" }]}
        />
      )}
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
        <Button icon={LogOut} onClick={logout} loading={isLoggingOut}>
          {translate("profile.logout")}
        </Button>
      </div>
    </div>
  );
}
