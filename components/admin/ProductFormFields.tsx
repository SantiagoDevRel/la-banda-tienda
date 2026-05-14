"use client";

import { useState } from "react";
import { Icon, ProductGlyph } from "@/components/icons";

const CATEGORIES = ["Camisetas", "Abrigos", "Accesorios"];

export function ProductFormFields() {
  const [name, setName] = useState("Camiseta Manga Larga Entrenamiento");
  const [desc, setDesc] = useState(
    "Camiseta manga larga térmica para entrenamiento, tela elástica con tecnología antitranspirante. Talles S a XXL, estampado en cuello y manga."
  );
  const [price, setPrice] = useState("105.000");
  const [stock, setStock] = useState("24");
  const [category, setCategory] = useState("Camisetas");
  const [published, setPublished] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<null | "draft" | "published">(null);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "El nombre es obligatorio.";
    if (!price.trim()) e.price = "El precio es obligatorio.";
    else if (isNaN(Number(price.replace(/\./g, "").replace(",", "."))))
      e.price = "Ingresá un precio válido.";
    if (!stock.trim()) e.stock = "El stock es obligatorio.";
    else if (isNaN(Number(stock))) e.stock = "Ingresá un número entero.";
    return e;
  }

  function handleSave(mode: "draft" | "published") {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSaved(mode);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 16,
        maxWidth: 980,
      }}
    >
      {/* Left: main info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-lg)",
            padding: 20,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700 }}>Información básica</div>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div>
              <label className="lds-label">Nombre del producto</label>
              <input
                className="lds-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <div className="lds-error" style={{ marginTop: 4, fontSize: 12 }}>
                  {errors.name}
                </div>
              )}
            </div>
            <div>
              <label className="lds-label">Descripción</label>
              <textarea
                className="lds-textarea"
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label className="lds-label">Precio (COP)</label>
                <input
                  className="lds-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  aria-invalid={!!errors.price}
                />
                {errors.price && (
                  <div
                    className="lds-error"
                    style={{ marginTop: 4, fontSize: 12 }}
                  >
                    {errors.price}
                  </div>
                )}
              </div>
              <div>
                <label className="lds-label">Stock disponible</label>
                <input
                  className="lds-input"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  aria-invalid={!!errors.stock}
                />
                {errors.stock && (
                  <div
                    className="lds-error"
                    style={{ marginTop: 4, fontSize: 12 }}
                  >
                    {errors.stock}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="lds-label">Categoría</label>
              <div style={{ display: "flex", gap: 8 }}>
                {CATEGORIES.map((c) => {
                  const active = category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      style={{
                        padding: "9px 14px",
                        borderRadius: "var(--r-full)",
                        background: active
                          ? "var(--accent-tint)"
                          : "var(--surface)",
                        color: active ? "var(--accent-ink)" : "var(--ink-2)",
                        border: active
                          ? "1.5px solid var(--accent)"
                          : "1px solid var(--line)",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons (bottom of left column) */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
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
              {saved === "draft" ? "Borrador guardado" : "Producto publicado"}
            </div>
          )}
          <button
            type="button"
            className="lds-btn lds-btn-secondary lds-btn-sm"
            onClick={() => handleSave("draft")}
          >
            Guardar borrador
          </button>
          <button
            type="button"
            className="lds-btn lds-btn-primary lds-btn-sm"
            onClick={() => handleSave("published")}
          >
            Publicar producto
          </button>
        </div>
      </div>

      {/* Right: image + visibility */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-lg)",
            padding: 20,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700 }}>Imagen del producto</div>
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                aspectRatio: "1 / 1",
                background: "var(--surface-alt)",
                borderRadius: "var(--r-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <ProductGlyph kind="longsleeve" color="#16A34A" bg={false} />
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 4,
                }}
              >
                <button
                  type="button"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "var(--r-sm)",
                    border: "none",
                    background: "rgba(255,255,255,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Icon name="edit" size={14} color="var(--ink)" />
                </button>
              </div>
            </div>
            <button
              type="button"
              className="lds-btn lds-btn-secondary lds-btn-sm lds-btn-block"
              style={{ marginTop: 10 }}
            >
              <Icon name="upload" size={15} color="var(--ink-2)" />
              Cambiar imagen
            </button>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-3)",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              JPG o PNG. Cuadrada, mínimo 800 × 800 px.
            </div>
          </div>
        </div>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-lg)",
            padding: 20,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700 }}>Visibilidad</div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                {published ? "Publicado" : "Borrador"}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                {published
                  ? "Visible en el catálogo"
                  : "No visible para los clientes"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPublished((v) => !v)}
              style={{
                width: 40,
                height: 22,
                background: published ? "var(--accent)" : "var(--line)",
                borderRadius: 11,
                padding: 2,
                display: "flex",
                justifyContent: published ? "flex-end" : "flex-start",
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              aria-label="Cambiar visibilidad"
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "white",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
