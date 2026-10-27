import type { Metadata } from "next";
import LoginPrompt from "@/components/shared/LoginPrompt";
import AdminDataError from "@/features/admin/components/AdminDataError";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { getAdminFoodItems } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import FoodManager from "./components/FoodManager";

export const metadata: Metadata = { title: "Food & beverage" };

export default async function AdminFoodPage() {
  const result = await getAdminFoodItems();

  if (isUnauthorizedResult(result)) return <LoginPrompt />;

  const header = (
    <AdminPageHeader
      eyebrowKey="admin.nav.food"
      titleKey="admin.food.title"
      descriptionKey="admin.food.description"
    />
  );

  if ("error" in result) {
    return (
      <>
        {header}
        <AdminDataError message={result.error.message} />
      </>
    );
  }

  return (
    <>
      {header}
      <FoodManager items={result.data} />
    </>
  );
}
