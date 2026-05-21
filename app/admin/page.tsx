// Admin dashboard — ScreenDashboard
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { Icon } from "@/components/icons";
import { OrderStatusBadge } from "@/components/ui";
import { formatCOP } from "@/lib/data";
import {
  getDashboardMetrics,
  getOrders,
  getSalesSummary,
  type RevenueBucket,
} from "@/lib/queries";
import type { ReactNode } from "react";

// ── Sales summary helpers ─────────────────────────────────────────
function SaleStat({
  label,
  hint,
  value,
  emphasized,
}: {
  label: string;
  hint: string;
  value: number;
  emphasized?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--ink-2)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 700,
          marginTop: 6,
          letterSpacing: "-0.02em",
          color: emphasized ? "var(--accent-ink)" : "var(--ink)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatCOP(value)}
      </div>
      <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
        {hint}
      </div>
    </div>
  );
}

function BreakdownCard({
  label,
  dotColor,
  bucket,
}: {
  label: string;
  dotColor: string;
  bucket: RevenueBucket;
}) {
  return (
    <div
      style={{
        background: "var(--surface-alt)",
        borderRadius: "var(--r-md)",
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: dotColor,
            flexShrink: 0,
          }}
        />
        {label}
        <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>
          · {bucket.count} {bucket.count === 1 ? "pedido" : "pedidos"}
        </span>
      </div>
      <div
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          fontSize: 12.5,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--ink-3)" }}>Productos</span>
          <span className="lds-num">{formatCOP(bucket.product)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--ink-3)" }}>Envíos</span>
          <span className="lds-num">{formatCOP(bucket.shipping)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 6,
            borderTop: "1px solid var(--line-2)",
            fontWeight: 700,
          }}
        >
          <span>Total</span>
          <span className="lds-num">{formatCOP(bucket.total)}</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  accentBg,
  icon,
}: {
  label: string;
  value: ReactNode;
  sub: string;
  accentBg: string;
  icon: ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--r-lg)",
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--ink-2)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--r-sm)",
            background: accentBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 32,
          fontWeight: 700,
          marginTop: 14,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>{sub}</div>
    </div>
  );
}

