"use client";

// Chulito de "pago validado" reutilizable. Dos variantes:
//  - variant="compact" → checkbox chiquito para la lista de pedidos.
//  - variant="card"    → card con label + timestamp para el detalle.
//
// Al marcar (false→true) el RPC dispara el correo al cliente con la copia
// de "ya validamos tu pago". Si desmarca y vuelve a marcar, se reenvía.

import { useState, useTransition } from "react";
import { Icon } from "@/components/icons";
import { setPaymentValidated } from "@/lib/actions/admin";
import { formatBogota } from "@/lib/time";

export function PaymentValidatedToggle({
  orderId,
  initialValidated,
  initialValidatedAt,
  variant = "card",
}: {
  orderId: string;
  initialValidated: boolean;
  initialValidatedAt?: string | null;
  variant?: "compact" | "card";
}) {
  const [validated, setValidated] = useState(initialValidated);
  const [validatedAt, setValidatedAt] = useState<string | null>(
    initialValidatedAt ?? null,
  );
  const [emailedNow, setEmailedNow] = useState(false);
  const [emailFail, setEmailFail] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function toggle(next: boolean) {
    if (pending) return;
    setError("");
    setEmailedNow(false);
    setEmailFail("");
    // Optimistic
    setValidated(next);
    if (next) setValidatedAt(new Date().toISOString());
    else setValidatedAt(null);

    startTransition(async () => {
      const res = await setPaymentValidated(orderId, next);
      if (!res.ok) {
        // Rollback
        setValidated(!next);
        setValidatedAt(initialValidatedAt ?? null);
        setError(res.message);
        return;
      }
      if (res.email === "sent") {
        setEmailedNow(true);
        setTimeout(() => setEmailedNow(false), 6000);
      } else if (typeof res.email === "object" && res.email.failed) {
        setEmailFail(res.email.reason);
      }
    });
  }

  if (variant === "compact") {
    return (
      <label
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggle(!validated);
        }}
        title={
          emailFail
            ? `Validado pero el correo falló: ${emailFail}`
            : validated
              ? `Pago validado${validatedAt ? ` · ${formatBogota(validatedAt)}` : ""} · click para desmarcar`
              : "Marcar pago validado (envía correo al cliente)"
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: 5,
          border: validated
            ? "1.5px solid var(--accent)"
            : "1.5px solid var(--ink-4)",
          background: validated ? "var(--accent)" : "var(--surface)",
          cursor: pending ? "wait" : "pointer",
          flexShrink: 0,
          opacity: pending ? 0.55 : 1,
          transition: "background 120ms, border-color 120ms",
        }}
      >
        {validated && <Icon name="check" size={14} color="white" stroke={2.6} />}
      </label>
    );
  }

  // ── Card variant (detail page) ─────────────────────────────────────────
  return (
    <div
      style={{
        background: "var(--surface)",
        border: validated
          ? "1px solid var(--accent)"
          : "1px solid var(--line)",
        borderRadius: "var(--r-lg)",
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Validación de pago</div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-3)",
              marginTop: 2,
            }}
          >
            {validated
              ? validatedAt
                ? `Validado · ${formatBogota(validatedAt)}`
                : "Validado"
              : "Pendiente de revisión"}
          </div>
        </div>

        {/* Toggle switch */}
        <button
          type="button"
          onClick={() => toggle(!validated)}
          disabled={pending}
          aria-pressed={validated}
          style={{
            position: "relative",
            width: 44,
            height: 26,
            borderRadius: 999,
            border: "none",
            background: validated ? "var(--accent)" : "var(--ink-4)",
            cursor: pending ? "wait" : "pointer",
            padding: 0,
            flexShrink: 0,
            transition: "background 140ms",
            opacity: pending ? 0.6 : 1,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 3,
              left: validated ? 21 : 3,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "white",
              transition: "left 140ms",
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          />
        </button>
      </div>

      {validated && !emailFail && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: "var(--accent-tint)",
            borderRadius: "var(--r-md)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontSize: 12,
            color: "var(--accent-ink)",
          }}
        >
          <Icon name="check" size={14} color="var(--accent-ink)" stroke={2.4} />
          <span>
            {emailedNow
              ? "Correo enviado al cliente ahora mismo."
              : "Pago validado."}
          </span>
        </div>
      )}

      {emailFail && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: "rgba(185, 28, 28, 0.10)",
            border: "1px solid rgba(185, 28, 28, 0.30)",
            borderRadius: "var(--r-md)",
            fontSize: 12,
            color: "#991b1b",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>
            El pago quedó validado, pero el correo no salió.
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
            {emailFail}
          </div>
        </div>
      )}

      {error && (
        <div
          className="lds-error"
          style={{ marginTop: 10, fontSize: 12, padding: "8px 10px" }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
