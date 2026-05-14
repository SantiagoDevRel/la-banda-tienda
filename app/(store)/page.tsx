import { Catalog } from "@/components/storefront/Catalog";
import { StoreHeader } from "@/components/StoreHeader";

// 01 · Catálogo — home / storefront landing.
export default function CatalogPage() {
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
        <Catalog />
      </div>
    </div>
  );
}
