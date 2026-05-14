// Tienda Los del Sur — shared components and SVG icons
// Loaded after React + data.js. Exports to window so other JSX scripts see them.

const { useState } = React;

// ── Logo ──────────────────────────────────────────────────────────────
function Logo({ size = "md", subtle = true }) {
  const s = size === "sm" ? 16 : size === "lg" ? 22 : 18;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 21 V 6 L 12 3 L 21 6 V 21 Z" fill="var(--accent)"/>
        <path d="M3 21 V 6 L 12 3 L 21 6 V 21 Z" stroke="var(--accent-deep)" strokeWidth="1" />
      </svg>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: s, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1 }}>
        Los del Sur
      </div>
    </div>
  );
}

// ── Product Glyph ─────────────────────────────────────────────────────
// Single-line SVGs that act as elegant placeholders. Tinted by product color.
function ProductGlyph({ kind, color = "#1E7A3D", bg = true }) {
  const stroke = color;
  const paths = {
    shirt: (
      <g fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M30 18 L42 14 L48 18 L60 14 L72 18 L78 28 L70 32 L68 30 L68 70 L34 70 L34 30 L32 32 L24 28 Z" />
        <path d="M42 14 Q51 24 60 14" />
        <circle cx="51" cy="44" r="6" />
      </g>
    ),
    hoodie: (
      <g fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M28 22 L40 16 L42 20 Q51 26 60 20 L62 16 L74 22 L80 32 L72 36 L70 34 L70 76 L32 76 L32 34 L30 36 L22 32 Z" />
        <path d="M40 16 Q51 30 62 16" />
        <path d="M44 38 L44 56 L58 56 L58 38" />
      </g>
    ),
    cap: (
      <g fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M18 56 Q24 28 51 28 Q78 28 84 56 L78 56 Q72 36 51 36 Q30 36 24 56 Z" />
        <path d="M24 56 L78 56 L74 62 L28 62 Z" />
        <circle cx="51" cy="42" r="3" />
      </g>
    ),
    scarf: (
      <g fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M30 18 L46 22 L46 64 L30 60 Z" />
        <path d="M72 18 L56 22 L56 64 L72 60 Z" />
        <path d="M46 22 L56 22 M46 30 L56 30 M46 38 L56 38 M46 46 L56 46 M46 54 L56 54 M46 62 L56 62" />
        <path d="M30 60 L26 80 M34 62 L31 82 M38 63 L36 84 M42 64 L40 86" />
        <path d="M72 60 L76 80 M68 62 L71 82 M64 63 L66 84 M60 64 L62 86" />
      </g>
    ),
    stickers: (
      <g fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round">
        <rect x="22" y="22" width="22" height="22" rx="3" transform="rotate(-8 33 33)" />
        <rect x="46" y="20" width="22" height="22" rx="3" transform="rotate(5 57 31)" />
        <rect x="22" y="50" width="22" height="22" rx="3" transform="rotate(6 33 61)" />
        <circle cx="58" cy="60" r="11" />
        <path d="M52 60 L57 65 L66 56" strokeLinecap="round" />
      </g>
    ),
    thermos: (
      <g fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M40 18 L62 18 L62 24 L60 26 L60 78 Q60 84 51 84 Q42 84 42 78 L42 26 L40 24 Z" />
        <path d="M42 32 L60 32 M42 70 L60 70" />
        <path d="M48 12 L54 12 L54 18 L48 18 Z" />
      </g>
    ),
    longsleeve: (
      <g fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M30 18 L42 14 L48 18 L60 14 L72 18 L78 28 L74 72 L66 72 L66 30 L36 30 L36 72 L28 72 L24 28 Z" />
        <path d="M42 14 Q51 24 60 14" />
        <path d="M36 30 L66 30 L66 78 L36 78 Z" />
      </g>
    )
  };
  return (
    <div className="lds-prodfig" style={{ background: bg ? "var(--surface-alt)" : "transparent" }}>
      <svg viewBox="0 0 102 96" aria-hidden>{paths[kind] || paths.shirt}</svg>
    </div>
  );
}

