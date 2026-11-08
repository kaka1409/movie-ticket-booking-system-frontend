"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Pencil, Search, Trash2, UserRound, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFormField from "@/app/(admin)/admin/components/shared/AdminFormField";
import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import AdminSearchInput from "@/app/(admin)/admin/components/shared/AdminSearchInput";
import { ADMIN_FIELD_GRID_CLASS, ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import {
  addMovieCastAction,
  deleteMovieCastAction,
  getMovieCastAction,
  updateMovieCastAction,
} from "@/features/admin/actions/movies.action";
import { getCastMembersAction } from "@/features/admin/actions/cast.action";
import type { AdminCastMember, AdminMovie, AdminMovieCastItem } from "@/features/admin/types";
import { ADMIN_FORM_SAMPLES } from "@/features/admin/samples";

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

  // Cast member catalog state
  const [castMembers, setCastMembers] = useState<AdminCastMember[]>([]);
  const [castSearch, setCastSearch] = useState("");
  const [isLoadingCastMembers, setIsLoadingCastMembers] = useState(false);

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
    setCastMembers([]);
    setCastSearch("");
  }

  const isLoadingCast = isOpen && castItems === null && loadError === null;

  const reloadCast = useCallback(async () => {
    if (!slug || !token) return;

    const result = await getMovieCastAction(token, slug);

    if (!result.success) {
      setLoadError(result.error);
      return;
    }

    setLoadError(null);
    setCastItems(result.data.items);
  }, [slug, token]);

  const reloadCastMembers = useCallback(async (search: string) => {
    if (!token) return;
    setIsLoadingCastMembers(true);
    const result = await getCastMembersAction(token, search || undefined);
    setIsLoadingCastMembers(false);

    if (!result.success) {
      setCastMembers([]);
      return;
    }

    setCastMembers(result.data);
  }, [token]);

  useEffect(() => {
    if (!isOpen) return;

    const handle = setTimeout(() => {
      void reloadCast();
      void reloadCastMembers("");
    }, 0);

    return () => clearTimeout(handle);
  }, [isOpen, reloadCast, reloadCastMembers]);

  useEffect(() => {
    if (!isOpen) return;

    const handle = setTimeout(() => {
      void reloadCastMembers(castSearch);
    }, 300);

    return () => clearTimeout(handle);
  }, [isOpen, castSearch, reloadCastMembers]);

  const updateField = (field: keyof CastFormState, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmitError(null);
  };

  /** Prefill a valid test cast entry — only offered while adding, not editing. */
  const fillSample = () => {
    setValues({ ...ADMIN_FORM_SAMPLES.cast });
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
      onFillSample={editingCastId === null ? fillSample : undefined}
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

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <Search size={16} className="text-(--color-text-muted)" aria-hidden />
          <AdminSearchInput
            value={castSearch}
            onChange={setCastSearch}
            className="flex-1"
            placeholderKey="admin.movies.cast_search_placeholder"
          />
        </div>

        {isLoadingCastMembers ? (
          <p className="text-[12px] text-(--color-text-muted)">
            {translate("admin.common.loading")}
          </p>
        ) : castMembers.length === 0 ? (
          <p className="text-[12px] text-(--color-text-muted)">
            {translate("admin.movies.cast_no_members")}
          </p>
        ) : (
          <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
            {castMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  setValues((current) => ({
                    ...current,
                    name: member.name,
                    imageUrl: member.imageUrl ?? "",
                  }));
                  setSubmitError(null);
                }}
                className="flex flex-col items-center gap-1 rounded-lg border border-(--color-border) p-2 text-center transition-colors hover:border-(--color-gold) hover:bg-(--color-gold)/5"
              >
                {member.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external image hosts are outside the next/image allowlist
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-surface-2)">
                    <UserRound size={20} className="text-(--color-text-muted)" aria-hidden />
                  </div>
                )}
                <span className="line-clamp-2 text-[11px] font-medium text-(--color-text-primary)">
                  {member.name}
                </span>
                {member.movieCount > 0 && (
                  <span className="text-[10px] text-(--color-text-muted)">
                    {member.movieCount} {translate("admin.movies.cast_movies_count")}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={ADMIN_FIELD_GRID_CLASS}>
        <AdminFormField labelKey="admin.movies.cast_name">
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.movies.cast_role">
          <input
            type="text"
            name="roleName"
            value={values.roleName}
            onChange={(event) => updateField("roleName", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.movies.cast_image">
          <input
            type="url"
            name="imageUrl"
            value={values.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            className={ADMIN_INPUT_CLASS}
          />
        </AdminFormField>

        <AdminFormField labelKey="admin.movies.cast_order">
          <input
            type="number"
            name="sortOrder"
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
