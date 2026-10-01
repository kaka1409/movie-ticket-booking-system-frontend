import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getRequestCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader === "" ? undefined : cookieHeader;
}

export async function requireAuth(returnUrl?: string): Promise<void> {
  const cookieStore = await cookies();
  if (cookieStore.get("refreshToken")) return;

  const query = returnUrl
    ? `?returnUrl=${encodeURIComponent(returnUrl)}`
    : "";
  redirect(`/login${query}`);
}
