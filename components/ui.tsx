// Tienda La Banda — small presentational primitives (money, badges).
// Ported from the Claude Design handoff. Pure — server-safe.

import { formatCOP, STATUS_LABEL, STOCK_LABEL } from "@/lib/data";
import type { OrderStatus, StockStatus } from "@/lib/types";

// ── Money displayer ───────────────────────────────────────────
export function Money({
  value,
  size = "md",
  weight = 600,
  tone,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  weight?: number;
  tone?: string;
}) {
  const sz = size === "lg" ? 28 : size === "sm" ? 13 : 16;
  return (
    <span
      style={{
        fontWeight: weight,
        fontSize: sz,
        color: tone ?? "var(--ink)",
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
      }}
    >
      {formatCOP(value)}
    </span>
  );
}

// ── Stock badge (storefront) ──────────────────────────────────
export function StockBadge({ status }: { status: StockStatus }) {
  const cls =
    status === "ok"
      ? "lds-badge-stock-ok"
      : status === "low"
        ? "lds-badge-stock-low"
        : "lds-badge-stock-out";
  return <span className={"lds-badge " + cls}>{STOCK_LABEL[status]}</span>;
}

// ── Order status badge (admin) ────────────────────────────────
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    pending: "lds-badge-pending",
    done: "lds-badge-done",
    shipped: "lds-badge-shipped",
    cancel: "lds-badge-cancel",
  };
  return (
    <span className={"lds-badge " + map[status]}>
      <span className="dot" />
      {STATUS_LABEL[status]}
    </span>
  );
}
