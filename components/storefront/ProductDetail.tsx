"use client";

// 03 · Detalle de producto — ported from the design's ScreenProductDetail.
// Image + stock + price + description + size selector + qty stepper + sticky CTA.

import { useState } from "react";
import { Icon } from "@/components/icons";
import { ProductImage } from "@/components/ProductImage";
import { QtyStepper } from "@/components/QtyStepper";
import { Money, StockBadge } from "@/components/ui";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export function ProductDetail({ product: p }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const out = p.status === "out";
  const hasSizes = p.tags.includes("camisetas") || p.tags.includes("abrigos");

  function handleAdd() {
    if (out) return;
    add(p.id, qty, hasSizes ? size : undefined);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <>
      <div className="store-body" style={{ background: "var(--bg)" }}>
        {/* Image */}
        <div style={{ background: "var(--surface-alt)", padding: "10px 14px 8px" }}>
          <div style={{ width: "82%", margin: "0 auto" }}>
            <ProductImage product={p} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 5,
              marginTop: 10,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: i === 0 ? 18 : 5,
                  height: 5,
                  borderRadius: 3,
                  background: i === 0 ? "var(--ink)" : "var(--ink-4)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "18px 18px 24px" }}>
          <StockBadge status={p.status} />
          <h2 style={{ fontSize: 22, marginTop: 10, lineHeight: 1.15 }}>
            {p.name}
          </h2>
          <div style={{ marginTop: 10 }}>
            <Money value={p.price} size="lg" weight={700} />
          </div>

          <p
            style={{
              marginTop: 18,
              fontSize: 14,
              color: "var(--ink-2)",
              lineHeight: 1.55,
            }}
          >
            {p.desc}
          </p>

          {hasSizes && (
            <div style={{ marginTop: 22 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink-2)",
                  marginBottom: 10,
                }}
              >
                Talla
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {SIZES.map((s) => {
                  const active = s === size;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      style={{
                        width: 44,
                        height: 40,
                        borderRadius: "var(--r-sm)",
                        border: active
                          ? "1.5px solid var(--accent)"
                          : "1px solid var(--line)",
                        background: active
                          ? "var(--accent-tint)"
                          : "var(--surface)",
                        color: active ? "var(--accent-ink)" : "var(--ink)",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}
            >
              Cantidad
            </div>
            <QtyStepper
              value={qty}
              onChange={setQty}
              min={1}
              max={out ? 1 : p.stock}
            />
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="store-cta">
        <button
          type="button"
          onClick={handleAdd}
          disabled={out}
          className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block"
        >
          {added ? (
            <>
              <Icon name="check" size={18} color="#fff" stroke={2.2} />
              Agregado al carrito
            </>
          ) : out ? (
            "Producto agotado"
          ) : (
            <>
              <Icon name="cart" size={18} color="#fff" stroke={1.8} />
              Agregar al carrito
            </>
          )}
        </button>
      </div>
    </>
  );
}