export default async function DashboardPage() {
  const [metrics, recentOrders, sales] = await Promise.all([
    getDashboardMetrics(),
    getOrders(),
    getSalesSummary(),
  ]);

  const quickActions = [
    {
      icon: "plus" as const,
      label: "Nuevo producto",
      sub: "Subí una nueva referencia",
      href: "/admin/productos/nuevo",
    },
    {
      icon: "bag" as const,
      label: "Ver pendientes",
      sub: `${metrics.pendingCount} esperando verificar`,
      href: "/admin/ordenes",
    },
    {
      icon: "settings" as const,
      label: "Datos de Nequi",
      sub: "Actualizar cuenta y titular",
      href: "/admin/ajustes",
    },
  ];

  return (
    <AdminShell
      section="dashboard"
      page={{
        title: "Hola, Jeison 👋",
        subtitle: "Acá tenés un resumen de la tienda hoy.",
      }}
    >
      {/* Metric cards */}
      <div className="admin-metric-grid">
        <MetricCard
          label="Pedidos pendientes"
          value={metrics.pendingCount}
          sub="Necesitan verificación"
          accentBg="var(--status-pending-bg)"
          icon={
            <Icon name="bell" size={16} color="var(--status-pending-ink)" />
          }
        />
        <MetricCard
          label="Pedidos de hoy"
          value={metrics.todayCount}
          sub={formatCOP(metrics.todayRevenue) + " en ventas"}
          accentBg="var(--accent-tint)"
          icon={<Icon name="bag" size={16} color="var(--accent-ink)" />}
        />
        <MetricCard
          label="Stock bajo"
          value={metrics.lowStockCount}
          sub="Productos por reponer"
          accentBg="var(--surface-alt)"
          icon={<Icon name="box" size={16} color="var(--ink-2)" />}
        />
        <MetricCard
          label="Total pedidos"
          value={metrics.totalOrders}
          sub="Este mes"
          accentBg="var(--surface-alt)"
          icon={<Icon name="grid" size={16} color="var(--ink-2)" />}
        />
      </div>

      {/* Sales summary — productos vendidos vs envíos cobrados */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--r-lg)",
          padding: 18,
          marginTop: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              Resumen de ventas
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
              Pendientes + confirmados · no incluye cancelados
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-3)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {sales.combined.count}{" "}
            {sales.combined.count === 1 ? "pedido" : "pedidos"}
          </div>
        </div>

        <div className="admin-sales-grid" style={{ marginTop: 16 }}>
          <SaleStat
            label="Total vendido"
            hint="solo productos"
            value={sales.combined.product}
          />
          <SaleStat
            label="Envíos cobrados"
            hint="domicilios"
            value={sales.combined.shipping}
          />
          <SaleStat
            label="Total recaudado"
            hint="productos + envíos"
            value={sales.combined.total}
            emphasized
          />
        </div>

        <div className="admin-sales-breakdown">
          <BreakdownCard
            label="Pendientes"
            dotColor="var(--status-pending-ink)"
            bucket={sales.pending}
          />
          <BreakdownCard
            label="Confirmados"
            dotColor="var(--accent-ink)"
            bucket={sales.confirmed}
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className="admin-content-grid">
        {/* Recent orders */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid var(--line-2)",
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                Pedidos recientes
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                Los pendientes están arriba
              </div>
            </div>
            <Link
              href="/admin/ordenes"
              className="lds-link"
              style={{ fontSize: 13 }}
            >
              Ver todos →
            </Link>
          </div>
          {/* Desktop table */}
          <div className="admin-desktop-only">
            <table className="lds-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 5).map((o) => (
                  <tr key={o.orderId}>
                    <td
                      style={{
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      #{o.id}
                    </td>
                    <td>{o.customer}</td>
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
                    <td style={{ color: "var(--ink-3)", fontSize: 13 }}>
                      {o.date}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        color: "var(--ink-3)",
                        padding: "32px 0",
                        fontSize: 13,
                      }}
                    >
                      No hay pedidos todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="admin-mobile-only" style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 12px" }}>
            {recentOrders.slice(0, 5).map((o) => (
              <Link
                key={o.orderId}
                href={`/admin/ordenes/${o.orderId}`}
                className="admin-order-card"
              >
                <div className="admin-order-card-top">
                  <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    #{o.id}
                  </span>
                  <OrderStatusBadge status={o.status} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{o.customer}</div>
                <div className="admin-order-card-meta">
                  <span style={{ color: "var(--ink-3)" }}>{o.date}</span>
                  <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {formatCOP(o.total)}
                  </span>
                </div>
              </Link>
            ))}
            {recentOrders.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--ink-3)", padding: "24px 0", fontSize: 13 }}>
                No hay pedidos todavía.
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Quick actions */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)",
              padding: 18,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700 }}>Accesos rápidos</div>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {quickActions.map((qa) => (
                <Link
                  key={qa.label}
                  href={qa.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--line-2)",
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--r-sm)",
                      background: "var(--accent-tint)",
                      color: "var(--accent-ink)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={qa.icon} size={16} color="var(--accent-ink)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {qa.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                      {qa.sub}
                    </div>
                  </div>
                  <Icon name="chevright" size={14} color="var(--ink-3)" />
                </Link>
              ))}
            </div>
          </div>

          {/* Store status */}
          <div
            style={{
              background: "var(--accent-tint)",
              border:
                "1px solid color-mix(in oklch, var(--accent) 25%, transparent)",
              borderRadius: "var(--r-lg)",
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--accent-ink)",
              }}
            >
              Tu tienda está activa
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--accent-ink)",
                opacity: 0.8,
                marginTop: 4,
                lineHeight: 1.4,
              }}
            >
              Los clientes pueden hacer pedidos. Mantené el stock al día.
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
