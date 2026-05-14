// Tienda Los del Sur — storefront screens (mobile-first, 390x844)
const { useState: useStateS } = React;

// ─── Product Card (used in catalog) ───────────────────────────────
function ProductCard({ p, compact = false }) {
  return (
    <div style={{
      background: "var(--surface)", borderRadius: "var(--r-lg)",
      border: "1px solid var(--line-2)", overflow: "hidden",
      display: "flex", flexDirection: "column"
    }}>
      <ProductGlyph kind={p.glyph} color={p.color} />
      <div style={{ padding: compact ? "10px 12px 12px" : "12px 14px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        <StockBadge status={p.status} />
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.25, letterSpacing: "-0.01em", textWrap: "pretty" }}>{p.name}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
          <Money value={p.price} size="sm" />
          <button
            disabled={p.status === "out"}
            className="lds-btn lds-btn-primary lds-btn-sm"
            style={{
              padding: "7px 12px", fontSize: 12,
              opacity: p.status === "out" ? 0.4 : 1,
              cursor: p.status === "out" ? "not-allowed" : "pointer"
            }}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 1: Home / Catalog ─────────────────────────────────────
function ScreenHome() {
  return (
    <div className="lds-phone">
      <StatusBar />
      <MobileHeader cartCount={3} action={<Icon name="search" size={20} color="var(--ink-2)" />} />
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Hero ribbon */}
        <div style={{ padding: "16px 16px 8px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Colección 2026</div>
          <h1 style={{ fontSize: 24, marginTop: 4, lineHeight: 1.15 }}>Llevá los colores<br/>a donde vayas.</h1>
        </div>
        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, padding: "12px 16px 14px", overflowX: "auto" }}>
          {["Todos", "Camisetas", "Abrigos", "Accesorios"].map((c, i) => (
            <div key={c} style={{
              padding: "7px 14px", borderRadius: "var(--r-full)",
              background: i === 0 ? "var(--ink)" : "var(--surface)",
              color: i === 0 ? "white" : "var(--ink-2)",
              border: i === 0 ? "1px solid var(--ink)" : "1px solid var(--line)",
              fontSize: 13, fontWeight: 500, whiteSpace: "nowrap"
            }}>{c}</div>
          ))}
        </div>
        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 16px 24px" }}>
          {LDS.PRODUCTS.slice(0, 6).map(p => <ProductCard key={p.id} p={p} compact />)}
        </div>
      </div>
      <HomeBar />
    </div>
  );
}

// ─── SCREEN 2: Product Card spec ─────────────────────────────────
function ScreenCardSpec() {
  const ok = LDS.PRODUCTS[0];
  const low = LDS.PRODUCTS[1];
  const out = LDS.PRODUCTS[4];
  return (
    <div className="lds-screen" style={{ padding: 28, background: "var(--bg)", overflow: "auto" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Componente</div>
      <h2 style={{ fontSize: 22, marginTop: 4 }}>Tarjeta de producto</h2>
      <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
        Foto cuadrada, badge de stock, nombre, precio, botón "Agregar". Estados según disponibilidad.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 22 }}>
        <ProductCard p={ok} />
        <ProductCard p={low} />
        <ProductCard p={out} />
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px dashed var(--line)", padding: 14, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, fontSize: 11 }}>
          <div>
            <div style={{ color: "var(--ink-3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Padding interno</div>
            <div style={{ color: "var(--ink)", fontWeight: 600 }}>14 / 12 px</div>
          </div>
          <div>
            <div style={{ color: "var(--ink-3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Radio</div>
            <div style={{ color: "var(--ink)", fontWeight: 600 }}>12 px</div>
          </div>
          <div>
            <div style={{ color: "var(--ink-3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Borde</div>
            <div style={{ color: "var(--ink)", fontWeight: 600 }}>1 px line-2</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 3: Product Detail ─────────────────────────────────────
function ScreenProductDetail() {
  const p = LDS.PRODUCTS[0];
  return (
    <div className="lds-phone">
      <StatusBar />
      <MobileHeader back cartCount={3} action={<Icon name="search" size={20} color="var(--ink-2)" />} />
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Big image */}
        <div style={{ background: "var(--surface-alt)", padding: "10px 14px 6px" }}>
          <div style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 102 96" style={{ width: "80%", height: "80%" }}>
              <g fill="none" stroke={p.color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                <path d="M30 18 L42 14 L48 18 L60 14 L72 18 L78 28 L70 32 L68 30 L68 70 L34 70 L34 30 L32 32 L24 28 Z" />
                <path d="M42 14 Q51 24 60 14" />
                <circle cx="51" cy="44" r="6" />
              </g>
            </svg>
          </div>
          {/* Image dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 8 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: i === 0 ? 18 : 5, height: 5, borderRadius: 3, background: i === 0 ? "var(--ink)" : "var(--ink-4)" }} />
            ))}
          </div>
        </div>
        <div style={{ padding: "18px 18px 20px" }}>
          <StockBadge status={p.status} />
          <h2 style={{ fontSize: 22, marginTop: 10, lineHeight: 1.15 }}>{p.name}</h2>
          <div style={{ marginTop: 10 }}><Money value={p.price} size="lg" weight={700} /></div>

          <p style={{ marginTop: 18, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, textWrap: "pretty" }}>
            {p.desc}
          </p>

          {/* Size selector */}
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 10 }}>Talla</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["S", "M", "L", "XL", "XXL"].map((s, i) => (
                <div key={s} style={{
                  width: 44, height: 40, borderRadius: "var(--r-sm)",
                  border: i === 1 ? "1.5px solid var(--accent)" : "1px solid var(--line)",
                  background: i === 1 ? "var(--accent-tint)" : "var(--surface)",
                  color: i === 1 ? "var(--accent-ink)" : "var(--ink)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 600
                }}>{s}</div>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>Cantidad</div>
            <QtyStepper value={1} />
          </div>
        </div>
      </div>
      {/* Sticky CTA */}
      <div style={{
        padding: "12px 16px 14px", background: "var(--surface)",
        borderTop: "1px solid var(--line-2)", flexShrink: 0
      }}>
        <button className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block">
          <Icon name="cart" size={18} color="white" stroke={1.8} />
          Agregar al carrito
        </button>
      </div>
      <HomeBar />
    </div>
  );
}

// ─── SCREEN 4: Cart Drawer ────────────────────────────────────────
function ScreenCart() {
  const items = LDS.CART.map(c => ({ ...LDS.PRODUCTS.find(p => p.id === c.productId), qty: c.qty }));
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = 12000;
  return (
    <div className="lds-phone" style={{ background: "rgba(20,20,20,0.35)" }}>
      <StatusBar />
      {/* Behind: a hint of catalog */}
      <div style={{ position: "absolute", inset: 0, top: 44, background: "rgba(20,20,20,0.35)", pointerEvents: "none" }} />
      {/* Drawer */}
      <div style={{
        position: "absolute", top: 44, right: 0, bottom: 0, width: "100%",
        background: "var(--bg)", display: "flex", flexDirection: "column",
        borderTopLeftRadius: 0
      }}>
        <header style={{
          height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", borderBottom: "1px solid var(--line-2)", background: "var(--surface)"
        }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>Tu carrito · {items.length}</h3>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-alt)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="close" size={16} />
          </div>
        </header>
        <div style={{ flex: 1, overflow: "auto", padding: "8px 16px" }}>
          {items.map((it, idx) => (
            <div key={it.id} style={{
              display: "flex", gap: 12, padding: "14px 0",
              borderBottom: idx < items.length - 1 ? "1px solid var(--line-2)" : "none"
            }}>
              <div style={{ width: 72, height: 72, background: "var(--surface-alt)", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 102 96" style={{ width: 50, height: 50 }}>
                  <ProductGlyph kind={it.glyph} color={it.color} bg={false} />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{it.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Talla M</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <QtyStepper value={it.qty} size="sm" />
                  <Money value={it.price * it.qty} size="sm" weight={700} />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Totals */}
        <div style={{ padding: "16px 16px 12px", borderTop: "1px solid var(--line-2)", background: "var(--surface)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-2)", padding: "4px 0" }}>
            <span>Subtotal</span>
            <span className="lds-num">{LDS.formatCOP(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-2)", padding: "4px 0" }}>
            <span>Envío</span>
            <span className="lds-num">{LDS.formatCOP(shipping)}</span>
          </div>
          <hr className="lds-divider" style={{ margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 14, color: "var(--ink-2)", fontWeight: 500 }}>Total</span>
            <Money value={subtotal + shipping} size="lg" weight={700} />
          </div>
          <button className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block" style={{ marginTop: 14 }}>
            Ir a pagar
            <Icon name="chevright" size={18} color="white" stroke={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 4b: Empty Cart ────────────────────────────────────────
function ScreenCartEmpty() {
  return (
    <div className="lds-phone">
      <StatusBar />
      <header style={{
        height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", borderBottom: "1px solid var(--line-2)", background: "var(--surface)", flexShrink: 0
      }}>
        <h3 style={{ fontSize: 17, fontWeight: 700 }}>Tu carrito</h3>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-alt)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="close" size={16} />
        </div>
      </header>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px", textAlign: "center", gap: 16 }}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%", background: "var(--surface-alt)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon name="cart" size={42} color="var(--ink-3)" stroke={1.3} />
        </div>
        <div>
          <h3 style={{ fontSize: 20, marginBottom: 6 }}>Tu carrito está vacío</h3>
          <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5, textWrap: "pretty" }}>
            Cuando agregues productos, los vas a ver acá. Mirá la colección y armá tu pedido.
          </p>
        </div>
        <button className="lds-btn lds-btn-primary lds-btn-lg" style={{ marginTop: 4 }}>
          Ver catálogo
        </button>
      </div>
      <HomeBar />
    </div>
  );
}

// ─── SCREEN 5: Checkout ────────────────────────────────────────────
function ScreenCheckout() {
  const items = LDS.CART.map(c => ({ ...LDS.PRODUCTS.find(p => p.id === c.productId), qty: c.qty }));
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = 12000;
  return (
    <div className="lds-phone">
      <StatusBar />
      <MobileHeader back title="Tus datos" cartCount={3} />
      <div style={{ flex: 1, overflow: "auto", padding: "18px 16px 14px" }}>
        {/* Order summary */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--line-2)", borderRadius: "var(--r-lg)", padding: 14, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Tu pedido</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{items.length} artículos</div>
          </div>
          {items.map(it => (
            <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", color: "var(--ink-2)" }}>
              <span style={{ flex: 1 }}>{it.qty}× {it.name}</span>
              <span className="lds-num" style={{ color: "var(--ink)" }}>{LDS.formatCOP(it.price * it.qty)}</span>
            </div>
          ))}
          <hr className="lds-divider" style={{ margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-3)" }}>
            <span>Envío</span><span className="lds-num">{LDS.formatCOP(shipping)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, alignItems: "baseline" }}>
            <span style={{ fontWeight: 600 }}>Total</span>
            <Money value={subtotal + shipping} weight={700} />
          </div>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="lds-label">Nombre completo</label>
            <input className="lds-input" defaultValue="Camila Restrepo" />
          </div>
          <div>
            <label className="lds-label">Correo electrónico</label>
            <input className="lds-input" defaultValue="camila.r@gmail.com" />
          </div>
          <div>
            <label className="lds-label">Teléfono <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>(opcional)</span></label>
            <input className="lds-input" placeholder="300 000 0000" />
          </div>
          <div>
            <label className="lds-label">Dirección de envío</label>
            <input className="lds-input" defaultValue="Cra 70 #45-12, apto 302" />
            <input className="lds-input" defaultValue="Medellín, Antioquia" style={{ marginTop: 8 }} />
          </div>
        </div>
      </div>
      <div style={{ padding: "12px 16px 14px", background: "var(--surface)", borderTop: "1px solid var(--line-2)", flexShrink: 0 }}>
        <button className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block">
          Continuar al pago
          <Icon name="chevright" size={18} color="white" stroke={2} />
        </button>
      </div>
      <HomeBar />
    </div>
  );
}

// ─── SCREEN 6: Nequi Payment Modal ────────────────────────────────
function ScreenNequi() {
  const total = 199000;
  return (
    <div className="lds-phone" style={{ background: "rgba(20,20,20,0.5)" }}>
      <StatusBar />
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(20,20,20,0.55)", display: "flex", alignItems: "flex-end"
      }}>
        <div style={{
          background: "var(--bg)", width: "100%",
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          maxHeight: "92%", display: "flex", flexDirection: "column"
        }}>
          {/* Grabber */}
          <div style={{ padding: "10px 0 6px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: 38, height: 4, borderRadius: 2, background: "var(--line)" }} />
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "8px 18px 18px" }}>
            {/* Title bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", letterSpacing: "0.08em", textTransform: "uppercase" }}>Pago con Nequi</div>
                <h3 style={{ fontSize: 18, marginTop: 4 }}>Transferí y subí el pantallazo</h3>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-alt)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="close" size={15} />
              </div>
            </div>

            {/* Amount card */}
            <div style={{
              marginTop: 16, background: "var(--surface)", border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)", padding: "18px 16px", textAlign: "center"
            }}>
              <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Monto a transferir</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 700, marginTop: 4, letterSpacing: "-0.03em", color: "var(--ink)" }}>
                {LDS.formatCOP(total)}
              </div>
            </div>

            {/* Account details */}
            <div style={{
              marginTop: 12, background: "var(--surface)", border: "1px solid var(--line)",
              borderRadius: "var(--r-lg)", padding: 14
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Cuenta Nequi</div>
                  <div style={{ fontSize: 17, fontWeight: 700, marginTop: 3, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.005em" }}>{LDS.SETTINGS.nequiNumber}</div>
                </div>
                <div style={{ padding: "7px 12px", borderRadius: "var(--r-sm)", background: "var(--accent-tint)", color: "var(--accent-ink)", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="check" size={14} color="var(--accent-ink)" stroke={2.2} />
                  Copiar
                </div>
              </div>
              <hr className="lds-divider" style={{ margin: "6px 0" }} />
              <div style={{ padding: "8px 0" }}>
                <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>A nombre de</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>{LDS.SETTINGS.nequiHolder}</div>
              </div>
            </div>

            {/* Steps */}
            <div style={{ marginTop: 18 }}>
              {[
                "Transferí el monto exacto a esta cuenta Nequi.",
                "Tomá captura del comprobante.",
                "Subila acá abajo y confirmá."
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", alignItems: "flex-start" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "var(--accent)", color: "white",
                    fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>{i + 1}</div>
                  <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.45, paddingTop: 2 }}>{t}</div>
                </div>
              ))}
            </div>

            {/* Dropzone */}
            <div style={{
              marginTop: 14, border: "1.5px dashed var(--line)", borderRadius: "var(--r-lg)",
              padding: "22px 16px", background: "var(--surface)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", background: "var(--accent-tint)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Icon name="upload" size={20} color="var(--accent-ink)" stroke={1.7} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Subí el pantallazo del pago</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>JPG o PNG · hasta 5 MB</div>
              <button className="lds-btn lds-btn-secondary lds-btn-sm" style={{ marginTop: 4 }}>Seleccionar imagen</button>
            </div>

            {/* Hint */}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 12, padding: "10px 12px", background: "var(--surface-alt)", borderRadius: "var(--r-md)" }}>
              <Icon name="info" size={16} color="var(--ink-2)" />
              <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.4, textWrap: "pretty" }}>
                Verificamos el pago manualmente. Te avisamos por WhatsApp o correo en menos de 12 horas.
              </div>
            </div>
          </div>

          {/* Sticky CTA */}
          <div style={{ padding: "12px 16px 12px", background: "var(--surface)", borderTop: "1px solid var(--line-2)" }}>
            <button className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block">Confirmar pedido</button>
          </div>
          <HomeBar />
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 7: Order Confirmation ─────────────────────────────────
function ScreenConfirm() {
  const items = LDS.CART.map(c => ({ ...LDS.PRODUCTS.find(p => p.id === c.productId), qty: c.qty }));
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  return (
    <div className="lds-phone">
      <StatusBar />
      <div style={{ flex: 1, overflow: "auto", padding: "8px 0 18px" }}>
        <div style={{ padding: "28px 18px 22px", textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--accent-tint)",
            color: "var(--accent-ink)",
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon name="check" size={32} stroke={2.5} color="var(--accent-ink)" />
          </div>
          <h2 style={{ fontSize: 22, marginTop: 14 }}>¡Recibimos tu pedido!</h2>
          <p style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 8, lineHeight: 1.5, textWrap: "pretty" }}>
            Verificamos el pago y te contactamos en las próximas 12 horas por WhatsApp o correo.
          </p>
          <div style={{
            marginTop: 18, display: "inline-flex", alignItems: "center", gap: 10,
            padding: "10px 16px", background: "var(--surface-alt)",
            borderRadius: "var(--r-full)"
          }}>
            <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Pedido</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>#1042</div>
          </div>
        </div>

        <div style={{
          margin: "0 16px", background: "var(--surface)", border: "1px solid var(--line-2)",
          borderRadius: "var(--r-lg)", padding: 14
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Tu compra</div>
          {items.map((it, i) => (
            <div key={it.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: i ? "1px solid var(--line-2)" : "none" }}>
              <div style={{ width: 48, height: 48, background: "var(--surface-alt)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 102 96" style={{ width: 36, height: 36 }}>
                  <ProductGlyph kind={it.glyph} color={it.color} bg={false} />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Cantidad: {it.qty}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }} className="lds-num">{LDS.formatCOP(it.price * it.qty)}</div>
            </div>
          ))}
          <hr className="lds-divider" style={{ margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 13, color: "var(--ink-2)" }}>Total pagado</span>
            <Money value={subtotal + 12000} weight={700} />
          </div>
        </div>

        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block">
            <Icon name="whatsapp" size={18} color="white" stroke={1.8} />
            Escribirnos por WhatsApp
          </button>
          <button className="lds-btn lds-btn-secondary lds-btn-block">Seguir comprando</button>
        </div>
      </div>
      <HomeBar />
    </div>
  );
}

Object.assign(window, {
  ScreenHome, ScreenCardSpec, ScreenProductDetail,
  ScreenCart, ScreenCartEmpty, ScreenCheckout, ScreenNequi, ScreenConfirm,
  ProductCard
});
