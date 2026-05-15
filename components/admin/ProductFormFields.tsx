"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, ProductGlyph } from "@/components/icons";
import { createProduct } from "@/lib/actions/products";
import type { GlyphKind } from "@/lib/types";

const CATEGORIES = ["Camisetas", "Abrigos", "Accesorios"];
const GLYPHS: GlyphKind[] = ["shirt", "hoodie", "cap", "scarf", "stickers", "thermos", "longsleeve"];

export function ProductFormFields() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Camisetas");
  const [glyph, setGlyph] = useState<GlyphKind>("shirt");
  const [color, setColor] = useState("#1E7A3D");
  const [published, setPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<null | "draft" | "published">(null);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "El nombre es obligatorio.";
    if (!price.trim()) e.price = "El precio es obligatorio.";
    else if (isNaN(Number(price.replace(/\./g, "").replace(",", "."))))
      e.price = "Ingresá un precio válido.";
    if (!stock.trim()) e.stock = "El stock es obligatorio.";
    else if (isNaN(Number(stock)) || Number(stock) < 0)
      e.stock = "Ingresá un número entero positivo.";
    return e;
  }

  function onImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImagePreview(url);
  }

  async function handleSave(mode: "draft" | "published") {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSaving(true);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", desc);
    formData.set("price", price);
    formData.set("stock", stock);
    formData.set("category", category);
    formData.set("glyph", glyph);
    formData.set("color", color);
    formData.set("isActive", mode === "published" ? "true" : "false");
    if (imageFile) formData.set("imageFile", imageFile);

    const result = await createProduct(formData);

    if (result.ok) {
      setSaved(mode);
      setTimeout(() => router.push("/admin/productos"), 1200);
    } else {
      setErrors({ general: result.message });
    }
    setSaving(false);
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
            {errors.general && (
              <div className="lds-error" style={{ fontSize: 12, padding: "8px 10px" }}>
                {errors.general}
              </div>
            )}
            <div>
              <label className="lds-label">Nombre del producto</label>
              <input
                className="lds-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
                placeholder="Ej: Camiseta Manga Larga"
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
                placeholder="Describí el producto: material, tallas, detalles."
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
                  placeholder="105.000"
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
                  placeholder="24"
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
            <div>
              <label className="lds-label">Ícono (glyph)</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {GLYPHS.map((g) => {
                  const active = glyph === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGlyph(g)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "var(--r-sm)",
                        border: active ? "2px solid var(--accent)" : "1px solid var(--line)",
                        background: active ? "var(--accent-tint)" : "var(--surface-alt)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={g}
                    >
                      <ProductGlyph kind={g} color={color} bare style={{ width: 28, height: 28 }} />
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="lds-label">Color del ícono</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  width: 40,
                  height: 32,
                  padding: 2,
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r-sm)",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
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
            disabled={saving}
          >
            {saving ? "Guardando…" : "Guardar borrador"}
          </button>
          <button
            type="button"
            className="lds-btn lds-btn-primary lds-btn-sm"
            onClick={() => handleSave("published")}
            disabled={saving}
          >
            {saving ? "Publicando…" : "Publicar producto"}
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
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <ProductGlyph kind={glyph} color={color} bg={false} />
              )}
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
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "var(--r-sm)",
                    border: "none",
                    background: "rgba(29, 33, 37, 0.85)",
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
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onImageFile}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="lds-btn lds-btn-secondary lds-btn-sm lds-btn-block"
              style={{ marginTop: 10 }}
              onClick={() => fileRef.current?.click()}
            >
              <Icon name="upload" size={15} color="var(--ink-2)" />
              {imageFile ? "Cambiar imagen" : "Subir imagen"}
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
