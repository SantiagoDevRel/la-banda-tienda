import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/storefront/ProductDetail";
import { StoreHeader } from "@/components/StoreHeader";
import { getProductWithImages } from "@/lib/queries";

// Dynamic route — products are served from DB, no static params.
export const dynamic = "force-dynamic";

// 03 · Detalle de producto
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductWithImages(id);
  if (!product) notFound();

  return (
    <div className="store-screen">
      <StoreHeader back />
      <ProductDetail product={product} />
    </div>
  );
}
