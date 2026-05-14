"use client";

// Catalog product card — ported from the design's ProductCard.
// The whole card links to the detail page; "Agregar" adds to cart in place.

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { Icon } from "@/components/icons";
import { ProductImage } from "@/components/ProductImage";
import { Money, StockBadge } from "@/components/ui";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const out = p.status === "out";

  function handleAdd(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (out) return;
    add(p.id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  }

  return (
    <Link
      href={`/producto/${p.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
        borderRadius: "var(--r-lg)",
        border: "1px solid var(--line-2)",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <ProductImage product={p} />
      <div
        style={{
          padding: "10px 12px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <StockBadge status={p.status} />
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          {p.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 2,
            gap: 8,
          }}
        >
          <Money value={p.price} size="sm" />
          <button
            type="button"
            onClick={handleAdd}
            disabled={out}
            className="lds-btn lds-btn-primary lds-btn-sm"
            style={{ padding: "7px 12px", fontSize: 12, flexShrink: 0 }}
          >
            {added ? (
              <>
                <Icon name="check" size={13} color="#fff" stroke={2.4} />
                Agregado
              </>
            ) : out ? (
              "Agotado"
            ) : (
              "Agregar"
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
