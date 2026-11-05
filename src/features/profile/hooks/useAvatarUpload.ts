"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useLocale } from "@/contexts/LocaleContext";
import { uploadAvatarAction, removeAvatarAction } from "@/features/profile/action";
import { toAvatarBlob } from "@/features/profile/utils/avatar";

export function useAvatarUpload() {
  const router = useRouter();
  const { translate } = useLocale();
  const { token, updateUser } = useAuth();
  const { notify } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!token) return;
      setError(null);
      try {
        const blob = await toAvatarBlob(file);
        const uploadFile = new File([blob], "avatar.webp", { type: "image/webp" });
        startTransition(async () => {
          const result = await uploadAvatarAction(token, uploadFile);
          if (result.success) {
            updateUser({ avatarUrl: result.data.avatarUrl });
            notify(translate("profile.edit.avatar_saved"), { variant: "success" });
            router.refresh();
          } else {
            setError(result.error);
            notify(translate("profile.edit.avatar_failed"), { variant: "error" });
          }
        });
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : String(reason));
        notify(translate("profile.edit.avatar_failed"), { variant: "error" });
      }
    },
    [token, updateUser, notify, translate, router],
  );

  const remove = useCallback(() => {
    if (!token) return;
    setError(null);
    startTransition(async () => {
      const result = await removeAvatarAction(token);
      if (result.success) {
        updateUser({ avatarUrl: result.data.avatarUrl });
        notify(translate("profile.edit.avatar_removed"), { variant: "success" });
        router.refresh();
      } else {
        setError(result.error);
        notify(translate("profile.edit.avatar_failed"), { variant: "error" });
      }
    });
  }, [token, updateUser, notify, translate, router]);

  return { upload, remove, isPending, error };
}
