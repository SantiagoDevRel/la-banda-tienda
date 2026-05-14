// Tienda La banda — mock data (productos, pedidos, ajustes)
// Esto se reemplaza por Supabase en la fase de backend. Por ahora alimenta la UI.

import type { Order, Product, Settings, StockStatus } from "./types";

/** Formato de pesos colombianos: 45000 -> "$ 45.000" */
export function formatCOP(n: number): string {
  const s = Math.round(Math.abs(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (n < 0 ? "-$ " : "$ ") + s;
}

// ── Costos de envío ────────────────────────────────────────────
export const SHIPPING_COST = 12000;
export const FREE_SHIPPING_MIN = 200000;

// ── 5 productos placeholder ───────────────────────────────────
// Santiago envía las fotos y nombres reales después; mientras tanto
// se renderiza el glyph SVG como imagen placeholder.
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Producto de muestra 1",
    price: 89000,
    stock: 24,
    status: "ok",
    color: "#1E7A3D",
    glyph: "shirt",
    desc: "Descripción de ejemplo. Reemplazá este texto y la foto cuando tengas la información definitiva del producto.",
    tags: ["camisetas"],
    image: null,
    placeholder: true,
  },
  {
    id: "p2",
    name: "Producto de muestra 2",
    price: 165000,
    stock: 12,
    status: "ok",
    color: "#155A2B",
    glyph: "hoodie",
    desc: "Descripción de ejemplo. Reemplazá este texto y la foto cuando tengas la información definitiva del producto.",
    tags: ["abrigos"],
    image: null,
    placeholder: true,
  },
  {
    id: "p3",
    name: "Producto de muestra 3",
    price: 55000,
    stock: 3,
    status: "low",
    color: "#1E7A3D",
    glyph: "cap",
    desc: "Descripción de ejemplo. Reemplazá este texto y la foto cuando tengas la información definitiva del producto.",
    tags: ["accesorios"],
    image: null,
    placeholder: true,
  },
  {
    id: "p4",
    name: "Producto de muestra 4",
    price: 75000,
    stock: 9,
    status: "ok",
    color: "#1E293B",
    glyph: "thermos",
    desc: "Descripción de ejemplo. Reemplazá este texto y la foto cuando tengas la información definitiva del producto.",
    tags: ["accesorios"],
    image: null,
    placeholder: true,
  },
  {
    id: "p5",
    name: "Producto de muestra 5",
    price: 45000,
    stock: 0,
    status: "out",
    color: "#15803D",
    glyph: "scarf",
    desc: "Descripción de ejemplo. Reemplazá este texto y la foto cuando tengas la información definitiva del producto.",
    tags: ["accesorios"],
    image: null,
    placeholder: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export const STOCK_LABEL: Record<StockStatus, string> = {
  ok: "Disponible",
  low: "Últimas unidades",
  out: "Agotado",
};

export const CATEGORIES = ["Todos", "Camisetas", "Abrigos", "Accesorios"];

// ── Carrito inicial (semilla para demo del flujo) ─────────────
// El carrito real es interactivo y persiste en localStorage; esto solo
// pre-carga un par de items para que el flujo se pueda recorrer de una.
export const CART_SEED: { productId: string; qty: number }[] = [
  { productId: "p1", qty: 1 },
  { productId: "p3", qty: 2 },
];

// ── Pedidos (mock para el admin) ──────────────────────────────
export const ORDERS: Order[] = [
  { id: 1048, customer: "Camila Restrepo", email: "camila.r@gmail.com", phone: "300 412 8839", total: 187000, date: "Hoy · 14:22", status: "pending", items: 3 },
  { id: 1047, customer: "Andrés Mejía", email: "amejia@outlook.com", phone: "311 209 4471", total: 89000, date: "Hoy · 11:08", status: "pending", items: 1 },
  { id: 1046, customer: "Mariana Quintero", email: "mariq@gmail.com", phone: "320 887 1023", total: 220000, date: "Hoy · 09:51", status: "shipped", items: 2 },
  { id: 1045, customer: "Juan David López", email: "jdlopez@gmail.com", phone: "315 660 0091", total: 165000, date: "Ayer · 19:34", status: "done", items: 1 },
  { id: 1044, customer: "Sofía Vargas", email: "sofiav@gmail.com", phone: "318 554 2210", total: 134000, date: "Ayer · 16:02", status: "done", items: 3 },
  { id: 1043, customer: "Tomás Cárdenas", email: "tcardenas@hey.com", phone: "316 994 4480", total: 75000, date: "Ayer · 12:18", status: "cancel", items: 1 },
  { id: 1042, customer: "Laura González", email: "lauragn@gmail.com", phone: "302 778 1190", total: 252000, date: "Mar 12 · 18:40", status: "done", items: 4 },
];

export function getOrder(id: number): Order | undefined {
  return ORDERS.find((o) => o.id === id);
}

export const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Pendiente",
  done: "Finalizada",
  shipped: "Enviado",
  cancel: "Cancelada",
};

// ── Ajustes de la tienda ──────────────────────────────────────
export const SETTINGS: Settings = {
  storeName: "Tienda La banda",
  nequiNumber: "300 482 7791",
  nequiHolder: "Carlos Andrés Marín",
  whatsapp: "+57 300 482 7791",
  shippingInfo:
    "Envíos a todo Colombia con Servientrega. 2-4 días hábiles. Envío gratis en compras sobre $ 200.000.",
};

// ── Lista de clips del fondo rotativo (generados desde los 3 videos) ──
export const BG_CLIPS = [
  "bg-1", "bg-2", "bg-3", "bg-4", "bg-5", "bg-6", "bg-7", "bg-8", "bg-9",
];
