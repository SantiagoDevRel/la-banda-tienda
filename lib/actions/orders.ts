"use server";

// Tienda La Banda — server action: createOrder
// Uploads payment screenshot to Supabase Storage, then calls the
// create_order RPC (atomic: validates stock, snapshots prices, decrements stock).
// The RPC returns the totals + an items snapshot so we never have to SELECT the
// order back — orders/order_items are RLS-restricted to is_admin(), so the anon
// customer could not read their own order (that bug showed $0 / no items on the
// confirmation screen and in the band's email).

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
  department: string;
  deliveryMethod: "shipping" | "pickup";
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

  // 1b. Upload the custom artwork if present (customizable products: el bombo).
  let artworkPath: string | null = null;
  const artworkFile = screenshotFile.get("artwork") as File | null;
  if (artworkFile && artworkFile.size > 0) {
    const aExt = artworkFile.name.split(".").pop() ?? "jpg";
    const aPath = `artwork-${crypto.randomUUID()}.${aExt}`;
    const { error: aErr } = await supabase.storage
      .from("payment-screenshots")
      .upload(aPath, artworkFile, {
        contentType: artworkFile.type,
        upsert: false,
      });
    if (aErr) {
      console.error("[createOrder] artwork upload error:", aErr.message);
    } else {
      artworkPath = aPath;
    }
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
    p_customer_department: customer.department,
    p_delivery_method: customer.deliveryMethod,
    p_items: rpcItems,
    p_screenshot_path: path,
    p_custom_artwork_path: artworkPath ?? undefined,
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

  // 3. Read totals + item snapshot straight from the RPC return.
  // IMPORTANT: we do NOT SELECT back from orders/order_items here — RLS only
  // allows is_admin() to read those, so the anonymous customer who just placed
  // the order would get empty rows (confirmation + email showing $0 / no items).
  // The RPC runs SECURITY DEFINER and returns everything we need.
  const {
    new_order_id,
    new_order_number,
    out_subtotal,
    out_shipping,
    out_total,
    out_items,
  } = rpcData[0];

  const items = ((out_items ?? []) as Array<{
    name: string;
    qty: number;
    lineTotal: number;
    glyph: string | null;
    color: string | null;
    image: string | null;
  }>).map((it) => ({
    name: it.name,
    qty: it.qty,
    lineTotal: it.lineTotal,
    glyph: (it.glyph ?? "shirt") as GlyphKind,
    color: it.color ?? "#1E7A3D",
    image: it.image ?? null,
  }));

  const subtotal = out_subtotal ?? 0;
  const shipping = out_shipping ?? 0;
  const total = out_total ?? 0;

  // 5. Send notification email.
  // IMPORTANT: we AWAIT this. With fire-and-forget the serverless function
  // can terminate before the Resend API call completes and the email gets
  // silently lost. ~200ms latency in exchange for actually delivering.
  try {
    await sendNewOrderEmail({
      orderNumber: new_order_number,
      orderId: new_order_id,
      customerName: customer.name,
      customerEmail: customer.email,
      items,
      total,
    });
  } catch (err) {
    console.error("[createOrder] email send failed:", err);
  }

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
