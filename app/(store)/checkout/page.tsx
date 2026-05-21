"use client";

// 05 · Checkout — customer-data form.
// El cliente elige Departamento + Ciudad primero (autocomplete Colombia).
// "Recoger en Medellín" SOLO aparece cuando eligió Antioquia + Medellín
// exactamente (nada de Itagüí, Envigado, etc.). Default: Envío $15.000.
// Guarda en sessionStorage y continúa al pago.

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";
import { Money } from "@/components/ui";
import { StoreHeader } from "@/components/StoreHeader";
import { Combobox } from "@/components/storefront/Combobox";
import { formatCOP } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { DEPARTAMENTOS, ciudadesDe } from "@/lib/colombia";

type DeliveryMethod = "shipping" | "pickup";

interface FormState {
  name: string;
  email: string;
  phone: string;
  addr: string;
  city: string;
  department: string;
  deliveryMethod: DeliveryMethod;
}

type ErrorFields = "name" | "email" | "phone" | "addr" | "city" | "department";
type Errors = Partial<Record<ErrorFields, string>>;

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  addr: "",
  city: "",
  department: "",
  deliveryMethod: "shipping",
};

export default function CheckoutPage() {
  const { items, subtotal, shippingCost, freeShippingMin, ready } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  // Recoger solo es elegible en Medellín (Antioquia) exactamente.
  const pickupEligible =
    form.department === "Antioquia" && form.city === "Medellín";
  const isPickup = form.deliveryMethod === "pickup" && pickupEligible;
  const isShipping = !isPickup;

  const shipping = isPickup
    ? 0
    : subtotal >= freeShippingMin
      ? 0
      : shippingCost;
  const total = subtotal + shipping;

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

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key as ErrorFields]: undefined }));
  }

  function setDepartment(dep: string) {
    // cambiar de departamento invalida Medellín → vuelve a envío
    setForm((f) => ({ ...f, department: dep, city: "", deliveryMethod: "shipping" }));
    setErrors((e) => ({ ...e, department: undefined, city: undefined }));
  }

  function setCity(city: string) {
    setForm((f) => {
      const stillPickup =
        f.deliveryMethod === "pickup" &&
        f.department === "Antioquia" &&
        city === "Medellín";
      return { ...f, city, deliveryMethod: stillPickup ? "pickup" : "shipping" };
    });
    setErrors((e) => ({ ...e, city: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Ingresá tu nombre completo.";
    if (!form.email.trim()) e.email = "Ingresá tu correo.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Ese correo no parece válido.";
    if (!form.phone.trim()) e.phone = "Ingresá tu número de celular.";
    if (!form.department.trim() || !DEPARTAMENTOS.includes(form.department))
      e.department = "Seleccioná un departamento válido.";
    if (!form.city.trim()) e.city = "Seleccioná la ciudad.";
    if (isShipping && !form.addr.trim())
      e.addr = "Ingresá la dirección de envío.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    const payload: FormState = {
      ...form,
      deliveryMethod: isPickup ? "pickup" : "shipping",
    };
    try {
      sessionStorage.setItem("lds-checkout", JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    router.push("/checkout/pago");
  }

  if (!ready || items.length === 0) {
    return (
      <div className="store-screen">
        <StoreHeader title="Tus datos" back />
        <div style={{ flex: 1 }} />
      </div>
    );
  }

  const cityOptions = form.department ? ciudadesDe(form.department) : [];
  const shippingLabel = isPickup
    ? "Gratis"
    : subtotal >= freeShippingMin
      ? "Gratis"
      : formatCOP(shippingCost);

  return (
    <div className="store-screen">
      <StoreHeader title="Tus datos" back />
      <form onSubmit={submit} className="store-body" noValidate>
        <div className="store-sheet" style={{ padding: "18px 16px 16px" }}>
          {/* ── Order summary ── */}
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
              <span>{isPickup ? "Recoge en Medellín" : "Envío"}</span>
              <span className="lds-num">{shippingLabel}</span>
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

          {/* ── Customer form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field
              label="Nombre completo"
              value={form.name}
              onChange={(v) => setField("name", v)}
              error={errors.name}
              placeholder="Tu nombre y apellido"
              autoComplete="name"
            />
            <Field
              label="Correo electrónico"
              value={form.email}
              onChange={(v) => setField("email", v)}
              error={errors.email}
              placeholder="tucorreo@ejemplo.com"
              type="email"
              autoComplete="email"
            />
            <Field
              label="Celular"
              value={form.phone}
              onChange={(v) => setField("phone", v)}
              error={errors.phone}
              placeholder="300 000 0000"
              type="tel"
              autoComplete="tel"
            />

            <Combobox
              label="Departamento"
              value={form.department}
              onChange={setDepartment}
              options={DEPARTAMENTOS}
              placeholder="Buscar departamento"
              error={errors.department}
              required
            />
            <Combobox
              label="Ciudad"
              value={form.city}
              onChange={setCity}
              options={cityOptions}
              placeholder={
                form.department
                  ? "Buscar ciudad"
                  : "Primero seleccioná el departamento"
              }
              disabled={
                !form.department || !DEPARTAMENTOS.includes(form.department)
              }
              error={errors.city}
              required
            />

            {/* ── Método de entrega ── */}
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink-2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 10,
                }}
              >
                Método de entrega
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                <DeliveryOption
                  selected={isShipping}
                  onClick={() => setField("deliveryMethod", "shipping")}
                  icon="truck"
                  title="Envío a domicilio"
                  subtitle={
                    subtotal >= freeShippingMin
                      ? "Gratis — superaste el mínimo"
                      : `+${formatCOP(shippingCost)}`
                  }
                />
                {pickupEligible && (
                  <DeliveryOption
                    selected={isPickup}
                    onClick={() => setField("deliveryMethod", "pickup")}
                    icon="bag"
                    title="Recoger en Medellín"
                    subtitle="Gratis"
                  />
                )}
              </div>

              {isPickup && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "10px 12px",
                    background: "var(--surface-alt)",
                    borderRadius: "var(--r-md)",
                    fontSize: 13,
                    color: "var(--ink-2)",
                    lineHeight: 1.5,
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                  }}
                >
                  <Icon name="info" size={16} color="var(--ink-3)" />
                  <span>
                    Nos comunicaremos contigo para pactar la entrega en la
                    ciudad de Medellín.
                  </span>
                </div>
              )}
            </div>

            {/* Dirección — solo envío */}
            {isShipping && (
              <div>
                <label className="lds-label">
                  Dirección de envío
                  <span style={{ color: "#f87171" }}> *</span>
                </label>
                <input
                  className="lds-input"
                  value={form.addr}
                  onChange={(e) => setField("addr", e.target.value)}
                  placeholder="Calle, número, apto"
                  aria-invalid={!!errors.addr}
                  autoComplete="address-line1"
                />
                {errors.addr && <div className="lds-error">{errors.addr}</div>}
              </div>
            )}
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

function DeliveryOption({
  selected,
  onClick,
  icon,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  icon: IconName;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: "var(--r-lg)",
        border: selected ? "1.5px solid var(--accent)" : "1.5px solid var(--line)",
        background: selected ? "rgba(46, 161, 92, 0.1)" : "var(--surface)",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: selected ? "5px solid var(--accent)" : "2px solid var(--line)",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
          {subtitle}
        </div>
      </div>
      <Icon name={icon} size={18} color="var(--ink-3)" stroke={1.6} />
    </button>
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
        {label}
        {optional ? (
          <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>
            {" "}
            (opcional)
          </span>
        ) : (
          <span style={{ color: "#f87171" }}> *</span>
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
