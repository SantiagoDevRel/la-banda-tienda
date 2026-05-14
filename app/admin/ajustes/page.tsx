// Admin settings — ScreenSettings
import { AdminShell } from "@/components/AdminShell";
import { Icon } from "@/components/icons";
import { SETTINGS } from "@/lib/data";

export default function AjustesPage() {
  return (
    <AdminShell
      section="settings"
      page={{
        title: "Ajustes de la tienda",
        subtitle:
          "Datos públicos, cuenta para cobrar y políticas de envío.",
        action: (
          <button className="lds-btn lds-btn-primary lds-btn-sm">
            Guardar cambios
          </button>
        ),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 840,
        }}
      >
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
                defaultValue={SETTINGS.storeName}
              />
            </div>
            <div>
              <label className="lds-label">WhatsApp de contacto</label>
              <input
                className="lds-input"
                defaultValue={SETTINGS.whatsapp}
              />
            </div>
          </div>
        </div>

        {/* Nequi */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-lg)",
            padding: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "var(--r-sm)",
                background:
                  "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.05em",
              }}
            >
              NQ
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Cuenta Nequi</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                Los clientes verán estos datos al pagar.
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
              <label className="lds-label">Número de cuenta</label>
              <input
                className="lds-input lds-num"
                defaultValue={SETTINGS.nequiNumber}
              />
            </div>
            <div>
              <label className="lds-label">Nombre del titular</label>
              <input
                className="lds-input"
                defaultValue={SETTINGS.nequiHolder}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              background: "var(--accent-tint)",
              borderRadius: "var(--r-md)",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <Icon name="info" size={16} color="var(--accent-ink)" />
            <div
              style={{
                fontSize: 12,
                color: "var(--accent-ink)",
                lineHeight: 1.45,
                textWrap: "pretty",
              }}
            >
              Asegurate de que el número y el nombre coincidan exactamente con
              tu cuenta Nequi. Los clientes transfieren a esta cuenta
              directamente.
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
              rows={3}
              defaultValue={SETTINGS.shippingInfo}
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
              <input className="lds-input lds-num" defaultValue="12.000" />
            </div>
            <div>
              <label className="lds-label">Compra mínima envío gratis</label>
              <input className="lds-input lds-num" defaultValue="200.000" />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
