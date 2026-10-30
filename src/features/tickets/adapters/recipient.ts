import { DEFAULT_AVATAR } from "../constants";
import type { Recipient, SearchRecipientWire } from "../types";

/** Wire row → the transfer-search result shape. */
export function toRecipient(row: SearchRecipientWire): Recipient {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatarUrl ?? DEFAULT_AVATAR,
  };
}
