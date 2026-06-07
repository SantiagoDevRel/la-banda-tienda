"use client";

// 07 · Confirmación de pedido — ported from ScreenConfirm.
// Reads the order snapshot saved on the Nequi screen (the cart is already
// cleared by now). Graceful fallback if visited directly.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon, ProductGlyph } from "@/components/icons";
import { Money } from "@/components/ui";
import { StoreHeader } from "@/components/StoreHeader";
import { formatCOP } from "@/lib/data";
import { readLastOrder, type LastOrder } from "@/lib/lastOrder";
import { DEFAULT_MESSAGES, type StoreMessages } from "@/lib/messages";

export function ConfirmScreen({
  messages = DEFAULT_MESSAGES,
}: {
  messages?: StoreMessages;
}) {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    setOrder(readLastOrder());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="store-screen">
        <StoreHeader />
        <div style={{ flex: 1 }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="store-screen">
        <StoreHeader />
        <div className="store-body">
          <div
            className="store-sheet"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 40px",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "var(--surface-alt)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="bag" size={32} color="var(--ink-3)" stroke={1.3} />
            </div>
            <h2 style={{ fontSize: 20 }}>No encontramos un pedido reciente</h2>
            <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>
              Si acabás de comprar, revisá tu WhatsApp o correo. Si no, armá tu
              pedido desde el catálogo.
            </p>
            <Link
              href="/"
              className="lds-btn lds-btn-primary lds-btn-lg"
              style={{ marginTop: 4 }}
            >
              Ir al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="store-screen">
      {showPopup && (
        <div
          className="store-scrim"
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            zIndex: 60,
          }}
          onClick={() => setShowPopup(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 380,
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-xl)",
              padding: "30px 22px 22px",
              textAlign: "center",
              boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              aria-label="Cerrar"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "var(--surface-alt)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="close" size={16} color="var(--ink-3)" />
            </button>

            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "var(--accent-tint)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="check" size={30} stroke={2.5} color="var(--accent-ink)" />
            </div>

            <h2 style={{ fontSize: 20, marginTop: 14, color: "var(--ink)" }}>
              {messages.popupTitulo}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-2)",
                marginTop: 10,
                lineHeight: 1.55,
                whiteSpace: "pre-line",
              }}
            >
              {messages.postCompra}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "var(--accent-ink)",
                marginTop: 14,
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                lineHeight: 1.4,
                whiteSpace: "pre-line",
              }}
            >
              {messages.marca}
            </p>

            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block"
              style={{ marginTop: 18 }}
            >
              Listo
            </button>
          </div>
        </div>
      )}

      <StoreHeader />
      <div className="store-body">
        <div className="store-sheet">
          <div style={{ padding: "28px 18px 22px", textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--accent-tint)",
                color: "var(--accent-ink)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="check" size={32} stroke={2.5} color="var(--accent-ink)" />
            </div>
            <h1 style={{ fontSize: 22, marginTop: 14 }}>
              ¡Recibimos tu pedido!
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-2)",
                marginTop: 8,
                lineHeight: 1.5,
                whiteSpace: "pre-line",
              }}
            >
              {messages.postCompra}
            </p>
            <div
              style={{
                marginTop: 18,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                background: "var(--surface-alt)",
                borderRadius: "var(--r-full)",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "var(--ink-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                Pedido
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 17,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {order.number}
              </span>
            </div>
          </div>

          {/* Purchase summary */}
          <div
            style={{
              margin: "0 16px",
              background: "var(--surface)",
              border: "1px solid var(--line-2)",
              borderRadius: "var(--r-lg)",
              padding: 14,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--ink-2)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              Tu compra
            </div>
            {order.items.map((it, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "10px 0",
                  borderTop: i ? "1px solid var(--line-2)" : "none",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
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
                    style={{ width: 34, height: 34 }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--ink-3)",
                      marginTop: 2,
                    }}
                  >
                    Cantidad: {it.qty}
                  </div>
                </div>
                <div
                  className="lds-num"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  {formatCOP(it.lineTotal)}
                </div>
              </div>
            ))}
            <hr className="lds-divider" style={{ margin: "10px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
                Total pagado
              </span>
              <Money value={order.total} weight={700} />
            </div>

            {order.deliveryMethod !== "pickup" && (
              <div
                style={{
                  marginTop: 12,
                  padding: "10px 12px",
                  background: "var(--accent-tint)",
                  borderRadius: "var(--r-md)",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <Icon
                  name="truck"
                  size={16}
                  color="var(--accent-ink)"
                  stroke={1.7}
                />
                <div style={{ lineHeight: 1.4 }}>
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: "var(--accent-ink)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    ¡IMPORTANTE!
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--accent-ink)",
                      marginTop: 2,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {messages.envioContraentrega}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Link
              href="/"
              className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
