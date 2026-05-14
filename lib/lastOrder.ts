// Snapshot of the just-placed order, handed from the Nequi screen to the
// confirmation screen via sessionStorage (the cart itself is cleared on confirm).
// Replaced by a real order record in the backend phase.

import type { GlyphKind } from "./types";

export interface LastOrderItem {
  name: string;
  qty: number;
  lineTotal: number;
  glyph: GlyphKind;
  color: string;
  image?: string | null;
}

export interface LastOrder {
  number: string;
  customerName: string;
  items: LastOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

const KEY = "lds-last-order";

export function saveLastOrder(order: LastOrder): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* sessionStorage unavailable — confirmation will show a generic message */
  }
}

export function readLastOrder(): LastOrder | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LastOrder) : null;
  } catch {
    return null;
  }
}

export function generateOrderNumber(): string {
  return "#" + (1043 + Math.floor(Math.random() * 900));
}
