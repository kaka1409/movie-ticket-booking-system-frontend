"use client";

import { LogOut, Star, Heart, UserCog, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { logoutAction } from "@/features/auth/action";
import MenuSection from "./MenuSection";
import Button from "@/components/ui/Button";

export default function ProfileMenu() {
  const { translate } = useLocale();
  const { clearAuth } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    clearAuth();
    await logoutAction();
    router.push("/");
  };

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
        <Button icon={LogOut} onClick={handleLogout}>
          {translate("profile.logout")}
        </Button>
      </div>
    </div>
  );
}