// ── Cart icon w/ badge ────────────────────────────────────────────────
function CartIcon({ count = 0 }) {
  return (
    <div style={{ position: "relative", width: 24, height: 24 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4 H 6 L 7.5 16.5 A 1.5 1.5 0 0 0 9 18 H 18 A 1.5 1.5 0 0 0 19.5 16.7 L 21 8 H 6.5" />
        <circle cx="10" cy="21" r="1" />
        <circle cx="17" cy="21" r="1" />
      </svg>
      {count > 0 && (
        <div style={{
          position: "absolute", top: -6, right: -8, minWidth: 18, height: 18, padding: "0 5px",
          background: "var(--accent)", color: "white", fontSize: 11, fontWeight: 700,
          borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-body)", letterSpacing: "0"
        }}>{count}</div>
      )}
    </div>
  );
}

// ── Generic icon set ──────────────────────────────────────────────────
function Icon({ name, size = 18, stroke = 1.6, color = "currentColor" }) {
  const paths = {
    back: <path d="M15 18 L9 12 L15 6" />,
    close: <path d="M6 6 L18 18 M18 6 L6 18" />,
    plus: <path d="M12 5 V 19 M5 12 H 19" />,
    minus: <path d="M5 12 H 19" />,
    check: <path d="M5 13 L 10 18 L 19 7" />,
    chevdown: <path d="M6 9 L 12 15 L 18 9" />,
    chevright: <path d="M9 6 L 15 12 L 9 18" />,
    search: <g><circle cx="11" cy="11" r="6" /><path d="M16 16 L 20 20" /></g>,
    trash: <g><path d="M4 6 H 20" /><path d="M9 6 V 4 H 15 V 6" /><path d="M6 6 L 7 20 H 17 L 18 6" /></g>,
    edit: <g><path d="M4 20 L 8 19 L 19 8 L 16 5 L 5 16 Z" /><path d="M14 7 L 17 10" /></g>,
    upload: <g><path d="M12 4 V 16" /><path d="M7 9 L 12 4 L 17 9" /><path d="M4 18 V 20 H 20 V 18" /></g>,
    image: <g><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="M21 17 L 15 11 L 5 19" /></g>,
    user: <g><circle cx="12" cy="8" r="4" /><path d="M4 20 Q 12 14 20 20" /></g>,
    bag: <g><path d="M5 8 H 19 L 18 20 H 6 Z" /><path d="M8 8 V 6 A 4 4 0 0 1 16 6 V 8" /></g>,
    box: <g><path d="M4 8 L 12 4 L 20 8 L 20 18 L 12 22 L 4 18 Z" /><path d="M4 8 L 12 12 L 20 8" /><path d="M12 12 V 22" /></g>,
    grid: <g><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></g>,
    settings: <g><circle cx="12" cy="12" r="3" /><path d="M12 3 V 5 M12 19 V 21 M5 12 H 3 M21 12 H 19 M6.3 6.3 L 5 5 M19 19 L 17.7 17.7 M6.3 17.7 L 5 19 M19 5 L 17.7 6.3" /></g>,
    logout: <g><path d="M9 4 H 5 V 20 H 9" /><path d="M14 8 L 19 12 L 14 16" /><path d="M9 12 H 19" /></g>,
    filter: <path d="M4 5 H 20 L 14 12 V 19 L 10 17 V 12 Z" />,
    cart: <g><path d="M3 4 H 6 L 7.5 16.5 A 1.5 1.5 0 0 0 9 18 H 18 A 1.5 1.5 0 0 0 19.5 16.7 L 21 8 H 6.5" /><circle cx="10" cy="21" r="1" /><circle cx="17" cy="21" r="1" /></g>,
    eye: <g><path d="M2 12 Q 7 5 12 5 Q 17 5 22 12 Q 17 19 12 19 Q 7 19 2 12 Z" /><circle cx="12" cy="12" r="3" /></g>,
    bell: <g><path d="M6 16 V 11 A 6 6 0 0 1 18 11 V 16 L 20 18 H 4 Z" /><path d="M10 21 H 14" /></g>,
    arrowup: <g><path d="M12 19 V 5" /><path d="M5 12 L 12 5 L 19 12" /></g>,
    arrowdown: <g><path d="M12 5 V 19" /><path d="M5 12 L 12 19 L 19 12" /></g>,
    paid: <g><circle cx="12" cy="12" r="8" /><path d="M9 12 L 11 14 L 15 10" /></g>,
    home: <g><path d="M3 11 L 12 4 L 21 11 V 20 H 14 V 14 H 10 V 20 H 3 Z" /></g>,
    info: <g><circle cx="12" cy="12" r="9" /><path d="M12 8 V 8.01 M12 12 V 16" strokeLinecap="round" /></g>,
    whatsapp: <g><path d="M4 20 L 5.5 15.5 A 8 8 0 1 1 8.5 18.5 Z" /></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[name]}
    </svg>
  );
}

// ── iOS status bar (mobile screens) ───────────────────────────────────
function StatusBar({ time = "9:41" }) {
  return (
    <div className="lds-statusbar">
      <div>{time}</div>
      <div className="lds-statusbar-right">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="5" y="6" width="3" height="6" rx="0.5"/><rect x="10" y="3" width="3" height="9" rx="0.5"/><rect x="15" y="0" width="3" height="12" rx="0.5"/></svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 11.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM4 7.5C5.1 6.4 6.5 5.8 8 5.8s2.9.6 4 1.7l-1.4 1.4C9.9 8.2 9 7.8 8 7.8s-1.9.4-2.6 1.1L4 7.5zm-3-3C2.9 2.5 5.4 1.5 8 1.5s5.1 1 7 2.9l-1.4 1.4C12 4.3 10 3.5 8 3.5s-4 .8-5.6 2.3L1 4.5z"/></svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none" stroke="currentColor" strokeWidth="0.8"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" /><rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" stroke="none"/><rect x="23" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" stroke="none" /></svg>
      </div>
    </div>
  );
}

