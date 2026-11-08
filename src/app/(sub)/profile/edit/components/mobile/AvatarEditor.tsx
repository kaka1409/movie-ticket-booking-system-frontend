"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_AVATAR_SRC } from "@/components/ui/Avatar";
import { useAvatarUpload } from "@/features/profile/hooks/useAvatarUpload";

export default function AvatarEditor() {
  const { translate } = useLocale();
  const { user } = useAuth();
  const { upload, remove, isPending } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      <input
        ref={fileInputRef}
        type="file"
        name="avatar"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={isPending}
        onClick={() => fileInputRef.current?.click()}
        aria-label={translate("profile.edit.change_photo")}
        className="relative -mt-5 ml-20 flex h-10 w-10 items-center justify-center rounded-full bg-(--color-gold) shadow-(--shadow-card) z-10 disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin text-black" />
        ) : (
          <Camera className="h-5 w-5 text-black" strokeWidth={2.2} />
        )}
      </button>

      {user.avatarUrl && (
        <button
          type="button"
          disabled={isPending}
          onClick={remove}
          className="mt-3 text-xs font-semibold text-(--color-text-muted) underline disabled:opacity-60"
        >
          {translate("profile.edit.remove_photo")}
        </button>
      )}

      <p className="mt-4 text-xl font-bold text-(--color-text-primary)">{user.name}</p>
    </div>
  );
}
