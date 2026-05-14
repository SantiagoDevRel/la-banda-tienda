// Tienda Los del Sur — admin screens (desktop, 1280x800)

// ─── SCREEN 8: Login ──────────────────────────────────────────────
function ScreenLogin() {
  return (
    <div className="lds-screen" style={{ display: "flex", background: "var(--bg)" }}>
      {/* Left: brand */}
      <div style={{
        width: 460, background: "var(--surface)", borderRight: "1px solid var(--line)",
        padding: "60px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between"
      }}>
        <Logo size="lg" />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Panel privado</div>
          <h1 style={{ fontSize: 32, marginTop: 10, lineHeight: 1.15, textWrap: "pretty" }}>
            Administrá tu tienda<br/>desde un solo lugar.
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 12, lineHeight: 1.55, textWrap: "pretty" }}>
            Pedidos, productos, pagos por Nequi y reportes. Todo cifrado y solo para el equipo.
          </p>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
          © 2026 Los del Sur · <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>Ayuda</span>
        </div>
      </div>
      {/* Right: form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 380 }}>
          <h2 style={{ fontSize: 24 }}>Iniciar sesión</h2>
          <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 6 }}>
            Ingresá con tu correo y contraseña de administrador.
          </p>
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="lds-label">Correo electrónico</label>
              <input className="lds-input" defaultValue="carlos@losdelsur.co" />
            </div>
            <div>
              <label className="lds-label">Contraseña</label>
              <input className="lds-input" type="password" defaultValue="••••••••••" />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-2)" }}>
                <span style={{ width: 18, height: 18, borderRadius: 4, border: "1.5px solid var(--accent)", background: "var(--accent)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="check" size={11} color="white" stroke={2.5} />
                </span>
                Recordar mi sesión
              </label>
              <a className="lds-link" style={{ fontSize: 13 }}>¿Olvidaste tu clave?</a>
            </div>
            <button className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block" style={{ marginTop: 8 }}>
              Entrar al panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 9: Dashboard ──────────────────────────────────────────
function ScreenDashboard() {
  const pendingCount = LDS.ORDERS.filter(o => o.status === "pending").length;
  const lowStock = LDS.PRODUCTS.filter(p => p.status === "low" || p.status === "out").length;
  const todayCount = LDS.ORDERS.filter(o => o.date.startsWith("Hoy")).length;
  const todayRevenue = LDS.ORDERS.filter(o => o.date.startsWith("Hoy")).reduce((s, o) => s + o.total, 0);

  const metric = (label, value, sub, accent, icon) => (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 18 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
        <div style={{ width: 32, height: 32, borderRadius: "var(--r-sm)", background: accent || "var(--surface-alt)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, marginTop: 14, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>{sub}</div>
    </div>
  );

  return (
    <AdminShell section="dashboard" page={{
      title: "Hola, Carlos 👋",
      subtitle: "Acá tenés un resumen de la tienda hoy."
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {metric("Pedidos pendientes", pendingCount, "Necesitan verificación", "var(--status-pending-bg)",
          <Icon name="bell" size={16} color="var(--status-pending-ink)" />)}
        {metric("Pedidos de hoy", todayCount, LDS.formatCOP(todayRevenue) + " en ventas", "var(--accent-tint)",
          <Icon name="bag" size={16} color="var(--accent-ink)" />)}
        {metric("Stock bajo", lowStock, "Productos por reponer", "var(--surface-alt)",
          <Icon name="box" size={16} color="var(--ink-2)" />)}
        {metric("Total pedidos", LDS.ORDERS.length, "Este mes", "var(--surface-alt)",
          <Icon name="grid" size={16} color="var(--ink-2)" />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginTop: 16 }}>
        {/* Recent pending orders */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
          <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line-2)" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Pedidos recientes</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Los pendientes están arriba</div>
            </div>
            <a className="lds-link" style={{ fontSize: 13 }}>Ver todos →</a>
          </div>
          <table className="lds-table">
            <thead><tr>
              <th>#</th><th>Cliente</th><th>Estado</th><th style={{ textAlign: "right" }}>Total</th><th>Fecha</th>
            </tr></thead>
            <tbody>
              {LDS.ORDERS.slice(0, 5).map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>#{o.id}</td>
                  <td>{o.customer}</td>
                  <td><OrderStatusBadge status={o.status} /></td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{LDS.formatCOP(o.total)}</td>
                  <td style={{ color: "var(--ink-3)", fontSize: 13 }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Accesos rápidos</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: "plus", label: "Nuevo producto", sub: "Subí una nueva referencia" },
                { icon: "bag", label: "Ver pendientes", sub: pendingCount + " esperando verificar" },
                { icon: "settings", label: "Datos de Nequi", sub: "Actualizar cuenta y titular" }
              ].map((qa, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: "var(--r-md)", border: "1px solid var(--line-2)", cursor: "pointer" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "var(--r-sm)", background: "var(--accent-tint)", color: "var(--accent-ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={qa.icon} size={16} color="var(--accent-ink)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{qa.label}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{qa.sub}</div>
                  </div>
                  <Icon name="chevright" size={14} color="var(--ink-3)" />
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--accent-tint)", border: "1px solid color-mix(in oklch, var(--accent) 25%, transparent)", borderRadius: "var(--r-lg)", padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-ink)" }}>Tu tienda está activa</div>
            <div style={{ fontSize: 12, color: "var(--accent-ink)", opacity: 0.8, marginTop: 4, lineHeight: 1.4 }}>
              Los clientes pueden hacer pedidos. Mantené el stock al día.
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ─── SCREEN 10: Products list ─────────────────────────────────────
function ScreenProducts() {
  return (
    <AdminShell section="products" page={{
      title: "Productos",
      subtitle: LDS.PRODUCTS.length + " referencias en catálogo",
      action: (
        <div style={{ display: "flex", gap: 10 }}>
          <button className="lds-btn lds-btn-secondary lds-btn-sm">
            <Icon name="upload" size={15} color="var(--ink-2)" />
            Exportar
          </button>
          <button className="lds-btn lds-btn-primary lds-btn-sm">
            <Icon name="plus" size={15} color="white" stroke={2} />
            Nuevo producto
          </button>
        </div>
      )
    }}>
      {/* Search + filters bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <Icon name="search" size={16} color="var(--ink-3)" />
          </div>
          <input className="lds-input" placeholder="Buscar productos…" style={{ paddingLeft: 36 }} />
        </div>
        <button className="lds-btn lds-btn-secondary lds-btn-sm">
          <Icon name="filter" size={15} color="var(--ink-2)" />
          Categoría
        </button>
        <button className="lds-btn lds-btn-secondary lds-btn-sm">
          Estado
          <Icon name="chevdown" size={14} color="var(--ink-2)" />
        </button>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
        <table className="lds-table">
          <thead><tr>
            <th style={{ width: 40 }}></th>
            <th>Producto</th>
            <th>Categoría</th>
            <th style={{ textAlign: "right" }}>Precio</th>
            <th style={{ textAlign: "right" }}>Stock</th>
            <th>Estado</th>
            <th style={{ width: 100 }}></th>
          </tr></thead>
          <tbody>
            {LDS.PRODUCTS.map(p => (
              <tr key={p.id}>
                <td style={{ paddingRight: 0 }}>
                  <div style={{ width: 40, height: 40, background: "var(--surface-alt)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 102 96" style={{ width: 30, height: 30 }}>
                      <ProductGlyph kind={p.glyph} color={p.color} bg={false} />
                    </svg>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td style={{ color: "var(--ink-2)", textTransform: "capitalize" }}>{p.tags[0]}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{LDS.formatCOP(p.price)}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: p.stock === 0 ? "var(--ink-3)" : "var(--ink)" }}>{p.stock}</td>
                <td><StockBadge status={p.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <button style={{ width: 30, height: 30, borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Icon name="edit" size={14} color="var(--ink-2)" />
                    </button>
                    <button style={{ width: 30, height: 30, borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Icon name="trash" size={14} color="#B91C1C" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

// ─── SCREEN 11: Product form ──────────────────────────────────────
function ScreenProductForm() {
  return (
    <AdminShell section="products" page={{
      title: "Nuevo producto",
      subtitle: "Productos → Nuevo",
      action: (
        <div style={{ display: "flex", gap: 10 }}>
          <button className="lds-btn lds-btn-ghost lds-btn-sm">Cancelar</button>
          <button className="lds-btn lds-btn-secondary lds-btn-sm">Guardar borrador</button>
          <button className="lds-btn lds-btn-primary lds-btn-sm">Publicar producto</button>
        </div>
      )
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, maxWidth: 980 }}>
        {/* Left: main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Información básica</div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="lds-label">Nombre del producto</label>
                <input className="lds-input" defaultValue="Camiseta Manga Larga Entrenamiento" />
              </div>
              <div>
                <label className="lds-label">Descripción</label>
                <textarea className="lds-textarea" rows="4" defaultValue="Camiseta manga larga térmica para entrenamiento, tela elástica con tecnología antitranspirante. Talles S a XXL, estampado en cuello y manga." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="lds-label">Precio (COP)</label>
                  <input className="lds-input" defaultValue="105.000" />
                </div>
                <div>
                  <label className="lds-label">Stock disponible</label>
                  <input className="lds-input" defaultValue="24" />
                </div>
              </div>
              <div>
                <label className="lds-label">Categoría</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Camisetas", "Abrigos", "Accesorios"].map((c, i) => (
                    <div key={c} style={{
                      padding: "9px 14px", borderRadius: "var(--r-full)",
                      background: i === 0 ? "var(--accent-tint)" : "var(--surface)",
                      color: i === 0 ? "var(--accent-ink)" : "var(--ink-2)",
                      border: i === 0 ? "1.5px solid var(--accent)" : "1px solid var(--line)",
                      fontSize: 13, fontWeight: 500, cursor: "pointer"
                    }}>{c}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: image */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Imagen del producto</div>
            <div style={{ marginTop: 12 }}>
              <div style={{
                aspectRatio: "1 / 1", background: "var(--surface-alt)",
                borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden"
              }}>
                <ProductGlyph kind="longsleeve" color="#16A34A" bg={false} />
                <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
                  <button style={{ width: 30, height: 30, borderRadius: "var(--r-sm)", border: "none", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Icon name="edit" size={14} color="var(--ink)" />
                  </button>
                </div>
              </div>
              <button className="lds-btn lds-btn-secondary lds-btn-sm lds-btn-block" style={{ marginTop: 10 }}>
                <Icon name="upload" size={15} color="var(--ink-2)" />
                Cambiar imagen
              </button>
              <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 8, textAlign: "center" }}>
                JPG o PNG. Cuadrada, mínimo 800 × 800 px.
              </div>
            </div>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Visibilidad</div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Publicado</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Visible en el catálogo</div>
              </div>
              <div style={{ width: 40, height: 22, background: "var(--accent)", borderRadius: 11, padding: 2, display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ─── SCREEN 12: Orders list ───────────────────────────────────────
function ScreenOrders() {
  const filters = [
    { id: "all", label: "Todos", count: LDS.ORDERS.length },
    { id: "pending", label: "Pendientes", count: LDS.ORDERS.filter(o => o.status === "pending").length },
    { id: "done", label: "Finalizadas", count: LDS.ORDERS.filter(o => o.status === "done").length },
    { id: "shipped", label: "Enviadas", count: LDS.ORDERS.filter(o => o.status === "shipped").length },
    { id: "cancel", label: "Canceladas", count: LDS.ORDERS.filter(o => o.status === "cancel").length }
  ];
  return (
    <AdminShell section="orders" page={{
      title: "Pedidos",
      subtitle: "Verificá pagos, gestioná envíos y cierre.",
      action: (
        <div style={{ display: "flex", gap: 10 }}>
          <button className="lds-btn lds-btn-secondary lds-btn-sm">
            <Icon name="upload" size={15} color="var(--ink-2)" />
            Exportar
          </button>
        </div>
      )
    }}>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--line)", marginBottom: 14 }}>
        {filters.map((f, i) => (
          <div key={f.id} style={{
            padding: "10px 14px", fontSize: 13, fontWeight: 500,
            color: i === 0 ? "var(--ink)" : "var(--ink-2)",
            borderBottom: i === 0 ? "2px solid var(--accent)" : "2px solid transparent",
            marginBottom: -1, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
          }}>
            {f.label}
            <span style={{
              fontSize: 11, padding: "1px 6px", borderRadius: "var(--r-full)",
              background: i === 0 ? "var(--accent-tint)" : "var(--surface-alt)",
              color: i === 0 ? "var(--accent-ink)" : "var(--ink-2)", fontWeight: 600
            }}>{f.count}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <Icon name="search" size={16} color="var(--ink-3)" />
          </div>
          <input className="lds-input" placeholder="Buscar por #pedido, cliente o correo…" style={{ paddingLeft: 36 }} />
        </div>
        <button className="lds-btn lds-btn-secondary lds-btn-sm">
          Últimos 7 días
          <Icon name="chevdown" size={14} color="var(--ink-2)" />
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
        <table className="lds-table">
          <thead><tr>
            <th>#Pedido</th><th>Cliente</th><th>Items</th><th>Estado</th><th style={{ textAlign: "right" }}>Total</th><th>Fecha</th><th></th>
          </tr></thead>
          <tbody>
            {LDS.ORDERS.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>#{o.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.customer}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{o.email}</div>
                </td>
                <td style={{ color: "var(--ink-2)" }}>{o.items} {o.items === 1 ? "artículo" : "artículos"}</td>
                <td><OrderStatusBadge status={o.status} /></td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{LDS.formatCOP(o.total)}</td>
                <td style={{ color: "var(--ink-3)", fontSize: 13 }}>{o.date}</td>
                <td style={{ textAlign: "right" }}>
                  <Icon name="chevright" size={14} color="var(--ink-3)" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

// ─── SCREEN 13: Order detail ──────────────────────────────────────
function ScreenOrderDetail() {
  const o = LDS.ORDERS[0]; // pending order
  const items = LDS.CART.map(c => ({ ...LDS.PRODUCTS.find(p => p.id === c.productId), qty: c.qty }));
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  return (
    <AdminShell section="orders" page={{
      title: <span>Pedido <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>#{o.id}</span></span>,
      subtitle: <span>Pedidos → <span style={{ color: "var(--ink-2)" }}>#{o.id} de {o.customer}</span></span>,
      action: <OrderStatusBadge status={o.status} />
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, maxWidth: 1080 }}>
        {/* Left: items + screenshot */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Items */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Artículos comprados</div>
            <div style={{ marginTop: 12 }}>
              {items.map((it, i) => (
                <div key={it.id} style={{ display: "flex", gap: 14, padding: "12px 0", borderTop: i ? "1px solid var(--line-2)" : "none" }}>
                  <div style={{ width: 52, height: 52, background: "var(--surface-alt)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg viewBox="0 0 102 96" style={{ width: 38, height: 38 }}>
                      <ProductGlyph kind={it.glyph} color={it.color} bg={false} />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Talla M · Cant. {it.qty}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{LDS.formatCOP(it.price * it.qty)}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{LDS.formatCOP(it.price)} c/u</div>
                  </div>
                </div>
              ))}
              <hr className="lds-divider" style={{ margin: "14px 0 12px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-2)", padding: "3px 0" }}>
                <span>Subtotal</span><span className="lds-num">{LDS.formatCOP(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-2)", padding: "3px 0" }}>
                <span>Envío</span><span className="lds-num">{LDS.formatCOP(12000)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6, paddingTop: 8, borderTop: "1px solid var(--line-2)" }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <Money value={o.total} weight={700} />
              </div>
            </div>
          </div>

          {/* Payment screenshot */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Comprobante de pago</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Subido por el cliente · pantallazo de Nequi</div>
              </div>
              <button className="lds-btn lds-btn-secondary lds-btn-sm">
                <Icon name="eye" size={14} color="var(--ink-2)" />
                Ampliar
              </button>
            </div>
            {/* Fake receipt preview */}
            <div style={{ marginTop: 14, display: "flex", gap: 14 }}>
              <div style={{
                width: 180, height: 240, borderRadius: "var(--r-md)",
                background: "linear-gradient(180deg, #faf7ff 0%, #f5edff 100%)",
                border: "1px solid var(--line)", padding: "16px 14px",
                display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#7C3AED", letterSpacing: "0.1em" }}>NEQUI</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 12 }}>Enviaste</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginTop: 2, letterSpacing: "-0.02em" }}>$ 187.000</div>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed rgba(124,58,237,0.25)", fontSize: 10, color: "var(--ink-3)" }}>A</div>
                <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>Carlos Andrés Marín</div>
                <div style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>•••• 7791</div>
                <div style={{ marginTop: 12, fontSize: 10, color: "var(--ink-3)" }}>14 may · 14:18</div>
                <div style={{ marginTop: 6, fontSize: 9, color: "var(--ink-3)" }}>Ref: NQ7821449</div>
                <div style={{ flex: 1 }} />
                <div style={{ display: "inline-flex", alignSelf: "flex-start", padding: "3px 8px", background: "rgba(124,58,237,0.12)", borderRadius: "var(--r-full)", fontSize: 9, fontWeight: 700, color: "#5B21B6" }}>
                  ✓ APROBADO
                </div>
              </div>
              <div style={{ flex: 1, padding: "8px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--ink-3)" }}>Monto en comprobante</span>
                  <span className="lds-num" style={{ fontWeight: 600 }}>{LDS.formatCOP(187000)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--ink-3)" }}>Monto del pedido</span>
                  <span className="lds-num" style={{ fontWeight: 600 }}>{LDS.formatCOP(o.total)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--accent-tint)", borderRadius: "var(--r-sm)", marginTop: 4 }}>
                  <Icon name="check" size={15} color="var(--accent-ink)" stroke={2.4} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-ink)" }}>El monto coincide</span>
                </div>
                <div style={{ marginTop: "auto", fontSize: 11, color: "var(--ink-3)", lineHeight: 1.5 }}>
                  Verificá también la fecha y el titular antes de marcar la pedido como finalizada.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: customer + actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Cliente</div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-tint)", color: "var(--accent-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15 }}>CR</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{o.customer}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Cliente nuevo</div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--ink-3)" }}>Correo</span>
                <span>{o.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--ink-3)" }}>Teléfono</span>
                <span>{o.phone}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--ink-3)" }}>Dirección</span>
                <span style={{ textAlign: "right" }}>Cra 70 #45-12<br/><span style={{ color: "var(--ink-3)" }}>Medellín, Antioquia</span></span>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Acciones</div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="lds-btn lds-btn-primary lds-btn-block">
                <Icon name="check" size={16} color="white" stroke={2.2} />
                Marcar finalizada
              </button>
              <button className="lds-btn lds-btn-secondary lds-btn-block">
                <Icon name="box" size={16} color="var(--ink-2)" />
                Marcar enviado
              </button>
              <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 6px", fontSize: 13, color: "var(--ink-2)" }}>
                <span style={{ width: 16, height: 16, borderRadius: 3, border: "1.5px solid var(--accent)", background: "var(--accent)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="check" size={10} color="white" stroke={2.6} />
                </span>
                Notificar al cliente por email
              </label>
              <hr className="lds-divider" style={{ margin: "4px 0" }} />
              <button className="lds-btn lds-btn-danger lds-btn-block">
                Cancelar pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ─── SCREEN 14: Settings ──────────────────────────────────────────
function ScreenSettings() {
  return (
    <AdminShell section="settings" page={{
      title: "Ajustes de la tienda",
      subtitle: "Datos públicos, cuenta para cobrar y políticas de envío.",
      action: <button className="lds-btn lds-btn-primary lds-btn-sm">Guardar cambios</button>
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 840 }}>
        {/* Store */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Tienda</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Visible para los clientes en el storefront.</div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label className="lds-label">Nombre de la tienda</label>
              <input className="lds-input" defaultValue={LDS.SETTINGS.storeName} />
            </div>
            <div>
              <label className="lds-label">WhatsApp de contacto</label>
              <input className="lds-input" defaultValue={LDS.SETTINGS.whatsapp} />
            </div>
          </div>
        </div>

        {/* Nequi */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "var(--r-sm)", background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, letterSpacing: "0.05em" }}>NQ</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Cuenta Nequi</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Los clientes verán estos datos al pagar.</div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label className="lds-label">Número de cuenta</label>
              <input className="lds-input lds-num" defaultValue={LDS.SETTINGS.nequiNumber} />
            </div>
            <div>
              <label className="lds-label">Nombre del titular</label>
              <input className="lds-input" defaultValue={LDS.SETTINGS.nequiHolder} />
            </div>
          </div>
          <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--accent-tint)", borderRadius: "var(--r-md)", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Icon name="info" size={16} color="var(--accent-ink)" />
            <div style={{ fontSize: 12, color: "var(--accent-ink)", lineHeight: 1.45, textWrap: "pretty" }}>
              Asegurate de que el número y el nombre coincidan exactamente con tu cuenta Nequi. Los clientes transfieren a esta cuenta directamente.
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Envíos</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Información que se muestra en el checkout.</div>
          <div style={{ marginTop: 16 }}>
            <label className="lds-label">Texto informativo</label>
            <textarea className="lds-textarea" rows="3" defaultValue={LDS.SETTINGS.shippingInfo} />
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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

Object.assign(window, {
  ScreenLogin, ScreenDashboard, ScreenProducts, ScreenProductForm,
  ScreenOrders, ScreenOrderDetail, ScreenSettings
});
