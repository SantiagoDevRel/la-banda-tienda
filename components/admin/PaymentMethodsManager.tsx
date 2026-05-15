"use client";

// Admin — payment methods CRUD manager.
// Embedded in the Ajustes page below the store/shipping sections.

import { useState } from "react";
import { Icon } from "@/components/icons";
import {
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "@/lib/actions/payment-methods";
import type { PaymentMethod } from "@/lib/queries";

const KIND_LABELS: Record<string, string> = {
  nequi: "Nequi",
  bank: "Banco",
  other: "Otro",
};

interface MethodFormState {
  label: string;
  kind: string;
  account_number: string;
  holder: string;
  instructions: string;
  is_active: boolean;
  sort_order: string;
}

const DEFAULT_FORM: MethodFormState = {
  label: "",
  kind: "nequi",
  account_number: "",
  holder: "",
  instructions: "",
  is_active: true,
  sort_order: "0",
};

function methodToForm(m: PaymentMethod): MethodFormState {
  return {
    label: m.label,
    kind: m.kind,
    account_number: m.account_number,
    holder: m.holder,
    instructions: m.instructions ?? "",
    is_active: m.is_active,
    sort_order: String(m.sort_order),
  };
}

function MethodForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: MethodFormState;
  onSave: (f: MethodFormState) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<MethodFormState>(initial);

  function set(k: keyof MethodFormState, v: string | boolean) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    await onSave(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <div>
          <label className="lds-label">Etiqueta (visible al cliente)</label>
          <input
            className="lds-input"
            required
            value={form.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder="Ej: Nequi, Bancolombia"
          />
        </div>
        <div>
          <label className="lds-label">Tipo</label>
          <select
            className="lds-select"
            value={form.kind}
            onChange={(e) => set("kind", e.target.value)}
          >
            <option value="nequi">Nequi</option>
            <option value="bank">Banco</option>
            <option value="other">Otro</option>
          </select>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <div>
          <label className="lds-label">Número / cuenta</label>
          <input
            className="lds-input lds-num"
            required
            value={form.account_number}
            onChange={(e) => set("account_number", e.target.value)}
            placeholder="Ej: 3001234567"
          />
        </div>
        <div>
          <label className="lds-label">Titular</label>
          <input
            className="lds-input"
            required
            value={form.holder}
            onChange={(e) => set("holder", e.target.value)}
            placeholder="Nombre completo"
          />
        </div>
      </div>
      <div>
        <label className="lds-label">Instrucciones adicionales (opcional)</label>
        <textarea
          className="lds-textarea"
          rows={2}
          value={form.instructions}
          onChange={(e) => set("instructions", e.target.value)}
          placeholder="Ej: Cuenta de ahorros · Bancolombia"
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "var(--ink-2)",
              cursor: "pointer",
            }}
          >
            <span
              onClick={() => set("is_active", !form.is_active)}
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                border: "1.5px solid var(--accent)",
                background: form.is_active ? "var(--accent)" : "var(--surface)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              {form.is_active && (
                <Icon name="check" size={10} color="white" stroke={2.6} />
              )}
            </span>
            Activo (visible al cliente)
          </label>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="lds-btn lds-btn-ghost lds-btn-sm"
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="lds-btn lds-btn-primary lds-btn-sm"
            disabled={saving}
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function PaymentMethodsManager({
  initialMethods,
}: {
  initialMethods: PaymentMethod[];
}) {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(form: MethodFormState) {
    setSaving(true);
    setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) =>
      fd.set(k, typeof v === "boolean" ? String(v) : v),
    );
    const result = await createPaymentMethod(fd);
    if (result.ok) {
      // Optimistic: refresh by re-fetching (revalidatePath will handle it on
      // the server; here we just close the form and the page will revalidate).
      setAdding(false);
      // Naively append with temp data — page will refresh on next navigation
      setMethods((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          label: form.label,
          kind: form.kind,
          account_number: form.account_number,
          holder: form.holder,
          instructions: form.instructions,
          is_active: form.is_active,
          sort_order: parseInt(form.sort_order, 10),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } else {
      setError(result.message);
    }
    setSaving(false);
  }

  async function handleUpdate(id: string, form: MethodFormState) {
    setSaving(true);
    setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) =>
      fd.set(k, typeof v === "boolean" ? String(v) : v),
    );
    const result = await updatePaymentMethod(id, fd);
    if (result.ok) {
      setEditingId(null);
      setMethods((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                label: form.label,
                kind: form.kind,
                account_number: form.account_number,
                holder: form.holder,
                instructions: form.instructions,
                is_active: form.is_active,
                sort_order: parseInt(form.sort_order, 10),
                updated_at: new Date().toISOString(),
              }
            : m,
        ),
      );
    } else {
      setError(result.message);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setSaving(true);
    setError("");
    const result = await deletePaymentMethod(id);
    if (result.ok) {
      setDeletingId(null);
      setMethods((prev) => prev.filter((m) => m.id !== id));
    } else {
      setError(result.message);
    }
    setSaving(false);
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--r-lg)",
        padding: 22,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Medios de pago</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
            Los clientes verán estas cuentas al finalizar su compra.
          </div>
        </div>
        {!adding && (
          <button
            type="button"
            className="lds-btn lds-btn-secondary lds-btn-sm"
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
          >
            <Icon name="plus" size={14} color="var(--ink-2)" />
            Agregar
          </button>
        )}
      </div>

      {error && (
        <div
          className="lds-error"
          style={{ marginBottom: 12, padding: "8px 12px", fontSize: 13 }}
        >
          {error}
        </div>
      )}

      {/* Existing methods list */}
      {methods.length === 0 && !adding && (
        <div
          style={{
            padding: "20px 0",
            textAlign: "center",
            fontSize: 13,
            color: "var(--ink-3)",
          }}
        >
          No hay medios de pago configurados.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {methods.map((m) => (
          <div key={m.id}>
            {editingId === m.id ? (
              <div
                style={{
                  background: "var(--surface-alt)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r-md)",
                  padding: 16,
                }}
              >
                <MethodForm
                  initial={methodToForm(m)}
                  onSave={(form) => handleUpdate(m.id, form)}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              </div>
            ) : deletingId === m.id ? (
              <div
                style={{
                  background: "rgba(185, 28, 28, 0.1)",
                  border: "1px solid rgba(185, 28, 28, 0.3)",
                  borderRadius: "var(--r-md)",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 13, color: "#f87171" }}>
                  ¿Eliminar <strong>{m.label}</strong>?
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="lds-btn lds-btn-ghost lds-btn-sm"
                    onClick={() => setDeletingId(null)}
                    disabled={saving}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    disabled={saving}
                    style={{
                      padding: "6px 12px",
                      fontSize: 13,
                      fontWeight: 600,
                      borderRadius: "var(--r-sm)",
                      background: "rgba(185, 28, 28, 0.18)",
                      border: "1px solid rgba(185, 28, 28, 0.4)",
                      color: "#f87171",
                      cursor: "pointer",
                    }}
                  >
                    {saving ? "…" : "Sí, eliminar"}
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "var(--surface-alt)",
                  border: "1px solid var(--line-2)",
                  borderRadius: "var(--r-md)",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--r-sm)",
                    background:
                      m.kind === "nequi"
                        ? "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)"
                        : m.kind === "bank"
                          ? "linear-gradient(135deg, #1e7a3d 0%, #155a2b 100%)"
                          : "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                    color: "white",
                    letterSpacing: "0.02em",
                    flexShrink: 0,
                  }}
                >
                  {m.kind === "nequi"
                    ? "NQ"
                    : m.kind === "bank"
                      ? "BK"
                      : "PM"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {m.label}
                    <span
                      style={{
                        fontSize: 10,
                        padding: "1px 6px",
                        borderRadius: "var(--r-full)",
                        background: m.is_active
                          ? "var(--accent-tint)"
                          : "var(--surface)",
                        color: m.is_active ? "var(--accent-ink)" : "var(--ink-3)",
                        fontWeight: 600,
                        border: "1px solid",
                        borderColor: m.is_active
                          ? "transparent"
                          : "var(--line)",
                      }}
                    >
                      {m.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--ink-3)",
                      marginTop: 2,
                    }}
                  >
                    {m.account_number} · {m.holder}
                    {m.instructions ? ` · ${m.instructions}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(m.id);
                      setAdding(false);
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "var(--r-sm)",
                      border: "1px solid var(--line)",
                      background: "var(--surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    title="Editar"
                  >
                    <Icon name="edit" size={13} color="var(--ink-2)" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(m.id)}
                    style={{
                      width: 28,
                      height: 28,
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
                    <Icon name="trash" size={13} color="#f87171" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new form */}
      {adding && (
        <div
          style={{
            background: "var(--surface-alt)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-md)",
            padding: 16,
            marginTop: methods.length > 0 ? 12 : 0,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
            Nuevo medio de pago
          </div>
          <MethodForm
            initial={DEFAULT_FORM}
            onSave={handleCreate}
            onCancel={() => setAdding(false)}
            saving={saving}
          />
        </div>
      )}
    </div>
  );
}
