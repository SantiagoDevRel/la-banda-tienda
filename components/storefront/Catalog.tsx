"use client";

// Catalog grid + category chips. Filters the product list client-side.
// Solo se muestran las categorías que tienen al menos un producto activo;
// si queda una sola, también se oculta el chip "Todos".

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { CATEGORIES } from "@/lib/data";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

interface CatalogProps {
  products: Product[];
}

export function Catalog({ products }: CatalogProps) {
  const [cat, setCat] = useState("Todos");

  const visibleCategories = useMemo(() => {
    const withProducts = CATEGORIES.filter(
      (c) =>
        c !== "Todos" &&
        products.some((p) => p.tags.includes(c.toLowerCase())),
    );
    // Si solo una categoría tiene productos, no tiene sentido mostrar "Todos".
    return withProducts.length > 1 ? ["Todos", ...withProducts] : withProducts;
  }, [products]);

  // Si la categoría seleccionada ya no está visible (la única se vació), caer
  // a la primera disponible.
  const effectiveCat = visibleCategories.includes(cat)
    ? cat
    : visibleCategories[0] ?? "Todos";

  const filtered =
    effectiveCat === "Todos"
      ? products
      : products.filter((p) => p.tags.includes(effectiveCat.toLowerCase()));

  return (
    <>
      {visibleCategories.length > 0 && (
        <div className="chip-row">
          {visibleCategories.map((c) => (
            <button
              key={c}
              type="button"
              className={"chip" + (c === effectiveCat ? " is-active" : "")}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

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
            Pronto vas a ver más productos acá
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            La banda está armando la colección. Volvé pronto.
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
