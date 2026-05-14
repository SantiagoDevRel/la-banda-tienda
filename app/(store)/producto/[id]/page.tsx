import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/storefront/ProductDetail";
import { StoreHeader } from "@/components/StoreHeader";
import { getProduct, PRODUCTS } from "@/lib/data";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

// 03 · Detalle de producto
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <div className="store-screen">
      <StoreHeader back />
      <ProductDetail product={product} />
    </div>
  );
}
