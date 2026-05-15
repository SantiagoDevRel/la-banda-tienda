import { Catalog } from "@/components/storefront/Catalog";
import { StoreHeader } from "@/components/StoreHeader";
import { getActiveProducts } from "@/lib/queries";

// 01 · Catálogo — home / storefront landing.
export default async function CatalogPage() {
  const products = await getActiveProducts();

  return (
    <div className="store-screen">
      <StoreHeader />
      <div className="store-body">
        <div className="store-hero">
          <div className="store-hero__eyebrow">Colección 2026</div>
          <h1 className="store-hero__title">
            Llevá los colores
            <br />a donde vayas.
          </h1>
        </div>
        <Catalog products={products} />
      </div>
    </div>
  );
}
