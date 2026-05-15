"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    const result = await deleteProduct(productId);
    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }
    // Re-fetch the products list so the deleted row disappears.
    router.refresh();
    setLoading(false);
    setConfirming(false);
  }

  if (confirming) {
    return (
      <div style={{ flex: mobile ? 1 : undefined, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: mobile ? "8px 12px" : "4px 8px",
              fontSize: mobile ? 13 : 11,
              fontWeight: 600,
              borderRadius: "var(--r-sm)",
              background: "rgba(185, 28, 28, 0.18)",
              border: "1px solid rgba(185, 28, 28, 0.4)",
              color: "#f87171",
              cursor: loading ? "wait" : "pointer",
              minHeight: mobile ? 40 : undefined,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Eliminando…" : "Confirmar"}
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirming(false);
              setError(null);
            }}
            disabled={loading}
            style={{
              flex: mobile ? 1 : undefined,
              padding: mobile ? "8px 12px" : "4px 6px",
              fontSize: mobile ? 13 : 11,
              borderRadius: "var(--r-sm)",
              background: "var(--surface-alt)",
              border: "1px solid var(--line)",
              cursor: loading ? "not-allowed" : "pointer",
              minHeight: mobile ? 40 : undefined,
              color: "var(--ink-2)",
            }}
          >
            No
          </button>
        </div>
        {error && (
          <div
            style={{
              fontSize: 11,
              color: "#f87171",
              marginTop: 6,
              lineHeight: 1.3,
            }}
          >
            {error}
          </div>
        )}
      </div>
    );
  }

  if (mobile) {
    return (
      <button
        type="button"
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
      type="button"
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