function HomeBar() {
  return <div className="lds-homebar"><div className="lds-homebar-pill" /></div>;
}

// ── Quantity stepper ─────────────────────────────────────────────────
function QtyStepper({ value, onChange, min = 1, size = "md" }) {
  const px = size === "sm" ? 6 : 10;
  const fs = size === "sm" ? 13 : 15;
  const w = size === "sm" ? 26 : 32;
  const btn = {
    width: w, height: w, border: "1px solid var(--line)", background: "var(--surface)",
    borderRadius: "var(--r-sm)", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", color: "var(--ink)"
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button style={btn} onClick={() => onChange?.(Math.max(min, (value || 1) - 1))}>
        <Icon name="minus" size={14} />
      </button>
      <div style={{ minWidth: 22, textAlign: "center", fontWeight: 600, fontSize: fs, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <button style={btn} onClick={() => onChange?.((value || 1) + 1)}>
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

// ── Stock badge for a product ────────────────────────────────────────
function StockBadge({ status }) {
  const cls = status === "ok" ? "lds-badge-stock-ok"
    : status === "low" ? "lds-badge-stock-low"
    : "lds-badge-stock-out";
  return <span className={"lds-badge " + cls}>{LDS.STOCK_LABEL[status]}</span>;
}

// ── Order status badge (admin) ───────────────────────────────────────
function OrderStatusBadge({ status }) {
  const map = {
    pending: "lds-badge-pending",
    done: "lds-badge-done",
    shipped: "lds-badge-shipped",
    cancel: "lds-badge-cancel"
  };
  return (
    <span className={"lds-badge " + map[status]}>
      <span className="dot" />
      {LDS.STATUS_LABEL[status]}
    </span>
  );
}

// ── Admin shell (sidebar + topbar) ───────────────────────────────────
function AdminShell({ section, children, page }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "products", label: "Productos", icon: "box" },
    { id: "orders", label: "Pedidos", icon: "bag" },
    { id: "settings", label: "Ajustes", icon: "settings" }
  ];
  return (
    <div className="lds-screen" style={{ display: "flex", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: "var(--surface)", borderRight: "1px solid var(--line)",
        display: "flex", flexDirection: "column", flexShrink: 0
      }}>
        <div style={{ padding: "20px 18px 24px", borderBottom: "1px solid var(--line-2)" }}>
          <Logo size="md" />
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>Administrador</div>
        </div>
        <nav style={{ padding: 10, flex: 1 }}>
          {navItems.map(n => {
            const active = n.id === section;
            return (
              <div key={n.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: "var(--r-sm)",
                background: active ? "var(--accent-tint)" : "transparent",
                color: active ? "var(--accent-ink)" : "var(--ink-2)",
                fontWeight: active ? 600 : 500, fontSize: 14, cursor: "pointer",
                marginBottom: 2
              }}>
                <Icon name={n.icon} size={16} />
                {n.label}
              </div>
            );
          })}
        </nav>
        <div style={{ padding: 12, borderTop: "1px solid var(--line-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--accent-tint)", color: "var(--accent-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>CM</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}>Carlos M.</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Admin</div>
            </div>
            <Icon name="logout" size={15} color="var(--ink-3)" />
          </div>
        </div>
      </aside>
      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {page && (
          <header style={{
            height: 64, borderBottom: "1px solid var(--line)", background: "var(--surface)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 28px", flexShrink: 0
          }}>
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 700 }}>{page.title}</h2>
              {page.subtitle && <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 2 }}>{page.subtitle}</div>}
            </div>
            {page.action}
          </header>
        )}
        <main style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ── Mobile header (storefront) ───────────────────────────────────────
function MobileHeader({ cartCount = 0, title, back, action }) {
  return (
    <header style={{
      height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 16px", background: "var(--surface)", borderBottom: "1px solid var(--line-2)",
      flexShrink: 0
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {back && <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface-alt)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="back" size={18} /></div>}
        {title ? <h3 style={{ fontSize: 17, fontWeight: 700 }}>{title}</h3> : <Logo size="md" />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {action}
        <CartIcon count={cartCount} />
      </div>
    </header>
  );
}

// ── Money displayer ──────────────────────────────────────────────────
function Money({ value, size = "md", weight = 600 }) {
  const sz = size === "lg" ? 28 : size === "sm" ? 13 : 16;
  return (
    <div style={{ fontWeight: weight, fontSize: sz, color: "var(--ink)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
      {LDS.formatCOP(value)}
    </div>
  );
}

Object.assign(window, { Logo, ProductGlyph, CartIcon, Icon, StatusBar, HomeBar, QtyStepper, StockBadge, OrderStatusBadge, AdminShell, MobileHeader, Money });
