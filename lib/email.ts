// Tienda La Banda — email helpers via Resend.
// CRITICAL: if RESEND_API_KEY is not set, both functions are no-ops.
// The store works 100% without Resend — email just "turns on" when the key is added.

import type { GlyphKind } from "@/lib/types";
import { formatCOP } from "@/lib/data";

interface OrderEmailData {
  orderNumber: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: {
    name: string;
    qty: number;
    lineTotal: number;
    glyph: GlyphKind;
    color: string;
    image: string | null;
  }[];
  total: number;
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  // Dynamic import so the module doesn't hard-fail when key is absent
  const { Resend } = require("resend") as typeof import("resend");
  return new Resend(key);
}

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Tienda La Banda <noreply@latiendadelabanda.vercel.app>";

/** Notify the admin that a new order has been placed. */
export async function sendNewOrderEmail(order: OrderEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log(
      `[email] RESEND_API_KEY not set — skipping new-order notification for #${order.orderNumber}`,
    );
    return;
  }
  if (!ADMIN_EMAIL) {
    console.log("[email] ADMIN_NOTIFY_EMAIL not set — skipping admin notification");
    return;
  }

  const itemLines = order.items
    .map((it) => `• ${it.qty}× ${it.name} — ${formatCOP(it.lineTotal)}`)
    .join("\n");

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Nuevo pedido #${order.orderNumber} — ${order.customerName}`,
      text: `
Nuevo pedido recibido en Tienda La Banda.

Pedido #${order.orderNumber}
Cliente: ${order.customerName} (${order.customerEmail})

Artículos:
${itemLines}

Total: ${formatCOP(order.total)}

Ver en el panel: https://latiendadelabanda.vercel.app/admin/ordenes/${order.orderId}
`.trim(),
    });
  } catch (err) {
    console.error("[email] sendNewOrderEmail failed:", err);
  }
}

/** Notify the customer that their order has been shipped. */
export async function sendShippedEmail(order: {
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  whatsapp?: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log(
      `[email] RESEND_API_KEY not set — skipping shipped notification for #${order.orderNumber}`,
    );
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `¡Tu pedido #${order.orderNumber} fue enviado! — La Banda`,
      text: `
Hola ${order.customerName},

¡Buenas noticias! Tu pedido #${order.orderNumber} ya fue enviado y está en camino.

Si tenés alguna pregunta, escribinos por WhatsApp${order.whatsapp ? `: ${order.whatsapp}` : "."}.

Gracias por comprar en Tienda La Banda. 💚
`.trim(),
    });
  } catch (err) {
    console.error("[email] sendShippedEmail failed:", err);
  }
}
