// Segment config must be exported from the route's own module — a default-only
// re-export does not inherit it. Same 60s fetch cache as `/home`.
export const revalidate = 60;

export { default } from "./home/page";
