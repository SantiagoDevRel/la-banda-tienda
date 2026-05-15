// Tienda La Banda — shared helpers (non-mock).
// Productos, pedidos y ajustes ahora vienen de Supabase (lib/queries.ts).

import type { StockStatus } from "./types";
import type { Order } from "./types";

/** Formato de pesos colombianos: 45000 -> "$ 45.000" */
export function formatCOP(n: number): string {
  const s = Math.round(Math.abs(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (n < 0 ? "-$ " : "$ ") + s;
}

// ── Categorías del catálogo ───────────────────────────────────────────────
export const CATEGORIES = ["Todos", "Camisetas", "Abrigos", "Accesorios"];

// ── Carrito inicial: vacío (real store, no demo seed) ─────────────────────
export const CART_SEED: { productId: string; qty: number }[] = [];

// ── Labels de stock ────────────────────────────────────────────────────────
export const STOCK_LABEL: Record<StockStatus, string> = {
  ok: "Disponible",
  low: "Últimas unidades",
  out: "Agotado",
};

// ── Labels de estado de pedido ─────────────────────────────────────────────
export const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Pendiente",
  done: "Finalizada",
  shipped: "Enviado",
  cancel: "Cancelada",
};

// ── Lista de clips del fondo rotativo ──────────────────────────────────────
export const BG_CLIPS = [
  "bg-1", "bg-2", "bg-3", "bg-4", "bg-5", "bg-6", "bg-7", "bg-8", "bg-9",
];
