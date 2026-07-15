export const FILTERS = [
  { key: "recent", label: "Recent" },
  { key: "highest", label: "Highest Rated" },
  { key: "lowest", label: "Lowest Rated" },
] as const;

export type { FilterKey } from "./types";
