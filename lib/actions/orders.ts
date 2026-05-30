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

  // 0. AUTHORITATIVE stock check with FRESH data from the DB — BEFORE we upload
  // anything or touch the RPC. A cart line is stale by nature: the customer may
  // have added a product hours/days ago and the stock has since dropped to 0 (or
  // below their quantity). localStorage keeps that line alive, so the client cart
  // can NOT be trusted — we re-validate against the live `products.stock` here.
  // (The create_order RPC is the race-safe atomic guard for concurrent drains;
  // this is the friendly, fresh-data gate that catches the common case with a
  // clear message and avoids uploading a screenshot for a doomed order.)
  if (!cartItems || cartItems.length === 0) {
    return { ok: false, message: "Tu carrito está vacío." };
  }

  const productIds = [...new Set(cartItems.map((it) => it.productId))];
  const { data: stockRows, error: stockError } = await supabase
    .from("products")
    .select("id, name, stock, is_active")
    .in("id", productIds);

  if (stockError) {
    console.error("[createOrder] stock check error:", stockError.message);
    return {
      ok: false,
      message: "No pudimos verificar el inventario. Intentá de nuevo.",
    };
  }

  const stockById = new Map((stockRows ?? []).map((r) => [r.id, r]));
  const unavailable: string[] = [];
  for (const it of cartItems) {
    const row = stockById.get(it.productId);
    // Unavailable if: product gone, soft-deleted, or not enough stock for the
    // requested qty. `stock < quantity` already covers stock 0 (0 < 1).
    if (!row || !row.is_active || it.quantity < 1 || row.stock < it.quantity) {
      unavailable.push(row?.name ?? "Un producto");
    }
  }
  if (unavailable.length > 0) {
    const names = [...new Set(unavailable)].join(", ");
    return {
      ok: false,
      message: `Ya no hay stock de: ${names}. Quitá ese producto del carrito para continuar.`,
    };
  }

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

  // 5. Send notification email — con el comprobante de pago y el diseño del
  // bombo ADJUNTOS, así llegan dentro del correo (no hay que entrar al panel).
  // Las imágenes ya vienen comprimidas del cliente (lib/imageCompress).
  const emailAttachments: { filename: string; content: string }[] = [];
  try {
    const screenshotExt = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    emailAttachments.push({
      filename: `comprobante-pago-${new_order_number}.${screenshotExt}`,
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    });
    if (artworkFile && artworkFile.size > 0) {
      const artExt = (artworkFile.name.split(".").pop() ?? "jpg").toLowerCase();
      emailAttachments.push({
        filename: `diseno-bombo-${new_order_number}.${artExt}`,
        content: Buffer.from(await artworkFile.arrayBuffer()).toString("base64"),
      });
    }
  } catch (err) {
    console.error("[createOrder] could not build email attachments:", err);
  }

  // IMPORTANT: we AWAIT this. With fire-and-forget the serverless function
  // can terminate before the Resend API call completes and the email gets
  // silently lost. ~200ms latency in exchange for actually delivering.
  try {
    await sendNewOrderEmail({
      orderNumber: new_order_number,
      orderId: new_order_id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      deliveryMethod: customer.deliveryMethod,
      items,
      total,
      attachments: emailAttachments,
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
