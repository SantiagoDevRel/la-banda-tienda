"use client";

// Tienda La Banda — client-side cart (context + localStorage).
// Products are fetched server-side and injected via <CartProvider products={...}>.
// The cart itself only stores lines (productId + qty + size) in localStorage.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CART_SEED } from "./data";
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
  shippingCost: number;
  freeShippingMin: number;
  ready: boolean;
  add: (productId: string, qty?: number, size?: string) => void;
  setQty: (productId: string, qty: number, size?: string) => void;
  remove: (productId: string, size?: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const lineKey = (productId: string, size?: string) =>
  `${productId}::${size ?? ""}`;

interface CartProviderProps {
  children: React.ReactNode;
  /** Active products from the server — used to resolve cart lines into CartItems. */
  products?: Product[];
  shippingCost?: number;
  freeShippingMin?: number;
}

export function CartProvider({
  children,
  products = [],
  shippingCost = 12000,
  freeShippingMin = 200000,
}: CartProviderProps) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // Build a lookup map from the products prop.
  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  // Helper used inside setLines callbacks (needs to be stable).
  const getProductStock = useCallback(
    (productId: string) => productMap.get(productId)?.stock ?? Infinity,
    [productMap],
  );

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
        const cap = getProductStock(productId);
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
    [getProductStock],
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
        const product = productMap.get(l.productId);
        if (!product) return null;
        return { ...l, product, lineTotal: product.price * l.qty };
      })
      .filter((x): x is CartItem => x !== null);

    const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
    const count = items.reduce((s, it) => s + it.qty, 0);
    const shipping =
      subtotal === 0 || subtotal >= freeShippingMin ? 0 : shippingCost;

    return {
      items,
      count,
      subtotal,
      shipping,
      shippingCost,
      freeShippingMin,
      total: subtotal + shipping,
      ready,
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, productMap, ready, shippingCost, freeShippingMin, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
