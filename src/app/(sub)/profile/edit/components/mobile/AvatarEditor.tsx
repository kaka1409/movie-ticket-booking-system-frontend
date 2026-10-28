"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_AVATAR_SRC } from "@/components/ui/Avatar";

/**
 * Avatar editor. Photo upload is not wired to a backend yet, so the control is
 * honestly disabled instead of previewing a file that would be silently dropped
 * on save.
 */
export default function AvatarEditor() {
  const { translate } = useLocale();
  const { user } = useAuth();

  if (!user) return null;

  const src = user.avatarUrl || DEFAULT_AVATAR_SRC;

  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative h-36 w-36">
        <div
          className="absolute inset-0 rounded-full p-[4px]"
          style={{
            background:
              "conic-gradient(from 180deg, #FFCC4D 0%, #B8860B 25%, #FFCC4D 50%, #B8860B 75%, #FFCC4D 100%)",
          }}
        >
          <div className="h-full w-full rounded-full bg-(--color-bg)" />
        </div>

        <div className="absolute inset-[4px] rounded-full overflow-hidden bg-(--color-surface-2)">
          <Image
            src={src}
            alt={user.name || ""}
            fill
            sizes="128px"
            className="object-cover"
            loading="eager"
          />
        </div>
      </div>

      <button
        type="button"
        disabled
        aria-label={translate("profile.edit.change_photo")}
        className="relative -mt-5 ml-20 flex h-10 w-10 items-center justify-center rounded-full bg-(--color-gold) shadow-(--shadow-card) z-10 opacity-40 cursor-not-allowed"
      >
        <Camera className="h-5 w-5 text-black" strokeWidth={2.2} />
      </button>

      <p className="mt-4 text-xl font-bold text-(--color-text-primary)">{user.name}</p>
      <p className="mt-1 text-sm text-(--color-text-secondary)">
        {translate("profile.edit.photo_unavailable")}
      </p>
    </div>
  );
}
