"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { OrderStatusBadge } from "@/components/ui";
import type { OrderStatus } from "@/lib/types";
import { updateOrderStatus } from "@/lib/actions/admin";

export function OrderActions({
  initialStatus,
  orderId,
}: {
  initialStatus: OrderStatus;
  orderId: string;
}) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [notify, setNotify] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function doUpdate(newStatus: OrderStatus) {
    setLoading(true);
    setError("");
    const result = await updateOrderStatus(
      orderId,
      newStatus,
      newStatus === "shipped" ? notify : false,
    );
    if (result.ok) {
      setStatus(newStatus);
      setConfirming(false);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--r-lg)",
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700 }}>Acciones</div>
        <OrderStatusBadge status={status} />
      </div>

      {error && (
        <div
          className="lds-error"
          style={{ marginBottom: 10, fontSize: 12, padding: "8px 10px" }}
        >
          {error}
        </div>
      )}

      {confirming ? (
        <div
          style={{
            padding: "12px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "var(--r-md)",
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "#991b1b" }}>
            ¿Cancelar este pedido?
          </div>
          <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 4 }}>
            Esta acción restaura el stock de los productos.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              className="lds-btn lds-btn-danger lds-btn-sm"
              onClick={() => doUpdate("cancel")}
              disabled={loading}
            >
              {loading ? "Cancelando…" : "Sí, cancelar"}
            </button>
            <button
              className="lds-btn lds-btn-ghost lds-btn-sm"
              onClick={() => setConfirming(false)}
              disabled={loading}
            >
              Volver
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            className="lds-btn lds-btn-primary lds-btn-block"
            onClick={() => doUpdate("done")}
            disabled={status === "done" || loading}
          >
            <Icon name="check" size={16} color="white" stroke={2.2} />
            {loading ? "Guardando…" : "Marcar finalizada"}
          </button>
          <button
            className="lds-btn lds-btn-secondary lds-btn-block"
            onClick={() => doUpdate("shipped")}
            disabled={status === "shipped" || status === "done" || loading}
          >
            <Icon name="box" size={16} color="var(--ink-2)" />
            {loading ? "Guardando…" : "Marcar enviado"}
          </button>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 6px",
              fontSize: 13,
              color: "var(--ink-2)",
              cursor: "pointer",
            }}
          >
            <span
              onClick={() => setNotify((v) => !v)}
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                border: "1.5px solid var(--accent)",
                background: notify ? "var(--accent)" : "var(--surface)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              {notify && (
                <Icon name="check" size={10} color="white" stroke={2.6} />
              )}
            </span>
            Notificar al cliente por email
          </label>
          <hr className="lds-divider" style={{ margin: "4px 0" }} />
          <button
            className="lds-btn lds-btn-danger lds-btn-block"
            onClick={() => setConfirming(true)}
            disabled={status === "cancel" || loading}
          >
            Cancelar pedido
          </button>
        </div>
      )}
    </div>
  );
}
