// Admin products list — ScreenProducts
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { Icon, ProductGlyph } from "@/components/icons";
import { StockBadge } from "@/components/ui";
import { PRODUCTS, formatCOP } from "@/lib/data";

export default function ProductsPage() {
  return (
    <AdminShell
      section="products"
      page={{
        title: "Productos",
        subtitle: `${PRODUCTS.length} referencias en catálogo`,
        action: (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="lds-btn lds-btn-secondary lds-btn-sm">
              <Icon name="upload" size={15} color="var(--ink-2)" />
              Exportar
            </button>
            <Link
              href="/admin/productos/nuevo"
              className="lds-btn lds-btn-primary lds-btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Icon name="plus" size={15} color="white" stroke={2} />
              Nuevo producto
            </Link>
          </div>
        ),
      }}
    >
      {/* Search + filters bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
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

      <div
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
            {PRODUCTS.map((p) => (
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
                    }}
                  >
                    <ProductGlyph
                      kind={p.glyph}
                      color={p.color}
                      bare
                      style={{ width: 30, height: 30 }}
                    />
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
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
                    <button
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
                      title="Eliminar"
                    >
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
