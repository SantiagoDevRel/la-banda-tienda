// Tienda La Banda — server-side Supabase query helpers.
// All functions use the server client (cookies-aware, respects RLS).

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";
import type { Product, Order, Settings } from "@/lib/types";

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
    nequiNumber: row.nequi_number,
    nequiHolder: row.nequi_holder,
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
): Order & { orderId: string; subtotal: number; shipping: number } {
  return {
    id: row.order_number,
    orderId: row.id,
    customer: row.customer_name,
    email: row.customer_email,
    phone: row.customer_phone ?? "",
    total: row.total,
    subtotal: row.subtotal,
    shipping: row.shipping,
    date: new Date(row.created_at).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: row.status as Order["status"],
    items: itemCount,
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

/** All products (active + inactive) for the admin. */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
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
      nequiNumber: "",
      nequiHolder: "",
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
  adminNotes: string | null;
  paymentScreenshotPath: string | null;
  orderItems: OrderItem[];
  screenshotUrl: string | null;
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

  const base = dbOrderToOrder(order as DbOrder, orderItems.length);

  return {
    ...base,
    customerAddress: order.customer_address,
    customerCity: order.customer_city,
    adminNotes: order.admin_notes,
    paymentScreenshotPath: order.payment_screenshot_path,
    orderItems,
    screenshotUrl,
  };
}

// ── Dashboard metrics ───────────────────────────────────────────────────────

export interface DashboardMetrics {
  pendingCount: number;
  todayCount: number;
  todayRevenue: number;
  totalOrders: number;
  lowStockCount: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [pendingRes, todayRes, totalRes, lowStockRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("orders")
      .select("total")
      .gte("created_at", todayStart.toISOString()),
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
