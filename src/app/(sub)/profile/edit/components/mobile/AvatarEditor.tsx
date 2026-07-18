"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { User } from "@/features/profile/types";

export default function AvatarEditor({
  user,
  onAvatarChange,
}: {
  user: User;
  onAvatarChange?: (changed: boolean) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { translate } = useLocale();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onAvatarChange?.(true);
    }
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative h-36 w-36">
        {/* Gradient ring */}
        <div
          className="absolute inset-0 rounded-full p-[4px]"
          style={{
            background:
              "conic-gradient(from 180deg, #FFCC4D 0%, #B8860B 25%, #FFCC4D 50%, #B8860B 75%, #FFCC4D 100%)",
          }}
        >
          <div className="h-full w-full rounded-full bg-(--color-bg)" />
        </div>

        {/* Avatar image */}
        <div className="absolute inset-[4px] rounded-full overflow-hidden bg-(--color-surface-2)">
          <Image
            src={preview || user?.avatarUrl || "/images/default-avatar.jpg"}
            alt={user?.name || ""}
            fill
            sizes="128px"
            className="object-cover"
            loading="eager"
          />
        </div>
      </div>

      {/* Camera button */}
      <button
        type="button"
        aria-label={translate("profile.edit.change_photo")}
        onClick={() => fileInputRef.current?.click()}
        className="relative -mt-5 ml-20 flex h-10 w-10 items-center justify-center rounded-full bg-(--color-gold) shadow-[--shadow-card] z-10"
      >
        <Camera className="h-5 w-5 text-black" strokeWidth={2.2} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="mt-4 text-xl font-bold text-(--color-text-primary)">
        {user?.name}
      </p>
      <p className="text-sm text-(--color-text-secondary)">{user?.tier}</p>
    </div>
  );
}
