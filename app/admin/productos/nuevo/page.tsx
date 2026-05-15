// Admin product form — ScreenProductForm (create + edit)
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ProductFormFields } from "@/components/admin/ProductFormFields";
import { getProduct, getProductImagesForEdit } from "@/lib/queries";
import type { ProductImageRow } from "@/lib/queries";
import type { Product } from "@/lib/types";

export default async function NuevoProductoPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit: editId } = await searchParams;

  let editProduct: Product | null = null;
  let editImages: ProductImageRow[] = [];

  if (editId) {
    editProduct = await getProduct(editId);
    if (editProduct) {
      editImages = await getProductImagesForEdit(editId);
    }
  }

  return (
    <AdminShell
      section="products"
      page={{
        title: editProduct ? "Editar producto" : "Nuevo producto",
        subtitle: editProduct
          ? `Productos → ${editProduct.name}`
          : "Productos → Nuevo",
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
      <ProductFormFields
        editProduct={editProduct}
        editImages={editImages}
      />
    </AdminShell>
  );
}
