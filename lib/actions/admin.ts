"use server";

// Tienda La Banda — admin server actions for order management.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  sendPaymentValidatedEmail,
  sendShippedEmail,
  sendErrorAlertEmail,
} from "@/lib/email";
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
          bodyTemplate: settings.messages.emailEnviado,
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

/**
 * Dispara una ALERTA DE PRUEBA al correo de la banda para confirmar que el
 * pipeline de emails de error funciona (RESEND_API_KEY seteada, destinatario
 * correcto). Admin-gated. Úsala una vez tras configurar Resend en Vercel.
 */
export async function sendTestErrorAlert(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  try {
    await requireAdmin();
    await sendErrorAlertEmail({
      context: "PRUEBA manual desde el panel admin",
      errorMessage:
        "Esto es una alerta de PRUEBA. Si la recibís, las alertas de error funcionan.",
      details: { disparada_por: "admin", nota: "Ignorar — es solo un test." },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}

/**
 * Marca el pedido como "pago validado" (o lo desmarca). El RPC devuelve
 * true solo si fue una transición false→true; en ese caso disparamos el
 * correo al cliente con la copia de "ya validamos tu pago".
 */
export type SetPaymentValidatedResult =
  | {
      ok: true;
      /** "sent" = Resend aceptó. "skipped" = no era transición false→true. */
      email: "sent" | "skipped" | { failed: true; reason: string };
    }
  | { ok: false; message: string };

export async function setPaymentValidated(
  orderId: string,
  validated: boolean,
): Promise<SetPaymentValidatedResult> {
  try {
    const { supabase } = await requireAdmin();

    const { data: changedToTrue, error } = await supabase.rpc(
      "set_payment_validated",
      { p_order_id: orderId, p_validated: validated },
    );

    if (error) {
      console.error("[setPaymentValidated] RPC error:", error.message);
      return { ok: false, message: error.message };
    }

    revalidatePath(`/admin/ordenes/${orderId}`);
    revalidatePath("/admin/ordenes");
    revalidatePath("/admin");

    if (!changedToTrue) {
      return { ok: true, email: "skipped" };
    }

    const { data: order } = await supabase
      .from("orders")
      .select("order_number,customer_email,total")
      .eq("id", orderId)
      .single();

    if (!order) {
      return { ok: true, email: { failed: true, reason: "Pedido no encontrado tras el update." } };
    }

    // Esperamos el resultado real para mostrarle al admin si Resend aceptó
    // o rechazó (típico: sender no verificado, sandbox limitando destinatarios).
    const settings = await getStoreSettings();
    const sendRes = await sendPaymentValidatedEmail({
      orderNumber: order.order_number,
      customerEmail: order.customer_email,
      total: order.total,
      bodyTemplate: settings.messages.emailPagoValidado,
    });

    if (sendRes.ok) {
      return { ok: true, email: "sent" };
    }
    return {
      ok: true,
      email: { failed: true, reason: sendRes.message },
    };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}
