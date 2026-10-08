// Segment config must be exported from the route's own module — a default-only
// re-export does not inherit it. Keeps `/` on the same ISR policy as `/home`.
export const revalidate = 60;

export { default } from "./home/page";
