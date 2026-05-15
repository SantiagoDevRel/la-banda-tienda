"use client";

// 06 · Pago con Nequi — ported from ScreenNequi.
// Shows the amount + Nequi account, lets the customer upload the payment
// screenshot, calls the createOrder server action, then shows confirmation.

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { StoreHeader } from "@/components/StoreHeader";
import { formatCOP } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { saveLastOrder } from "@/lib/lastOrder";
import { createOrder } from "@/lib/actions/orders";
import { compressImage } from "@/lib/imageCompress";

const STEPS = [
  "Transferí el monto exacto a esta cuenta Nequi.",
  "Tomá captura del comprobante.",
  "Subila acá abajo y confirmá.",
];

interface NequiScreenProps {
  nequiNumber: string;
  nequiHolder: string;
}

export function NequiScreen({ nequiNumber, nequiHolder }: NequiScreenProps) {
  const { items, subtotal, shipping, total, ready, clear } = useCart();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Empty cart → back to cart (unless we're mid-submission).
  useEffect(() => {
    if (ready && items.length === 0 && !submitting) router.replace("/carrito");
  }, [ready, items.length, submitting, router]);

  // Revoke the object URL when it changes / on unmount.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setFileError("El archivo debe ser una imagen (JPG o PNG).");
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      setFileError("La imagen es muy pesada (máx 15 MB).");
      return;
    }
    setFileError("");
    // Se comprime en el navegador antes de subir — ahorra storage y datos.
    const compressed = await compressImage(f);
    setSelectedFile(compressed);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(compressed);
    });
    setFileName(f.name);
  }

  function copyAccount() {
    navigator.clipboard
      ?.writeText(nequiNumber.replace(/\s/g, ""))
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
  }

  async function confirmOrder() {
    if (!selectedFile || submitting) return;
    setSubmitting(true);
    setSubmitError("");

    let customerName = "";
    let customerEmail = "";
    let customerPhone = "";
    let customerAddr = "";
    let customerCity = "";

    try {
      const raw = sessionStorage.getItem("lds-checkout");
      if (raw) {
        const parsed = JSON.parse(raw);
        customerName = parsed.name ?? "";
        customerEmail = parsed.email ?? "";
        customerPhone = parsed.phone ?? "";
        customerAddr = parsed.addr ?? "";
        customerCity = parsed.city ?? "";
      }
    } catch {
      /* ignore */
    }

    // Build FormData for the screenshot
    const formData = new FormData();
    formData.set("screenshot", selectedFile);

    const cartItems = items.map((it) => ({
      productId: it.productId,
      quantity: it.qty,
      size: it.size,
    }));

    const result = await createOrder(
      {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddr,
        city: customerCity,
      },
      cartItems,
      formData,
    );

    if (!result.ok) {
      setSubmitError(result.message);
      setSubmitting(false);
      return;
    }

    // Save snapshot for confirmation page
    saveLastOrder({
      number: `#${result.orderNumber}`,
      customerName,
      items: result.items,
      subtotal: result.subtotal,
      shipping: result.shipping,
      total: result.total,
    });

    clear();
    router.push("/pedido/confirmado");
  }

  if (!ready || (items.length === 0 && !submitting)) {
    return (
      <div className="store-screen">
        <StoreHeader title="Pago con Nequi" back hideCart />
        <div style={{ flex: 1 }} />
      </div>
    );
  }

  return (
    <div className="store-screen">
      <StoreHeader title="Pago con Nequi" back hideCart />
      <div className="store-body">
        <div className="store-sheet" style={{ padding: "16px 18px 18px" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--accent)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Pago con Nequi
          </div>
          <h2 style={{ fontSize: 19, marginTop: 4 }}>
            Transferí y subí el pantallazo
          </h2>

          {/* Amount */}
          <div
            style={{
              marginTop: 16,
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)",
              padding: "18px 16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-3)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Monto a transferir
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 38,
                fontWeight: 700,
                marginTop: 4,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
              }}
            >
              {formatCOP(total)}
            </div>
          </div>

          {/* Account */}
          <div
            style={{
              marginTop: 12,
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)",
              padding: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                gap: 10,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--ink-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 600,
                  }}
                >
                  Cuenta Nequi
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    marginTop: 3,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {nequiNumber}
                </div>
              </div>
              <button
                type="button"
                onClick={copyAccount}
                style={{
                  padding: "7px 12px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--accent-tint)",
                  color: "var(--accent-ink)",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Icon
                  name="check"
                  size={14}
                  color="var(--accent-ink)"
                  stroke={2.2}
                />
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
            <hr className="lds-divider" style={{ margin: "6px 0" }} />
            <div style={{ padding: "8px 0" }}>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ink-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                A nombre de
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>
                {nequiHolder}
              </div>
            </div>
          </div>

          {/* Steps */}
          <div style={{ marginTop: 18 }}>
            {STEPS.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "8px 0",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "var(--ink-2)",
                    lineHeight: 1.45,
                    paddingTop: 2,
                  }}
                >
                  {t}
                </div>
              </div>
            ))}
          </div>

          {/* Dropzone */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            style={{ display: "none" }}
          />
          {preview ? (
            <div
              style={{
                marginTop: 14,
                border: "1px solid var(--line)",
                borderRadius: "var(--r-lg)",
                padding: 14,
                background: "var(--surface)",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              {/* user-uploaded preview */}
              <img
                src={preview}
                alt="Comprobante de pago"
                style={{
                  width: 72,
                  height: 72,
                  objectFit: "cover",
                  borderRadius: "var(--r-md)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--accent-ink)",
                  }}
                >
                  <Icon
                    name="check"
                    size={15}
                    color="var(--accent-ink)"
                    stroke={2.4}
                  />
                  Pantallazo cargado
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-3)",
                    marginTop: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fileName}
                </div>
                <button
                  type="button"
                  className="lds-btn lds-btn-secondary lds-btn-sm"
                  style={{ marginTop: 8 }}
                  onClick={() => fileRef.current?.click()}
                >
                  Cambiar imagen
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                marginTop: 14,
                width: "100%",
                border: "1.5px dashed var(--line)",
                borderRadius: "var(--r-lg)",
                padding: "22px 16px",
                background: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--accent-tint)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name="upload"
                  size={20}
                  color="var(--accent-ink)"
                  stroke={1.7}
                />
              </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                Subí el pantallazo del pago
              </span>
              <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                JPG o PNG · hasta 5 MB
              </span>
            </button>
          )}
          {fileError && <div className="lds-error">{fileError}</div>}
          {submitError && (
            <div className="lds-error" style={{ marginTop: 8 }}>
              {submitError}
            </div>
          )}

          {/* Hint */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              marginTop: 12,
              padding: "10px 12px",
              background: "var(--surface-alt)",
              borderRadius: "var(--r-md)",
            }}
          >
            <Icon name="info" size={16} color="var(--ink-2)" />
            <div
              style={{
                fontSize: 12,
                color: "var(--ink-2)",
                lineHeight: 1.4,
              }}
            >
              Verificamos el pago manualmente. Te avisamos por WhatsApp o correo
              en menos de 12 horas.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="store-cta">
          <button
            type="button"
            onClick={confirmOrder}
            disabled={!selectedFile || submitting}
            className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block"
          >
            {submitting ? "Confirmando…" : "Confirmar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
