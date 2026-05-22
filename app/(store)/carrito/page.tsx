"use client";

// 04 · Carrito — ported from ScreenCart + ScreenCartEmpty.
// Real, interactive cart: qty stepper + remove, totals recompute live.

import Link from "next/link";
import { Icon } from "@/components/icons";
import { QtyStepper } from "@/components/QtyStepper";
import { Money } from "@/components/ui";
import { StoreHeader } from "@/components/StoreHeader";
import { formatCOP } from "@/lib/data";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { items, subtotal, total, count, ready, setQty, remove } = useCart();

  return (
    <div className="store-screen">
      <StoreHeader
        title={count > 0 ? `Tu carrito · ${count}` : "Tu carrito"}
        back
        hideCart
      />

      {!ready ? (
        <div style={{ flex: 1 }} />
      ) : items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          {/* Items */}
          <div className="store-body">
            <div className="store-sheet" style={{ padding: "8px 16px" }}>
            {items.map((it, idx) => (
              <div
                key={`${it.productId}-${it.size ?? ""}`}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom:
                    idx < items.length - 1
                      ? "1px solid var(--line-2)"
                      : "none",
                }}
              >
                <Link
                  href={`/producto/${it.productId}`}
                  style={{
                    width: 72,
                    height: 72,
                    background: "var(--surface-alt)",
                    borderRadius: "var(--r-md)",
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "block",
                  }}
                >
                  {it.product.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={it.product.image}
                      alt={it.product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Link>
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}
                      >
                        {it.product.name}
                      </div>
                      {it.size && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--ink-3)",
                            marginTop: 2,
                          }}
                        >
                          Talla {it.size}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(it.productId, it.size)}
                      aria-label={`Quitar ${it.product.name}`}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "var(--r-sm)",
                        border: "1px solid var(--line)",
                        background: "var(--surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name="trash" size={13} color="#b91c1c" />
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}
                  >
                    <QtyStepper
                      value={it.qty}
                      onChange={(q) => setQty(it.productId, q, it.size)}
                      min={1}
                      max={it.product.stock || 1}
                      size="sm"
                    />
                    <Money value={it.lineTotal} size="sm" weight={700} />
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Totals + CTA */}
          <div
            style={{
              position: "sticky",
              bottom: 0,
              padding: "16px 16px calc(14px + env(safe-area-inset-bottom))",
              borderTop: "1px solid var(--line-2)",
              background: "var(--surface)",
              flexShrink: 0,
            }}
          >
            <Row label="Subtotal" value={formatCOP(subtotal)} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                fontSize: 13,
                color: "var(--ink-2)",
                padding: "4px 0",
                alignItems: "flex-start",
              }}
            >
              <span style={{ flexShrink: 0 }}>Envío</span>
              <span
                style={{
                  textAlign: "right",
                  color: "var(--ink-3)",
                  fontSize: 12,
                  lineHeight: 1.35,
                  maxWidth: "62%",
                }}
              >
                El valor del envío lo pagas al recibir
              </span>
            </div>
            <hr className="lds-divider" style={{ margin: "10px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: "var(--ink-2)",
                  fontWeight: 500,
                }}
              >
                Total
              </span>
              <Money value={total} size="lg" weight={700} />
            </div>
            <Link
              href="/checkout"
              className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block"
              style={{ marginTop: 14 }}
            >
              Ir a pagar
              <Icon name="chevright" size={18} color="#fff" stroke={2} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13,
        color: "var(--ink-2)",
        padding: "4px 0",
      }}
    >
      <span>{label}</span>
      <span className="lds-num">{value}</span>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="store-body">
      <div
        className="store-sheet"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 40px",
          textAlign: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "var(--surface-alt)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="cart" size={42} color="var(--ink-3)" stroke={1.3} />
        </div>
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>
            Tu carrito está vacío
          </h2>
          <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>
            Cuando agregues productos, los vas a ver acá. Mirá la colección y
            armá tu pedido.
          </p>
        </div>
        <Link
          href="/"
          className="lds-btn lds-btn-primary lds-btn-lg"
          style={{ marginTop: 4 }}
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
