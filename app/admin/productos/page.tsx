// Admin products list — ScreenProducts
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { Icon, ProductGlyph } from "@/components/icons";
import { StockBadge } from "@/components/ui";
import { formatCOP } from "@/lib/data";
import { getAllProducts } from "@/lib/queries";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <AdminShell
      section="products"
      page={{
        title: "Productos",
        subtitle: `${products.length} referencias en catálogo`,
        action: (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="lds-btn lds-btn-secondary lds-btn-sm admin-desktop-only">
              <Icon name="upload" size={15} color="var(--ink-2)" />
              Exportar
            </button>
            <Link
              href="/admin/productos/nuevo"
              className="lds-btn lds-btn-primary lds-btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Icon name="plus" size={15} color="white" stroke={2} />
              <span className="admin-desktop-only">Nuevo producto</span>
              <span className="admin-mobile-only">Nuevo</span>
            </Link>
          </div>
        ),
      }}
    >
      {/* Search + filters bar */}
      <div className="admin-search-bar" style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <div
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <Icon name="search" size={16} color="var(--ink-3)" />
          </div>
          <input
            className="lds-input"
            placeholder="Buscar productos…"
            style={{ paddingLeft: 36 }}
          />
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

      {/* ── Desktop table ── */}
      <div
        className="admin-desktop-only"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
        }}
      >
        <table className="lds-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>
              <th>Producto</th>
              <th>Categoría</th>
              <th style={{ textAlign: "right" }}>Precio</th>
              <th style={{ textAlign: "right" }}>Stock</th>
              <th>Estado</th>
              <th style={{ width: 100 }}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ paddingRight: 0 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "var(--surface-alt)",
                      borderRadius: "var(--r-sm)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                      />
                    ) : (
                      <ProductGlyph
                        kind={p.glyph}
                        color={p.color}
                        bare
                        style={{ width: 30, height: 30 }}
                      />
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>
                  {p.name}
                  {!p.placeholder && !p.image && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 10,
                        color: "var(--ink-3)",
                        fontWeight: 400,
                      }}
                    >
                      (sin foto)
                    </span>
                  )}
                </td>
                <td
                  style={{
                    color: "var(--ink-2)",
                    textTransform: "capitalize",
                  }}
                >
                  {p.tags[0]}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 600,
                  }}
                >
                  {formatCOP(p.price)}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                    color: p.stock === 0 ? "var(--ink-3)" : "var(--ink)",
                  }}
                >
                  {p.stock}
                </td>
                <td>
                  <StockBadge status={p.status} />
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Link
                      href={`/admin/productos/nuevo?edit=${p.id}`}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "var(--r-sm)",
                        border: "1px solid var(--line)",
                        background: "var(--surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      title="Editar"
                    >
                      <Icon name="edit" size={14} color="var(--ink-2)" />
                    </Link>
                    <DeleteProductButton productId={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    color: "var(--ink-3)",
                    padding: "32px 0",
                    fontSize: 13,
                  }}
                >
                  No hay productos. Creá el primero.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card list ── */}
      <div className="admin-mobile-only" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {products.map((p) => (
          <div key={p.id} className="admin-product-card">
            {/* Thumbnail */}
            <div className="admin-product-card-thumb">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />
              ) : (
                <ProductGlyph
                  kind={p.glyph}
                  color={p.color}
                  bare
                  style={{ width: 40, height: 40 }}
                />
              )}
            </div>

            {/* Body */}
            <div className="admin-product-card-body">
              <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>
                {p.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2, textTransform: "capitalize" }}>
                {p.tags[0]}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {formatCOP(p.price)}
                </span>
                <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                  Stock: {p.stock}
                </span>
                <StockBadge status={p.status} />
              </div>

              {/* Action buttons — full width, easy to tap */}
              <div className="admin-product-card-actions">
                <Link
                  href={`/admin/productos/nuevo?edit=${p.id}`}
                  className="lds-btn lds-btn-secondary lds-btn-sm"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  <Icon name="edit" size={14} color="var(--ink-2)" />
                  Editar
                </Link>
                <DeleteProductButton productId={p.id} mobile />
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "var(--ink-3)",
              padding: "40px 0",
              fontSize: 13,
            }}
          >
            No hay productos. Creá el primero.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
