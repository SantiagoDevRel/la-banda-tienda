"use client";

// Tienda La Banda — client-side cart (context + localStorage).
// Backend-free for now: the storefront flow is fully interactive but state
// lives in the browser. Swaps to server/Supabase orders in the backend phase.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CART_SEED,
  FREE_SHIPPING_MIN,
  SHIPPING_COST,
  getProduct,
} from "./data";
import type { CartLine, Product } from "./types";

const STORAGE_KEY = "lds-cart-v1";

export interface CartItem extends CartLine {
  product: Product;
  lineTotal: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  ready: boolean;
  add: (productId: string, qty?: number, size?: string) => void;
  setQty: (productId: string, qty: number, size?: string) => void;
  remove: (productId: string, size?: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const lineKey = (productId: string, size?: string) =>
  `${productId}::${size ?? ""}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage (fall back to the demo seed on first visit).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setLines(JSON.parse(raw) as CartLine[]);
      } else {
        setLines(CART_SEED);
      }
    } catch {
      setLines(CART_SEED);
    }
    setReady(true);
  }, []);

  // Persist after hydration.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — cart still works in-memory */
    }
  }, [lines, ready]);

  const add = useCallback(
    (productId: string, qty = 1, size?: string) => {
      setLines((prev) => {
        const key = lineKey(productId, size);
        const existing = prev.find((l) => lineKey(l.productId, l.size) === key);
        const product = getProduct(productId);
        const cap = product ? product.stock : Infinity;
        if (existing) {
          return prev.map((l) =>
            lineKey(l.productId, l.size) === key
              ? { ...l, qty: Math.min(cap, l.qty + qty) }
              : l,
          );
        }
        return [...prev, { productId, qty: Math.min(cap, qty), size }];
      });
    },
    [],
  );

  const setQty = useCallback(
    (productId: string, qty: number, size?: string) => {
      setLines((prev) => {
        const key = lineKey(productId, size);
        if (qty <= 0) {
          return prev.filter((l) => lineKey(l.productId, l.size) !== key);
        }
        return prev.map((l) =>
          lineKey(l.productId, l.size) === key ? { ...l, qty } : l,
        );
      });
    },
    [],
  );

  const remove = useCallback((productId: string, size?: string) => {
    const key = lineKey(productId, size);
    setLines((prev) => prev.filter((l) => lineKey(l.productId, l.size) !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const items: CartItem[] = lines
      .map((l) => {
        const product = getProduct(l.productId);
        if (!product) return null;
        return { ...l, product, lineTotal: product.price * l.qty };
      })
      .filter((x): x is CartItem => x !== null);

    const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
    const count = items.reduce((s, it) => s + it.qty, 0);
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST;

    return {
      items,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      ready,
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
