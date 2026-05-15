// Admin order detail — ScreenOrderDetail
// NOTE: Next 16 — params is a Promise, page must be async.
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { Icon } from "@/components/icons";
import { Money, OrderStatusBadge } from "@/components/ui";
import { OrderActions } from "@/components/admin/OrderActions";
import { formatCOP } from "@/lib/data";
import { getOrderWithItems } from "@/lib/queries";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderWithItems(id);
  if (!order) notFound();

  // Customer initials
  const initials = order.customer
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <AdminShell
      section="orders"
      page={{
        title: (
          <span>
            Pedido{" "}
            <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>
              #{order.id}
            </span>
          </span>
        ),
        subtitle: (
          <span>
            Pedidos →{" "}
            <span style={{ color: "var(--ink-2)" }}>
              #{order.id} de {order.customer}
            </span>
          </span>
        ),
        action: <OrderStatusBadge status={order.status} />,
      }}
    >
      <div className="admin-order-grid">
        {/* Left: items + screenshot */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Items */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)",
              padding: 18,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              Artículos comprados
            </div>
            <div style={{ marginTop: 12 }}>
              {order.orderItems.map((it, i) => (
                <div
                  key={it.id}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "12px 0",
                    borderTop: i ? "1px solid var(--line-2)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: "var(--surface-alt)",
                      borderRadius: "var(--r-sm)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 22,
                    }}
                  >
                    📦
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{it.productName}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--ink-3)",
                        marginTop: 2,
                      }}
                    >
                      {it.size ? `Talla ${it.size} · ` : ""}Cant. {it.quantity}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatCOP(it.unitPrice * it.quantity)}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-3)",
                        marginTop: 2,
                      }}
                    >
                      {formatCOP(it.unitPrice)} c/u
                    </div>
                  </div>
                </div>
              ))}
              <hr className="lds-divider" style={{ margin: "14px 0 12px" }} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "var(--ink-2)",
                  padding: "3px 0",
                }}
              >
                <span>Subtotal</span>
                <span className="lds-num">{formatCOP(order.subtotal)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "var(--ink-2)",
                  padding: "3px 0",
                }}
              >
                <span>Envío</span>
                <span className="lds-num">
                  {order.shipping === 0 ? "Gratis" : formatCOP(order.shipping)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginTop: 6,
                  paddingTop: 8,
                  borderTop: "1px solid var(--line-2)",
                }}
              >
                <span style={{ fontWeight: 700 }}>Total</span>
                <Money value={order.total} weight={700} />
              </div>
            </div>
          </div>

          {/* Payment screenshot */}
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
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                  Comprobante de pago
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                  Subido por el cliente · pantallazo de Nequi
                </div>
              </div>
              {order.screenshotUrl && (
                <a
                  href={order.screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lds-btn lds-btn-secondary lds-btn-sm"
                >
                  <Icon name="eye" size={14} color="var(--ink-2)" />
                  Ampliar
                </a>
              )}
            </div>

            <div style={{ marginTop: 14 }}>
              {order.screenshotUrl ? (
                <a href={order.screenshotUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={order.screenshotUrl}
                    alt="Comprobante de pago"
                    style={{
                      maxWidth: 260,
                      maxHeight: 400,
                      borderRadius: "var(--r-md)",
                      border: "1px solid var(--line)",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </a>
              ) : order.status !== "pending" ? (
                <div
                  style={{
                    padding: 16,
                    background: "var(--accent-tint)",
                    borderRadius: "var(--r-md)",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="check"
                    size={20}
                    color="var(--accent-ink)"
                    stroke={2.4}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--accent-ink)",
                      }}
                    >
                      Pago verificado
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--accent-ink)",
                        opacity: 0.8,
                        marginTop: 2,
                      }}
                    >
                      El comprobante se archivó automáticamente al procesar el
                      pedido.
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: "24px 16px",
                    background: "var(--surface-alt)",
                    borderRadius: "var(--r-md)",
                    textAlign: "center",
                    fontSize: 13,
                    color: "var(--ink-3)",
                  }}
                >
                  Sin comprobante adjunto
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--ink-3)" }}>Monto del pedido</span>
              <span className="lds-num" style={{ fontWeight: 600 }}>
                {formatCOP(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: customer + actions — floats above items on mobile */}
        <div className="admin-order-grid-actions" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Customer card */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)",
              padding: 18,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700 }}>Cliente</div>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--accent-tint)",
                  color: "var(--accent-ink)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {order.customer}
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
                  Cliente
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 13,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--ink-3)" }}>Correo</span>
                <span>{order.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--ink-3)" }}>Teléfono</span>
                <span>{order.phone || "—"}</span>
              </div>
              {(order.customerAddress || order.customerCity) && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink-3)" }}>Dirección</span>
                  <span style={{ textAlign: "right", maxWidth: 180 }}>
                    {order.customerAddress}
                    {order.customerCity && (
                      <>
                        <br />
                        <span style={{ color: "var(--ink-3)" }}>
                          {order.customerCity}
                        </span>
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions (client component for interactivity) */}
          <OrderActions initialStatus={order.status} orderId={order.orderId} />
        </div>
      </div>
    </AdminShell>
  );
}
