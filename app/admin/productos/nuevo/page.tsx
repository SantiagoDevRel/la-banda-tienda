// Admin product form — ScreenProductForm
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ProductFormFields } from "@/components/admin/ProductFormFields";

export default function NuevoProductoPage() {
  return (
    <AdminShell
      section="products"
      page={{
        title: "Nuevo producto",
        subtitle: "Productos → Nuevo",
        action: (
          <div style={{ display: "flex", gap: 10 }}>
            <Link
              href="/admin/productos"
              className="lds-btn lds-btn-ghost lds-btn-sm"
            >
              Cancelar
            </Link>
          </div>
        ),
      }}
    >
      <ProductFormFields />
    </AdminShell>
  );
}
