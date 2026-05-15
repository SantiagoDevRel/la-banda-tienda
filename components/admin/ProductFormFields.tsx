"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, ProductGlyph } from "@/components/icons";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { compressImage } from "@/lib/imageCompress";
import type { GlyphKind, Product } from "@/lib/types";
import type { ProductImageRow } from "@/lib/queries";

const CATEGORIES = ["Camisetas", "Abrigos", "Accesorios"];
const GLYPHS: GlyphKind[] = ["shirt", "hoodie", "cap", "scarf", "stickers", "thermos", "longsleeve"];

interface NewImageEntry {
  file: File;
  previewUrl: string;
}

interface Props {
  editProduct?: Product | null;
  editImages?: ProductImageRow[];
}

export function ProductFormFields({ editProduct, editImages = [] }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!editProduct;

  // Form fields — pre-populate when editing
  const [name, setName] = useState(editProduct?.name ?? "");
  const [desc, setDesc] = useState(editProduct?.desc ?? "");
  const [price, setPrice] = useState(
    editProduct ? String(editProduct.price) : ""
  );
  const [stock, setStock] = useState(
    editProduct ? String(editProduct.stock) : ""
  );
  const [category, setCategory] = useState(
    editProduct?.tags[0]
      ? editProduct.tags[0].charAt(0).toUpperCase() + editProduct.tags[0].slice(1)
      : "Camisetas"
  );
  const [glyph, setGlyph] = useState<GlyphKind>(editProduct?.glyph ?? "shirt");
  const [color, setColor] = useState(editProduct?.color ?? "#1E7A3D");
  const [published, setPublished] = useState(
    editProduct ? editProduct.status !== "out" : true
  );

  // Gallery state
  // kept = existing images we're keeping (in their order)
  const [keptImages, setKeptImages] = useState<ProductImageRow[]>(editImages);
  // new = new files added by the user (not yet saved)
  const [newImages, setNewImages] = useState<NewImageEntry[]>([]);

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

  async function onImageFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    // Reset input so the same file can be selected again
    e.target.value = "";

    const entries: NewImageEntry[] = [];
    for (const f of files) {
      const compressed = await compressImage(f);
      const previewUrl = URL.createObjectURL(compressed);
      entries.push({ file: compressed, previewUrl });
    }
    setNewImages((prev) => [...prev, ...entries]);
  }

  function removeKept(id: string) {
    setKeptImages((prev) => prev.filter((img) => img.id !== id));
  }

  function removeNew(idx: number) {
    setNewImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[idx].previewUrl);
      copy.splice(idx, 1);
      return copy;
    });
  }

  function moveKept(idx: number, dir: -1 | 1) {
    setKeptImages((prev) => {
      const copy = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= copy.length) return prev;
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  }

  function moveNew(idx: number, dir: -1 | 1) {
    setNewImages((prev) => {
      const copy = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= copy.length) return prev;
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  }

  const totalImages = keptImages.length + newImages.length;

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

    // Append new image files
    for (const entry of newImages) {
      formData.append("imageFiles", entry.file);
    }

    let result: { ok: boolean; message?: string; id?: string };

    if (isEdit && editProduct) {
      // Include IDs of kept images in desired order
      formData.set("keepImageIds", JSON.stringify(keptImages.map((img) => img.id)));
      result = await updateProduct(editProduct.id, formData);
    } else {
      result = await createProduct(formData);
    }

    if (result.ok) {
      setSaved(mode);
      setTimeout(() => router.push("/admin/productos"), 1200);
    } else {
      setErrors({ general: (result as { ok: false; message: string }).message });
    }
    setSaving(false);
  }

  return (
    <div className="admin-product-form-grid">
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
            <div className="admin-form-row-2col-sm">
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
              {saved === "draft" ? "Borrador guardado" : isEdit ? "Producto actualizado" : "Producto publicado"}
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
            {saving ? "Publicando…" : isEdit ? "Actualizar producto" : "Publicar producto"}
          </button>
        </div>
      </div>

      {/* Right: gallery + visibility */}
      <div className="admin-product-form-sidebar" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Multi-image gallery manager */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-lg)",
            padding: 20,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
            Fotos del producto
          </div>

          {/* Grid of thumbnails */}
          {totalImages > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {/* Kept images */}
              {keptImages.map((img, idx) => (
                <GalleryThumb
                  key={img.id}
                  src={img.url}
                  label={idx === 0 ? "Portada" : undefined}
                  onRemove={() => removeKept(img.id)}
                  onMoveUp={idx > 0 ? () => moveKept(idx, -1) : undefined}
                  onMoveDown={
                    idx < keptImages.length - 1 || newImages.length > 0
                      ? () => moveKept(idx, 1)
                      : undefined
                  }
                />
              ))}

              {/* New images */}
              {newImages.map((entry, idx) => (
                <GalleryThumb
                  key={entry.previewUrl}
                  src={entry.previewUrl}
                  label={keptImages.length === 0 && idx === 0 ? "Portada" : undefined}
                  isNew
                  onRemove={() => removeNew(idx)}
                  onMoveUp={
                    idx > 0 || keptImages.length > 0
                      ? () => moveNew(idx, -1)
                      : undefined
                  }
                  onMoveDown={idx < newImages.length - 1 ? () => moveNew(idx, 1) : undefined}
                />
              ))}
            </div>
          )}

          {/* Empty state / glyph preview */}
          {totalImages === 0 && (
            <div
              style={{
                aspectRatio: "1 / 1",
                background: "var(--surface-alt)",
                borderRadius: "var(--r-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <ProductGlyph kind={glyph} color={color} bg={false} />
            </div>
          )}

          {/* Add photos button */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onImageFiles}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="lds-btn lds-btn-secondary lds-btn-sm lds-btn-block"
            onClick={() => fileRef.current?.click()}
          >
            <Icon name="upload" size={15} color="var(--ink-2)" />
            Agregar fotos
          </button>
          <div
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              marginTop: 8,
              textAlign: "center",
            }}
          >
            JPG o PNG. La primera foto es la portada.
          </div>
        </div>

        {/* Visibility */}
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

// ── Gallery thumbnail ─────────────────────────────────────────────────────────

function GalleryThumb({
  src,
  label,
  isNew,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  src: string;
  label?: string;
  isNew?: boolean;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        borderRadius: "var(--r-sm)",
        overflow: "hidden",
        background: "var(--surface-alt)",
        border: isNew ? "1.5px dashed var(--accent)" : "1px solid var(--line)",
      }}
    >
      <img
        src={src}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* Label badge */}
      {label && (
        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: 4,
            background: "rgba(0,0,0,0.65)",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 5px",
            borderRadius: 3,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        title="Quitar foto"
        style={{
          position: "absolute",
          top: 3,
          right: 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.65)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <Icon name="close" size={10} color="#fff" stroke={2.4} />
      </button>

      {/* Move up / down */}
      <div
        style={{
          position: "absolute",
          top: 3,
          left: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {onMoveUp && (
          <button
            type="button"
            onClick={onMoveUp}
            title="Mover izquierda"
            style={{
              width: 18,
              height: 18,
              borderRadius: 3,
              background: "rgba(0,0,0,0.55)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Icon name="arrowup" size={10} color="#fff" stroke={2} />
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            onClick={onMoveDown}
            title="Mover derecha"
            style={{
              width: 18,
              height: 18,
              borderRadius: 3,
              background: "rgba(0,0,0,0.55)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Icon name="arrowdown" size={10} color="#fff" stroke={2} />
          </button>
        )}
      </div>
    </div>
  );
}
