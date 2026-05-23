// Tienda La Banda — server-side Supabase query helpers.
// All functions use the server client (cookies-aware, respects RLS).

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";
import type { Product, Order, Settings } from "@/lib/types";
import { formatBogota, bogotaTodayStartISO } from "@/lib/time";

type DbProduct = Database["public"]["Tables"]["products"]["Row"];
type DbOrder = Database["public"]["Tables"]["orders"]["Row"];
type DbSettings = Database["public"]["Tables"]["store_settings"]["Row"];
type OrderStatus = Database["public"]["Enums"]["order_status"];

// ── Mapper: DB row → Product (matches components' expected shape) ──────────
export function dbProductToProduct(row: DbProduct): Product {
  const stockStatus = (row.stock_status ?? "ok") as Product["status"];
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    stock: row.stock,
    status: stockStatus,
    color: row.color,
    glyph: row.glyph as Product["glyph"],
    desc: row.description,
    tags: [row.category],
    image: row.image_url ?? null,
    customizable: row.customizable,
    placeholder: false,
  };
}

// ── Mapper: DB row → Settings ───────────────────────────────────────────────
export function dbSettingsToSettings(row: DbSettings): Settings & {
  shippingCost: number;
  freeShippingMin: number;
} {
  return {
    storeName: row.store_name,
    whatsapp: row.whatsapp,
    shippingInfo: row.shipping_info,
    shippingCost: row.shipping_cost,
    freeShippingMin: row.free_shipping_min,
  };
}

// ── Mapper: DB order row → Order ────────────────────────────────────────────
function dbOrderToOrder(
  row: DbOrder,
  itemCount: number = 0,
): Order & {
  orderId: string;
  subtotal: number;
  shipping: number;
  paymentValidated: boolean;
  paymentValidatedAt: string | null;
} {
  return {
    id: row.order_number,
    orderId: row.id,
    customer: row.customer_name,
    email: row.customer_email,
    phone: row.customer_phone ?? "",
    total: row.total,
    subtotal: row.subtotal,
    shipping: row.shipping,
    date: formatBogota(row.created_at),
    status: row.status as Order["status"],
    items: itemCount,
    paymentValidated: row.payment_validated,
    paymentValidatedAt: row.payment_validated_at,
  };
}

// ── Products ────────────────────────────────────────────────────────────────

/** Products visible to customers (is_active = true). */
export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getActiveProducts]", error.message);
    return [];
  }
  return (data ?? []).map(dbProductToProduct);
}

/** Active products for the admin list. Soft-deleted (is_active=false) ones
 *  no longer aparecen — "Eliminar" debe sentirse como eliminar de verdad. */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllProducts]", error.message);
    return [];
  }
  return (data ?? []).map(dbProductToProduct);
}

/** Single product by UUID — null if not found. */
export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return dbProductToProduct(data);
}

/** Product with full gallery from product_images (sorted by sort_order). */
export async function getProductWithImages(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(url, sort_order)")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const base = dbProductToProduct(data);

  // Sort gallery client-side and extract URLs
  type GalleryRow = { url: string; sort_order: number };
  const rawGallery = (data.product_images as GalleryRow[] | null) ?? [];
  const gallery = rawGallery
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((g) => g.url);

  return { ...base, gallery };
}

export interface ProductImageRow {
  id: string;
  url: string;
  sort_order: number;
}

/** Returns existing gallery rows for the admin edit form. */
export async function getProductImagesForEdit(productId: string): Promise<ProductImageRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_images")
    .select("id, url, sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getProductImagesForEdit]", error.message);
    return [];
  }
  return (data ?? []) as ProductImageRow[];
}

// ── Settings ────────────────────────────────────────────────────────────────

export async function getStoreSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    // Fallback so the app never crashes if settings row is missing
    return {
      storeName: "Tienda La Banda",
      whatsapp: "",
      shippingInfo: "",
      shippingCost: 12000,
      freeShippingMin: 200000,
    };
  }
  return dbSettingsToSettings(data);
}

// ── Orders ──────────────────────────────────────────────────────────────────

export type OrderRow = ReturnType<typeof dbOrderToOrder>;

export async function getOrders(statusFilter?: OrderStatus): Promise<OrderRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select("*, order_items(count)")
    .order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getOrders]", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    // Supabase returns count as [{count: N}]
    const countArr = row.order_items as unknown as { count: number }[];
    const itemCount = countArr?.[0]?.count ?? 0;
    const { order_items: _oi, ...orderRow } = row;
    return dbOrderToOrder(orderRow as DbOrder, itemCount);
  });
}

export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  unitPrice: number;
  quantity: number;
  size: string | null;
}

export interface OrderDetail extends OrderRow {
  customerAddress: string | null;
  customerCity: string | null;
  customerDepartment: string | null;
  deliveryMethod: string;
  adminNotes: string | null;
  paymentScreenshotPath: string | null;
  orderItems: OrderItem[];
  screenshotUrl: string | null;
  customArtworkUrl: string | null;
}

