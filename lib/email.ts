// Tienda La Banda — email helpers via Resend.
// CRITICAL: if RESEND_API_KEY is not set, both functions no-op cleanly.
// The store works 100% without Resend — email just "turns on" when the key is added.

import { Resend } from "resend";
import { formatCOP } from "@/lib/data";
import type { GlyphKind } from "@/lib/types";

/** Adjunto del correo (ya en base64) — comprobante de pago y/o diseño del bombo. */
export interface EmailAttachment {
  filename: string;
  content: string; // base64
}

interface OrderEmailData {
  orderNumber: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryMethod?: "shipping" | "pickup";
  items: {
    name: string;
    qty: number;
    lineTotal: number;
    glyph: GlyphKind;
    color: string;
    image: string | null;
  }[];
  total: number;
  attachments?: EmailAttachment[];
}

const RESEND_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "";
// Resend's onboarding sender works without verifying a domain — safe default.
const FROM_EMAIL =
  (process.env.EMAIL_FROM && process.env.EMAIL_FROM.trim()) ||
  "Tienda La Banda <onboarding@resend.dev>";

const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

/** Notify the admin that a new order has been placed. */
export async function sendNewOrderEmail(order: OrderEmailData): Promise<void> {
  if (!resend) {
    console.log(
      `[email] RESEND_API_KEY not set — skipping new-order #${order.orderNumber}`,
    );
    return;
  }
  if (!ADMIN_EMAIL) {
    console.log(
      "[email] ADMIN_NOTIFY_EMAIL not set — skipping admin notification",
    );
    return;
  }

  console.log(
    `[email] sending new-order #${order.orderNumber}  from="${FROM_EMAIL}"  to="${ADMIN_EMAIL}"`,
  );

  const itemLines = order.items
    .map((it) => `• ${it.qty}× ${it.name} — ${formatCOP(it.lineTotal)}`)
    .join("\n");

  const entrega =
    order.deliveryMethod === "pickup"
      ? "Recoge en Medellín (gratis)"
      : "Envío a domicilio (el envío lo paga al recibir)";

  const attachments = order.attachments ?? [];
  const adjuntosNota = attachments.length
    ? `\nAdjuntos en este correo:\n${attachments
        .map((a) => `• ${a.filename}`)
        .join("\n")}\n`
    : "";

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Nuevo pedido #${order.orderNumber} — ${order.customerName}`,
      text: `
Nuevo pedido recibido en Tienda La Banda.

Pedido #${order.orderNumber}
Cliente: ${order.customerName} (${order.customerEmail})${order.customerPhone ? `\nCelular / WhatsApp: ${order.customerPhone}` : ""}
Entrega: ${entrega}

Artículos:
${itemLines}

Total pagado (productos): ${formatCOP(order.total)}
${adjuntosNota}
Ver en el panel:
https://latiendadelabanda.vercel.app/admin/ordenes/${order.orderId}
`.trim(),
      attachments: attachments.length
        ? attachments.map((a) => ({ filename: a.filename, content: a.content }))
        : undefined,
    });

    if (result.error) {
      console.error(
        "[email] Resend rejected the new-order email:",
        result.error,
      );
    } else {
      console.log(
        `[email] new-order #${order.orderNumber} accepted by Resend, id=${result.data?.id}`,
      );
    }
  } catch (err) {
    console.error("[email] sendNewOrderEmail threw:", err);
  }
}

/** Notify the customer that their order has been shipped. */
export async function sendShippedEmail(order: {
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  whatsapp?: string;
}): Promise<void> {
  if (!resend) {
    console.log(
      `[email] RESEND_API_KEY not set — skipping shipped notification for #${order.orderNumber}`,
    );
    return;
  }

  console.log(
    `[email] sending shipped #${order.orderNumber}  from="${FROM_EMAIL}"  to="${order.customerEmail}"`,
  );

  try {
    const result = await resend.emails.send({
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

    if (result.error) {
      console.error(
        "[email] Resend rejected the shipped email:",
        result.error,
      );
    } else {
      console.log(
        `[email] shipped #${order.orderNumber} accepted by Resend, id=${result.data?.id}`,
      );
    }
  } catch (err) {
    console.error("[email] sendShippedEmail threw:", err);
  }
}
