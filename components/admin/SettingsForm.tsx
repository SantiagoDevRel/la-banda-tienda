"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { saveSettings } from "@/lib/actions/settings";

interface SettingsFormProps {
  settings: {
    storeName: string;
    whatsapp: string;
    shippingInfo: string;
    shippingCost: number;
    freeShippingMin: number;
  };
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const formData = new FormData(ev.currentTarget);
    const result = await saveSettings(formData);

    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.message);
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 840,
        }}
      >
        {error && (
          <div className="lds-error" style={{ padding: "10px 14px", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Store */}
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
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Tienda</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                Visible para los clientes en el storefront.
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div>
              <label className="lds-label">Nombre de la tienda</label>
              <input
                className="lds-input"
                name="storeName"
                defaultValue={settings.storeName}
              />
            </div>
            <div>
              <label className="lds-label">WhatsApp de contacto</label>
              <input
                className="lds-input"
                name="whatsapp"
                defaultValue={settings.whatsapp}
              />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-lg)",
            padding: 22,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700 }}>Envíos</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
            Información que se muestra en el checkout.
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="lds-label">Texto informativo</label>
            <textarea
              className="lds-textarea"
              name="shippingInfo"
              rows={3}
              defaultValue={settings.shippingInfo}
            />
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div>
              <label className="lds-label">Costo de envío estándar</label>
              <input
                className="lds-input lds-num"
                name="shippingCost"
                defaultValue={settings.shippingCost.toString()}
              />
            </div>
            <div>
              <label className="lds-label">Compra mínima envío gratis</label>
              <input
                className="lds-input lds-num"
                name="freeShippingMin"
                defaultValue={settings.freeShippingMin.toString()}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          {saved && (
            <div
              style={{
                padding: "8px 14px",
                borderRadius: "var(--r-sm)",
                background: "var(--accent-tint)",
                color: "var(--accent-ink)",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon name="check" size={14} color="var(--accent-ink)" stroke={2.2} />
              Cambios guardados
            </div>
          )}
          <button
            type="submit"
            className="lds-btn lds-btn-primary lds-btn-sm"
            disabled={saving}
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </form>
  );
}
