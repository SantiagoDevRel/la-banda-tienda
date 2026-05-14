// Admin order detail — ScreenOrderDetail
// NOTE: Next 16 — params is a Promise, page must be async.
import { AdminShell } from "@/components/AdminShell";
import { Icon, ProductGlyph } from "@/components/icons";
import { Money, OrderStatusBadge } from "@/components/ui";
import { OrderActions } from "@/components/admin/OrderActions";
import {
  ORDERS,
  CART_SEED,
  SHIPPING_COST,
  formatCOP,
  getOrder,
  getProduct,
} from "@/lib/data";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrder(Number(id)) ?? ORDERS[0];

  // Build item list from CART_SEED (same as design's LDS.CART)
  const items = CART_SEED.flatMap((c) => {
    const product = getProduct(c.productId);
    if (!product) return [];
    return [{ ...product, qty: c.qty }];
  });

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 16,
          maxWidth: 1080,
        }}
      >
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
              {items.map((it, i) => (
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
                    }}
                  >
                    <ProductGlyph
                      kind={it.glyph}
                      color={it.color}
                      bare
                      style={{ width: 38, height: 38 }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{it.name}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--ink-3)",
                        marginTop: 2,
                      }}
                    >
                      Talla M · Cant. {it.qty}
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
                      {formatCOP(it.price * it.qty)}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-3)",
                        marginTop: 2,
                      }}
                    >
                      {formatCOP(it.price)} c/u
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
                <span className="lds-num">{formatCOP(subtotal)}</span>
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
                <span className="lds-num">{formatCOP(SHIPPING_COST)}</span>
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
              <button className="lds-btn lds-btn-secondary lds-btn-sm">
                <Icon name="eye" size={14} color="var(--ink-2)" />
                Ampliar
              </button>
            </div>

            {/* Fake receipt preview */}
            <div style={{ marginTop: 14, display: "flex", gap: 14 }}>
              <div
                style={{
                  width: 180,
                  height: 240,
                  borderRadius: "var(--r-md)",
                  background: "linear-gradient(180deg, #faf7ff 0%, #f5edff 100%)",
                  border: "1px solid var(--line)",
                  padding: "16px 14px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#7C3AED",
                    letterSpacing: "0.1em",
                  }}
                >
                  NEQUI
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--ink-3)",
                    marginTop: 12,
                  }}
                >
                  Enviaste
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 700,
                    marginTop: 2,
                    letterSpacing: "-0.02em",
                  }}
                >
                  $ 187.000
                </div>
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: "1px dashed rgba(124,58,237,0.25)",
                    fontSize: 10,
                    color: "var(--ink-3)",
                  }}
                >
                  A
                </div>
                <div
                  style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}
                >
                  Carlos Andrés Marín
                </div>
                <div
                  style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}
                >
                  •••• 7791
                </div>
                <div
                  style={{ marginTop: 12, fontSize: 10, color: "var(--ink-3)" }}
                >
                  14 may · 14:18
                </div>
                <div
                  style={{ marginTop: 6, fontSize: 9, color: "var(--ink-3)" }}
                >
                  Ref: NQ7821449
                </div>
                <div style={{ flex: 1 }} />
                <div
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    padding: "3px 8px",
                    background: "rgba(124,58,237,0.12)",
                    borderRadius: "var(--r-full)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#5B21B6",
                  }}
                >
                  ✓ APROBADO
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  padding: "8px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--ink-3)" }}>
                    Monto en comprobante
                  </span>
                  <span
                    className="lds-num"
                    style={{ fontWeight: 600 }}
                  >
                    {formatCOP(187000)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--ink-3)" }}>
                    Monto del pedido
                  </span>
                  <span
                    className="lds-num"
                    style={{ fontWeight: 600 }}
                  >
                    {formatCOP(order.total)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    background: "var(--accent-tint)",
                    borderRadius: "var(--r-sm)",
                    marginTop: 4,
                  }}
                >
                  <Icon
                    name="check"
                    size={15}
                    color="var(--accent-ink)"
                    stroke={2.4}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--accent-ink)",
                    }}
                  >
                    El monto coincide
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    fontSize: 11,
                    color: "var(--ink-3)",
                    lineHeight: 1.5,
                  }}
                >
                  Verificá también la fecha y el titular antes de marcar la
                  pedido como finalizada.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: customer + actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                  Cliente nuevo
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
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span style={{ color: "var(--ink-3)" }}>Correo</span>
                <span>{order.email}</span>
              </div>
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span style={{ color: "var(--ink-3)" }}>Teléfono</span>
                <span>{order.phone}</span>
              </div>
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span style={{ color: "var(--ink-3)" }}>Dirección</span>
                <span style={{ textAlign: "right" }}>
                  Cra 70 #45-12
                  <br />
                  <span style={{ color: "var(--ink-3)" }}>
                    Medellín, Antioquia
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions (client component for interactivity) */}
          <OrderActions initialStatus={order.status} />
        </div>
      </div>
    </AdminShell>
  );
}
