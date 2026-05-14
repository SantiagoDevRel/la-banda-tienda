"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { OrderStatusBadge } from "@/components/ui";
import type { OrderStatus } from "@/lib/types";

export function OrderActions({ initialStatus }: { initialStatus: OrderStatus }) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [notify, setNotify] = useState(true);
  const [confirming, setConfirming] = useState(false);

  function markDone() {
    setStatus("done");
    setConfirming(false);
  }

  function markShipped() {
    setStatus("shipped");
    setConfirming(false);
  }

  function cancel() {
    setStatus("cancel");
    setConfirming(false);
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
            Esta acción no se puede deshacer.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              className="lds-btn lds-btn-danger lds-btn-sm"
              onClick={cancel}
            >
              Sí, cancelar
            </button>
            <button
              className="lds-btn lds-btn-ghost lds-btn-sm"
              onClick={() => setConfirming(false)}
            >
              Volver
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            className="lds-btn lds-btn-primary lds-btn-block"
            onClick={markDone}
            disabled={status === "done"}
          >
            <Icon name="check" size={16} color="white" stroke={2.2} />
            Marcar finalizada
          </button>
          <button
            className="lds-btn lds-btn-secondary lds-btn-block"
            onClick={markShipped}
            disabled={status === "shipped" || status === "done"}
          >
            <Icon name="box" size={16} color="var(--ink-2)" />
            Marcar enviado
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
            disabled={status === "cancel"}
          >
            Cancelar pedido
          </button>
        </div>
      )}
    </div>
  );
}
