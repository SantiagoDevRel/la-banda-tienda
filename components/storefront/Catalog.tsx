"use client";

// Catalog grid + category chips. Filters the (mock) product list client-side.

import { useState } from "react";
import { Icon } from "@/components/icons";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import { ProductCard } from "./ProductCard";

export function Catalog() {
  const [cat, setCat] = useState("Todos");

  const filtered =
    cat === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.tags.includes(cat.toLowerCase()));

  return (
    <>
      <div className="chip-row">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={"chip" + (c === cat ? " is-active" : "")}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "60px 40px",
            gap: 10,
            color: "#fff",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="box" size={28} color="#fff" stroke={1.4} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>
            No hay productos en esta categoría
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            Probá con otra categoría o volvé pronto.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            padding: "2px 16px 32px",
          }}
        >
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </>
  );
}
