// import { apiFetch } from "@/libs/api";
import { INITIAL_WISHLIST } from "./mock";

export { INITIAL_WISHLIST };

export async function getInitialWishlist(): Promise<string[]> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<string[]>("/api/v1/wishlist");
  return INITIAL_WISHLIST;
}
