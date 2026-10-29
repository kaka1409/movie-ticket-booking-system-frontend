"use client";

import { useEffect, useState, useTransition } from "react";
import { Pencil, Trash2, UserRound, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminButton from "@/features/admin/components/AdminButton";
import AdminFormField from "@/features/admin/components/AdminFormField";
import AdminFormModal from "@/features/admin/components/AdminFormModal";
import { ADMIN_FIELD_GRID_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import {
  addMovieCastAction,
  deleteMovieCastAction,
  getMovieCastAction,
  updateMovieCastAction,
} from "@/features/admin/actions/movies.action";
import type { AdminMovie, AdminMovieCastItem } from "@/features/admin/types";

interface CastFormState {
  name: string;
  roleName: string;
  imageUrl: string;
  sortOrder: string;
}

const EMPTY_FORM: CastFormState = { name: "", roleName: "", imageUrl: "", sortOrder: "" };

/**
 * Cast editor. The list endpoint does not ship cast with a movie row, so the
 * entries are read the moment the dialog opens (a request-keyed fetch, the one
 * sanctioned exception to "no client fetching").
 */
export default function MovieCastDialog({
  isOpen,
  movie,
  onClose,
}: {
  isOpen: boolean;
  movie: AdminMovie | null;
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();

  const [castItems, setCastItems] = useState<AdminMovieCastItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [values, setValues] = useState<CastFormState>(EMPTY_FORM);
  const [editingCastId, setEditingCastId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const slug = movie?.slug ?? "";

  const formSignature = `${isOpen}-${slug}`;
  const [syncedFormSignature, setSyncedFormSignature] = useState(formSignature);
  if (formSignature !== syncedFormSignature) {
    setSyncedFormSignature(formSignature);
    setValues(EMPTY_FORM);
    setEditingCastId(null);
    setSubmitError(null);
    setCastItems(null);
    setLoadError(null);
  }

  const isLoadingCast = isOpen && castItems === null && loadError === null;

  const reloadCast = async () => {
    if (!slug || !token) return;

    const result = await getMovieCastAction(token, slug);

    if (!result.success) {
      setLoadError(result.error);
      return;
    }

    setLoadError(null);
    setCastItems(result.data.items);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handle = setTimeout(() => {
      void reloadCast();
    }, 0);

    // `reloadCast` closes over the current slug/token, which are the deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => clearTimeout(handle);
  }, [isOpen, slug, token]);

  const updateField = (field: keyof CastFormState, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmitError(null);
  };

  const handleSubmit = () => {
    if (values.name.trim() === "") {
      setSubmitError(translate("admin.movies.cast_name_required"));
      return;
    }
    if (!token) {
      setSubmitError(translate("admin.common.session_expired"));
      return;
    }

    const payload = {
      name: values.name.trim(),
      ...(values.roleName.trim() === "" ? {} : { roleName: values.roleName.trim() }),
      ...(values.imageUrl.trim() === "" ? {} : { imageUrl: values.imageUrl.trim() }),
      ...(values.sortOrder.trim() === "" ? {} : { sortOrder: Number(values.sortOrder) }),
    };
    const castId = editingCastId;

    startTransition(async () => {
      const result = castId
        ? await updateMovieCastAction(token, slug, castId, payload)
        : await addMovieCastAction(token, slug, payload);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate(castId ? "admin.common.saved" : "admin.common.created"), {
        variant: "success",
      });
      setValues(EMPTY_FORM);
      setEditingCastId(null);
      await reloadCast();
    });
  };

  const handleDelete = (castId: string) => {
    if (!token) return;

    startTransition(async () => {
      const result = await deleteMovieCastAction(token, slug, castId);
      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate("admin.common.deleted"), { variant: "success" });
      if (editingCastId === castId) {
        setEditingCastId(null);
        setValues(EMPTY_FORM);
      }
      await reloadCast();
    });
  };

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      titleKey="admin.movies.cast_title"
      descriptionKey="admin.movies.cast_description"
      submitLabelKey={editingCastId ? "admin.movies.cast_save" : "admin.movies.cast_add"}
      error={submitError ?? loadError}
      isPending={isPending}
      size="lg"
    >
      <ul className="divide-y divide-(--color-border) rounded-xl border border-(--color-border)">
        {(castItems ?? []).length === 0 && (
          <li className="flex items-center gap-2 px-3 py-5 text-[12px] text-(--color-text-muted)">
            <UserRound size={14} aria-hidden />
            {translate(isLoadingCast ? "admin.common.loading" : "admin.movies.cast_empty")}
          </li>
        )}

        {(castItems ?? []).map((castItem) => (
          <li
            key={castItem.castId}
            className={`flex items-center gap-2 px-2.5 py-1.5 ${
              editingCastId === castItem.castId ? "bg-(--color-gold)/10" : ""
            }`}
          >
            <span className="w-6 shrink-0 text-center text-2xs font-bold text-(--color-text-muted) tabular-nums">
              {castItem.sortOrder}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-(--color-text-primary)">
                {castItem.name}
              </p>
              {castItem.roleName && (
                <p className="truncate text-[11px] text-(--color-text-muted)">
                  {castItem.roleName}
                </p>
              )}
            </div>

            <AdminButton
              size="icon"
              variant="ghost"
              icon={Pencil}
              label={translate("admin.common.edit")}
              onClick={() => {
                setEditingCastId(castItem.castId);
                setValues({
                  name: castItem.name,
                  roleName: castItem.roleName ?? "",
                  imageUrl: castItem.imageUrl ?? "",
                  sortOrder: String(castItem.sortOrder),
                });
                setSubmitError(null);
              }}
            />
            <AdminButton
              size="icon"
              variant="ghost"
              icon={Trash2}
              label={translate("admin.common.delete")}
              onClick={() => handleDelete(castItem.castId)}
            />
          </li>
        ))}
      </ul>

      <div className={ADMIN_FIELD_GRID_CLASS}>
        <AdminFormField labelKey="admin.movies.cast_name">
          <input
            type="text"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.movies.cast_role">
          <input
            type="text"
            value={values.roleName}
            onChange={(event) => updateField("roleName", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.movies.cast_image">
          <input
            type="url"
            value={values.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.movies.cast_order">
          <input
            type="number"
            min={0}
            value={values.sortOrder}
            onChange={(event) => updateField("sortOrder", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>
      </div>

      {editingCastId && (
        <AdminButton
          size="sm"
          variant="ghost"
          icon={X}
          onClick={() => {
            setEditingCastId(null);
            setValues(EMPTY_FORM);
            setSubmitError(null);
          }}
        >
          {translate("admin.common.cancel")}
        </AdminButton>
      )}
    </AdminFormModal>
  );
}
