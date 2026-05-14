"use client";

// 05 · Checkout — ported from ScreenCheckout.
// Order summary + customer form with validation. Saves data to sessionStorage
// and continues to the Nequi payment screen.

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Money } from "@/components/ui";
import { StoreHeader } from "@/components/StoreHeader";
import { formatCOP } from "@/lib/data";
import { useCart } from "@/lib/cart";

interface FormState {
  name: string;
  email: string;
  phone: string;
  addr: string;
  city: string;
}
type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { name: "", email: "", phone: "", addr: "", city: "" };

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, ready } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  // Empty cart → back to cart.
  useEffect(() => {
    if (ready && items.length === 0) router.replace("/carrito");
  }, [ready, items.length, router]);

  // Prefill if the customer already started checkout.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lds-checkout");
      if (raw) setForm({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Ingresá tu nombre completo.";
    if (!form.email.trim()) e.email = "Ingresá tu correo.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Ese correo no parece válido.";
    if (!form.addr.trim()) e.addr = "Ingresá la dirección de envío.";
    if (!form.city.trim()) e.city = "Ingresá la ciudad.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    try {
      sessionStorage.setItem("lds-checkout", JSON.stringify(form));
    } catch {
      /* ignore */
    }
    router.push("/checkout/pago");
  }

  if (!ready || items.length === 0) {
    return (
      <div className="store-screen">
        <StoreHeader title="Tus datos" back />
        <div style={{ flex: 1, background: "var(--bg)" }} />
      </div>
    );
  }

  return (
    <div className="store-screen">
      <StoreHeader title="Tus datos" back />
      <form
        onSubmit={submit}
        className="store-body"
        style={{ background: "var(--bg)" }}
        noValidate
      >
        <div style={{ flex: 1, padding: "18px 16px 16px" }}>
          {/* Order summary */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line-2)",
              borderRadius: "var(--r-lg)",
              padding: 14,
              marginBottom: 18,
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
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink-2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Tu pedido
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
                {items.length} {items.length === 1 ? "artículo" : "artículos"}
              </div>
            </div>
            {items.map((it) => (
              <div
                key={`${it.productId}-${it.size ?? ""}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  padding: "5px 0",
                  color: "var(--ink-2)",
                  gap: 12,
                }}
              >
                <span style={{ flex: 1 }}>
                  {it.qty}× {it.product.name}
                </span>
                <span className="lds-num" style={{ color: "var(--ink)" }}>
                  {formatCOP(it.lineTotal)}
                </span>
              </div>
            ))}
            <hr className="lds-divider" style={{ margin: "10px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "var(--ink-3)",
              }}
            >
              <span>Envío</span>
              <span className="lds-num">
                {shipping === 0 ? "Gratis" : formatCOP(shipping)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 10,
                alignItems: "baseline",
              }}
            >
              <span style={{ fontWeight: 600 }}>Total</span>
              <Money value={total} weight={700} />
            </div>
          </div>

          {/* Form */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <Field
              label="Nombre completo"
              value={form.name}
              onChange={(v) => set("name", v)}
              error={errors.name}
              placeholder="Tu nombre y apellido"
              autoComplete="name"
            />
            <Field
              label="Correo electrónico"
              value={form.email}
              onChange={(v) => set("email", v)}
              error={errors.email}
              placeholder="tucorreo@ejemplo.com"
              type="email"
              autoComplete="email"
            />
            <Field
              label="Teléfono"
              optional
              value={form.phone}
              onChange={(v) => set("phone", v)}
              placeholder="300 000 0000"
              type="tel"
              autoComplete="tel"
            />
            <div>
              <label className="lds-label">Dirección de envío</label>
              <input
                className="lds-input"
                value={form.addr}
                onChange={(e) => set("addr", e.target.value)}
                placeholder="Calle, número, apto"
                aria-invalid={!!errors.addr}
                autoComplete="address-line1"
              />
              <input
                className="lds-input"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Ciudad, departamento"
                aria-invalid={!!errors.city}
                autoComplete="address-level2"
                style={{ marginTop: 8 }}
              />
              {(errors.addr || errors.city) && (
                <div className="lds-error">{errors.addr || errors.city}</div>
              )}
            </div>
          </div>
        </div>

        <div className="store-cta">
          <button
            type="submit"
            className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block"
          >
            Continuar al pago
            <Icon name="chevright" size={18} color="#fff" stroke={2} />
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  optional,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  optional?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="lds-label">
        {label}{" "}
        {optional && (
          <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>
            (opcional)
          </span>
        )}
      </label>
      <input
        className="lds-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        autoComplete={autoComplete}
      />
      {error && <div className="lds-error">{error}</div>}
    </div>
  );
}
