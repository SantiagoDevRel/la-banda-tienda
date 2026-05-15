"use server";

// Tienda La Banda — admin server actions for order management.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendShippedEmail } from "@/lib/email";
import { getStoreSettings } from "@/lib/queries";
import type { Database } from "@/lib/database.types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("No autorizado");
  }
  return { supabase, user };
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  notifyCustomer = false,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.rpc("update_order_status", {
      p_order_id: orderId,
      p_new_status: newStatus,
    });

    if (error) {
      console.error("[updateOrderStatus] RPC error:", error.message);
      return { ok: false, message: error.message };
    }

    // Pago revisado: el admin actuó sobre el pedido (finalizó / envió /
    // canceló), así que el comprobante ya cumplió su función. Se borra del
    // Storage para no acumular almacenamiento — el pedido queda como
    // "pago verificado · comprobante archivado".
    if (newStatus !== "pending") {
      const { data: ord } = await supabase
        .from("orders")
        .select("payment_screenshot_path")
        .eq("id", orderId)
        .single();
      if (ord?.payment_screenshot_path) {
        await supabase.storage
          .from("payment-screenshots")
          .remove([ord.payment_screenshot_path]);
        await supabase
          .from("orders")
          .update({ payment_screenshot_path: null })
          .eq("id", orderId);
      }
    }

    // Send shipped email if requested
    if (newStatus === "shipped" && notifyCustomer) {
      const { data: order } = await supabase
        .from("orders")
        .select("order_number,customer_name,customer_email")
        .eq("id", orderId)
        .single();

      if (order) {
        const settings = await getStoreSettings();
        sendShippedEmail({
          orderNumber: order.order_number,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          whatsapp: settings.whatsapp,
        }).catch((err) =>
          console.error("[updateOrderStatus] email failed:", err),
        );
      }
    }

    revalidatePath(`/admin/ordenes/${orderId}`);
    revalidatePath("/admin/ordenes");
    revalidatePath("/admin");

    return { ok: true };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}
