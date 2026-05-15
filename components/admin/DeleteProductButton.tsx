"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { deleteProduct } from "@/lib/actions/products";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  if (confirming) {
    return (
      <div style={{ display: "flex", gap: 4 }}>
        <button
          onClick={async () => {
            setLoading(true);
            await deleteProduct(productId);
            // revalidatePath fires server-side; the page will re-render
          }}
          disabled={loading}
          style={{
            padding: "4px 8px",
            fontSize: 11,
            fontWeight: 600,
            borderRadius: "var(--r-sm)",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            cursor: "pointer",
          }}
        >
          {loading ? "…" : "Confirmar"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          style={{
            padding: "4px 6px",
            fontSize: 11,
            borderRadius: "var(--r-sm)",
            background: "var(--surface-alt)",
            border: "1px solid var(--line)",
            cursor: "pointer",
          }}
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{
        width: 30,
        height: 30,
        borderRadius: "var(--r-sm)",
        border: "1px solid var(--line)",
        background: "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      title="Eliminar"
    >
      <Icon name="trash" size={14} color="#B91C1C" />
    </button>
  );
}
