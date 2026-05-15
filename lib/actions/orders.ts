"use server";

// Tienda La Banda — server action: createOrder
// Uploads payment screenshot to Supabase Storage, then calls the
// create_order RPC (atomic: validates stock, snapshots prices, decrements stock).

import { createClient } from "@/lib/supabase/server";
import { sendNewOrderEmail } from "@/lib/email";
import type { GlyphKind } from "@/lib/types";

export interface OrderCartItem {
  productId: string;
  quantity: number;
  size?: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface CreateOrderResult {
  ok: true;
  orderNumber: number;
  orderId: string;
  items: {
    name: string;
    qty: number;
    lineTotal: number;
    glyph: GlyphKind;
    color: string;
    image: string | null;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface CreateOrderError {
  ok: false;
  message: string;
}

export async function createOrder(
  customer: OrderCustomer,
  cartItems: OrderCartItem[],
  screenshotFile: FormData,
): Promise<CreateOrderResult | CreateOrderError> {
  const supabase = await createClient();

  // 1. Upload payment screenshot
  const file = screenshotFile.get("screenshot") as File | null;
  if (!file) {
    return { ok: false, message: "No se encontró el comprobante de pago." };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("payment-screenshots")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[createOrder] upload error:", uploadError.message);
    return {
      ok: false,
      message: "Error al subir el comprobante. Intentá de nuevo.",
    };
  }

  // 2. Call the create_order RPC
  const rpcItems = cartItems.map((it) => ({
    product_id: it.productId,
    quantity: it.quantity,
    size: it.size ?? null,
  }));

  const { data: rpcData, error: rpcError } = await supabase.rpc("create_order", {
    p_customer_name: customer.name,
    p_customer_email: customer.email,
    p_customer_phone: customer.phone,
    p_customer_address: customer.address,
    p_customer_city: customer.city,
    p_items: rpcItems,
    p_screenshot_path: path,
  });

  if (rpcError || !rpcData || rpcData.length === 0) {
    console.error("[createOrder] RPC error:", rpcError?.message);
    // Clean up the uploaded file on failure
    await supabase.storage.from("payment-screenshots").remove([path]);
    return {
      ok: false,
      message:
        rpcError?.message?.includes("stock")
          ? "Uno o más productos ya no tienen stock suficiente. Revisá tu carrito."
          : "Error al crear el pedido. Intentá de nuevo.",
    };
  }

  const { new_order_id, new_order_number } = rpcData[0];

  // 3. Fetch order items for the confirmation snapshot + email
  const { data: itemRows } = await supabase
    .from("order_items")
    .select("product_name,unit_price,quantity,size,product_id")
    .eq("order_id", new_order_id);

  // Fetch product details (glyph/color/image) for each item
  const productIds = [
    ...new Set(
      (itemRows ?? [])
        .map((it) => it.product_id)
        .filter((id): id is string => id !== null),
    ),
  ];

  const { data: productRows } = productIds.length
    ? await supabase
        .from("products")
        .select("id,glyph,color,image_url")
        .in("id", productIds)
    : { data: [] };

  const productMap = new Map(
    (productRows ?? []).map((p) => [p.id, p]),
  );

  const items = (itemRows ?? []).map((it) => {
    const prod = it.product_id ? productMap.get(it.product_id) : undefined;
    return {
      name: it.product_name,
      qty: it.quantity,
      lineTotal: it.unit_price * it.quantity,
      glyph: (prod?.glyph ?? "shirt") as GlyphKind,
      color: prod?.color ?? "#1E7A3D",
      image: prod?.image_url ?? null,
    };
  });

  // 4. Fetch order totals for confirmation
  const { data: orderRow } = await supabase
    .from("orders")
    .select("subtotal,shipping,total")
    .eq("id", new_order_id)
    .single();

  const subtotal = orderRow?.subtotal ?? 0;
  const shipping = orderRow?.shipping ?? 0;
  const total = orderRow?.total ?? 0;

  // 5. Send notification email (fire-and-forget — never throw)
  sendNewOrderEmail({
    orderNumber: new_order_number,
    orderId: new_order_id,
    customerName: customer.name,
    customerEmail: customer.email,
    items,
    total,
  }).catch((err) =>
    console.error("[createOrder] email send failed:", err),
  );

  return {
    ok: true,
    orderNumber: new_order_number,
    orderId: new_order_id,
    items,
    subtotal,
    shipping,
    total,
  };
}
