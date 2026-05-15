// Tienda La Banda — shared types

export type GlyphKind =
  | "shirt"
  | "hoodie"
  | "cap"
  | "scarf"
  | "stickers"
  | "thermos"
  | "longsleeve";

export type StockStatus = "ok" | "low" | "out";
export type OrderStatus = "pending" | "done" | "shipped" | "cancel";

export interface Product {
  id: string;
  name: string;
  price: number; // pesos colombianos, sin decimales
  stock: number;
  status: StockStatus;
  color: string; // tinte del glyph placeholder
  glyph: GlyphKind;
  desc: string;
  tags: string[];
  /** URL de la foto real (cover). Mientras sea null se usa el glyph placeholder. */
  image?: string | null;
  /** Galería completa de fotos (URLs en sort_order). Poblado por getProductWithImages. */
  gallery?: string[];
  /** true = producto de muestra, aún sin foto/nombre definitivo. */
  placeholder?: boolean;
}

export interface Order {
  id: number;
  customer: string;
  email: string;
  phone: string;
  total: number;
  date: string;
  status: OrderStatus;
  items: number;
}

export interface Settings {
  storeName: string;
  whatsapp: string;
  shippingInfo: string;
}

export interface CartLine {
  productId: string;
  qty: number;
  size?: string;
}
