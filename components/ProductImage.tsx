// Shows the real product photo when available, otherwise the glyph placeholder.
// Drop a URL into product.image (Supabase Storage later) and this swaps over.

import type { Product } from "@/lib/types";
import { ProductGlyph } from "./icons";

export function ProductImage({ product }: { product: Product }) {
  if (product.image) {
    return (
      <div className="lds-prodfig" style={{ background: "var(--surface-alt)" }}>
        {/* plain <img>: source is user-uploaded / dynamic, not build-time known.
            loading="lazy": las portadas fuera de pantalla NO se descargan hasta
            que el cliente scrollea → menos egress de Supabase Storage. */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }
  return <ProductGlyph kind={product.glyph} color={product.color} />;
}
