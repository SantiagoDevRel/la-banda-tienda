"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { deleteProduct } from "@/lib/actions/products";

export function DeleteProductButton({
  productId,
  mobile = false,
}: {
  productId: string;
  mobile?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  if (confirming) {
    return (
      <div style={{ display: "flex", gap: 4, flex: mobile ? 1 : undefined }}>
        <button
          onClick={async () => {
            setLoading(true);
            await deleteProduct(productId);
            // revalidatePath fires server-side; the page will re-render
          }}
          disabled={loading}
          style={{
            flex: 1,
            padding: mobile ? "8px 12px" : "4px 8px",
            fontSize: mobile ? 13 : 11,
            fontWeight: 600,
            borderRadius: "var(--r-sm)",
            background: "rgba(185, 28, 28, 0.15)",
            border: "1px solid rgba(185, 28, 28, 0.35)",
            color: "#f87171",
            cursor: "pointer",
            minHeight: mobile ? 40 : undefined,
          }}
        >
          {loading ? "…" : "Confirmar"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          style={{
            flex: mobile ? 1 : undefined,
            padding: mobile ? "8px 12px" : "4px 6px",
            fontSize: mobile ? 13 : 11,
            borderRadius: "var(--r-sm)",
            background: "var(--surface-alt)",
            border: "1px solid var(--line)",
            cursor: "pointer",
            minHeight: mobile ? 40 : undefined,
            color: "var(--ink-2)",
          }}
        >
          No
        </button>
      </div>
    );
  }

  if (mobile) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="lds-btn lds-btn-danger lds-btn-sm"
        style={{
          flex: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          minHeight: 40,
        }}
      >
        <Icon name="trash" size={14} color="#B91C1C" />
        Eliminar
      </button>
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