export async function getOrderWithItems(id: string): Promise<OrderDetail | null> {
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("id,product_id,product_name,unit_price,quantity,size")
    .eq("order_id", id)
    .order("created_at");

  const orderItems: OrderItem[] = (items ?? []).map((it) => ({
    id: it.id,
    productId: it.product_id,
    productName: it.product_name,
    unitPrice: it.unit_price,
    quantity: it.quantity,
    size: it.size,
  }));

  // Generate signed URL for the payment screenshot (valid 10 min)
  let screenshotUrl: string | null = null;
  if (order.payment_screenshot_path) {
    const { data: signedData } = await supabase.storage
      .from("payment-screenshots")
      .createSignedUrl(order.payment_screenshot_path, 600);
    screenshotUrl = signedData?.signedUrl ?? null;
  }

  // Signed URL for the custom artwork (bombo personalizado), if any.
  let customArtworkUrl: string | null = null;
  if (order.custom_artwork_path) {
    const { data: artData } = await supabase.storage
      .from("payment-screenshots")
      .createSignedUrl(order.custom_artwork_path, 600);
    customArtworkUrl = artData?.signedUrl ?? null;
  }

  const base = dbOrderToOrder(order as DbOrder, orderItems.length);

  return {
    ...base,
    customerAddress: order.customer_address,
    customerCity: order.customer_city,
    customerDepartment: order.customer_department,
    deliveryMethod: order.delivery_method,
    adminNotes: order.admin_notes,
    paymentScreenshotPath: order.payment_screenshot_path,
    orderItems,
    screenshotUrl,
    customArtworkUrl,
  };
}

// ── Payment methods ─────────────────────────────────────────────────────────

export type PaymentMethod =
  Database["public"]["Tables"]["payment_methods"]["Row"];

/** Active payment methods ordered by sort_order (storefront). */
export async function getActivePaymentMethods(): Promise<PaymentMethod[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getActivePaymentMethods]", error.message);
    return [];
  }
  return data ?? [];
}

/** All payment methods (active + inactive) for the admin. */
export async function getAllPaymentMethods(): Promise<PaymentMethod[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getAllPaymentMethods]", error.message);
    return [];
  }
  return data ?? [];
}

// ── Dashboard metrics ───────────────────────────────────────────────────────

export interface DashboardMetrics {
  pendingCount: number;
  todayCount: number;
  todayRevenue: number;
  totalOrders: number;
  lowStockCount: number;
}

/** Money bucket: separates product revenue (subtotal) from shipping. */
export interface RevenueBucket {
  count: number;
  product: number; // suma de subtotales (lo vendido en productos)
  shipping: number; // suma de envíos cobrados
  total: number; // product + shipping
}

export interface SalesSummary {
  pending: RevenueBucket; // pedidos por verificar
  confirmed: RevenueBucket; // pago verificado (done + shipped)
  combined: RevenueBucket; // pending + confirmed
}

const emptyBucket = (): RevenueBucket => ({
  count: 0,
  product: 0,
  shipping: 0,
  total: 0,
});

function addToBucket(b: RevenueBucket, subtotal: number, shipping: number) {
  b.count += 1;
  b.product += subtotal;
  b.shipping += shipping;
  b.total += subtotal + shipping;
}

/**
 * Resumen de ventas: total vendido (productos) vs envíos cobrados, separado
 * por pedidos pendientes y confirmados (done + shipped). Excluye cancelados.
 */
export async function getSalesSummary(): Promise<SalesSummary> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("status, subtotal, shipping")
    .neq("status", "cancel");

  const pending = emptyBucket();
  const confirmed = emptyBucket();
  const combined = emptyBucket();

  if (error) {
    console.error("[getSalesSummary]", error.message);
    return { pending, confirmed, combined };
  }

  for (const o of data ?? []) {
    const sub = o.subtotal ?? 0;
    const ship = o.shipping ?? 0;
    if (o.status === "pending") {
      addToBucket(pending, sub, ship);
    } else {
      // done | shipped — pago verificado
      addToBucket(confirmed, sub, ship);
    }
    addToBucket(combined, sub, ship);
  }

  return { pending, confirmed, combined };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  // "Hoy" según el calendario colombiano, no el del servidor (UTC).
  const todayStart = bogotaTodayStartISO();

  const [pendingRes, todayRes, totalRes, lowStockRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("orders")
      .select("total")
      .gte("created_at", todayStart),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .in("stock_status", ["low", "out"]),
  ]);

  const todayOrders = todayRes.data ?? [];
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);

  return {
    pendingCount: pendingRes.count ?? 0,
    todayCount: todayOrders.length,
    todayRevenue,
    totalOrders: totalRes.count ?? 0,
    lowStockCount: lowStockRes.count ?? 0,
  };
}
