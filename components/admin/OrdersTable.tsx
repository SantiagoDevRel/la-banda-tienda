"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCOP } from "@/lib/data";
import { OrderStatusBadge } from "@/components/ui";
import { Icon } from "@/components/icons";
import type { OrderStatus } from "@/lib/types";
import type { OrderRow } from "@/lib/queries";

type FilterId = "all" | OrderStatus;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "pending", label: "Pendientes" },
  { id: "done", label: "Finalizadas" },
  { id: "shipped", label: "Enviadas" },
  { id: "cancel", label: "Canceladas" },
];

interface OrdersTableProps {
  orders: OrderRow[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [search, setSearch] = useState("");

  const counts: Record<FilterId, number> = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    done: orders.filter((o) => o.status === "done").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    cancel: orders.filter((o) => o.status === "cancel").length,
  };

  const filtered = orders.filter((o) => {
    const matchesFilter = activeFilter === "all" || o.status === activeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      String(o.id).includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid var(--line)",
          marginBottom: 14,
        }}
      >
        {FILTERS.map((f) => {
          const active = f.id === activeFilter;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 500,
                color: active ? "var(--ink)" : "var(--ink-2)",
                borderBottom: active
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: "none",
                borderBottomStyle: "solid",
                borderBottomWidth: 2,
                borderBottomColor: active ? "var(--accent)" : "transparent",
              }}
            >
              {f.label}
              <span
                style={{
                  fontSize: 11,
                  padding: "1px 6px",
                  borderRadius: "var(--r-full)",
                  background: active ? "var(--accent-tint)" : "var(--surface-alt)",
                  color: active ? "var(--accent-ink)" : "var(--ink-2)",
                  fontWeight: 600,
                }}
              >
                {counts[f.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <div
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <Icon name="search" size={16} color="var(--ink-3)" />
          </div>
          <input
            className="lds-input"
            placeholder="Buscar por #pedido, cliente o correo…"
            style={{ paddingLeft: 36 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="lds-btn lds-btn-secondary lds-btn-sm">
          Últimos 7 días
          <Icon name="chevdown" size={14} color="var(--ink-2)" />
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
        }}
      >
        <table className="lds-table">
          <thead>
            <tr>
              <th>#Pedido</th>
              <th>Cliente</th>
              <th>Items</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Total</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.orderId}>
                <td style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  #{o.id}
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.customer}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{o.email}</div>
                </td>
                <td style={{ color: "var(--ink-2)" }}>
                  {o.items} {o.items === 1 ? "artículo" : "artículos"}
                </td>
                <td>
                  <OrderStatusBadge status={o.status} />
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 600,
                  }}
                >
                  {formatCOP(o.total)}
                </td>
                <td style={{ color: "var(--ink-3)", fontSize: 13 }}>{o.date}</td>
                <td style={{ textAlign: "right" }}>
                  <Link href={`/admin/ordenes/${o.orderId}`}>
                    <Icon name="chevright" size={14} color="var(--ink-3)" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    color: "var(--ink-3)",
                    padding: "32px 0",
                    fontSize: 13,
                  }}
                >
                  No hay pedidos que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
