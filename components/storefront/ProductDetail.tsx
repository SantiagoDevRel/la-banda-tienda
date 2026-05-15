"use client";

// 03 · Detalle de producto — ported from the design's ScreenProductDetail.
// Image gallery + stock + price + description + size selector + qty stepper + sticky CTA.

import { useState } from "react";
import { Icon } from "@/components/icons";
import { ProductGlyph } from "@/components/icons";
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
  const [idx, setIdx] = useState(0);

  const gallery = p.gallery && p.gallery.length > 0 ? p.gallery : null;
  const hasMultiple = gallery && gallery.length > 1;

  function prev() {
    if (!gallery) return;
    setIdx((i) => (i - 1 + gallery.length) % gallery.length);
  }

  function next() {
    if (!gallery) return;
    setIdx((i) => (i + 1) % gallery.length);
  }

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
      <div className="store-body">
        <div className="store-sheet">
          {/* Image gallery */}
          <div
            style={{ background: "var(--surface-alt)", padding: "10px 14px 8px" }}
          >
            <div
              style={{
                width: "82%",
                margin: "0 auto",
                position: "relative",
              }}
            >
              {/* Main image area */}
              {gallery ? (
                <div
                  className="lds-prodfig"
                  style={{ background: "var(--surface-alt)", position: "relative" }}
                >
                  <img
                    src={gallery[idx]}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />

                  {/* Arrow buttons — only when >1 image */}
                  {hasMultiple && (
                    <>
                      <button
                        type="button"
                        aria-label="Foto anterior"
                        onClick={prev}
                        style={{
                          position: "absolute",
                          left: 6,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "rgba(10, 13, 11, 0.55)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          backdropFilter: "blur(6px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          zIndex: 2,
                          padding: 0,
                        }}
                      >
                        <Icon name="chevleft" size={18} color="#fff" stroke={2} />
                      </button>
                      <button
                        type="button"
                        aria-label="Siguiente foto"
                        onClick={next}
                        style={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "rgba(10, 13, 11, 0.55)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          backdropFilter: "blur(6px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          zIndex: 2,
                          padding: 0,
                        }}
                      >
                        <Icon name="chevright" size={18} color="#fff" stroke={2} />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <ProductGlyph kind={p.glyph} color={p.color} />
              )}
            </div>

            {/* Dots — only when >1 image */}
            {hasMultiple && gallery && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Foto ${i + 1}`}
                    onClick={() => setIdx(i)}
                    style={{
                      width: i === idx ? 18 : 5,
                      height: 5,
                      borderRadius: 3,
                      background: i === idx ? "var(--ink)" : "var(--ink-4)",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      transition: "width 0.2s, background 0.2s",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Single image — no dots */}
            {gallery && gallery.length === 1 && (
              <div style={{ marginTop: 10, height: 5 }} />
            )}

            {/* No image — no dots */}
            {!gallery && (
              <div style={{ marginTop: 10, height: 5 }} />
            )}
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
