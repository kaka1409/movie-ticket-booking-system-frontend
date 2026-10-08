const MAX_QTY_PER_ITEM = 10;

/**
 * Apply a stepper delta to one item inside a selected-items array: clamps to
 * 0..MAX_QTY_PER_ITEM, drops the entry at 0, otherwise upserts it. Keeps the
 * array's insertion order — no catalog is available at the call sites, and
 * every consumer derives qty by id lookup anyway.
 */
export function withItemQty(
  selected: { id: string; name: string; qty: number; price: number }[],
  item: { id: string; name: string; price: number },
  delta: number,
): { id: string; name: string; qty: number; price: number }[] {
  const currentQty = selected.find((entry) => entry.id === item.id)?.qty ?? 0;
  const nextQty = Math.max(0, Math.min(MAX_QTY_PER_ITEM, currentQty + delta));
  const rest = selected.filter((entry) => entry.id !== item.id);

  if (nextQty === 0) return rest;
  return [...rest, { id: item.id, name: item.name, qty: nextQty, price: item.price }];
}
