// Tienda La Banda — email helpers via Resend.
// CRITICAL: if RESEND_API_KEY is not set, both functions no-op cleanly.
// The store works 100% without Resend — email just "turns on" when the key is added.

import { Resend } from "resend";
import { formatCOP } from "@/lib/data";
import { DEFAULT_MESSAGES, renderTemplate } from "@/lib/messages";
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
// Destinatario de las ALERTAS DE ERROR (separado del email de pedidos).
// Default: el correo de la banda que revisa Jeison. Override con ERROR_ALERT_EMAIL.
const ERROR_ALERT_EMAIL =
  (process.env.ERROR_ALERT_EMAIL && process.env.ERROR_ALERT_EMAIL.trim()) ||
  "labandadelosdelsur1997@gmail.com";
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

/** Resultado del envío — para mostrar feedback real en el admin UI. */
export type EmailSendResult =
  | { ok: true; id?: string }
  | { ok: false; reason: "no-key" | "rejected" | "threw"; message: string };

/** Notify the customer that we validated their payment. */
export async function sendPaymentValidatedEmail(order: {
  orderNumber: number;
  customerEmail: string;
  total: number;
  /** Plantilla editable desde Ajustes. Placeholders: {pedido} {total}. */
  bodyTemplate?: string;
}): Promise<EmailSendResult> {
  if (!resend) {
    console.log(
      `[email] RESEND_API_KEY not set — skipping payment-validated #${order.orderNumber}`,
    );
    return {
      ok: false,
      reason: "no-key",
      message: "RESEND_API_KEY no está seteada en el servidor.",
    };
  }

  console.log(
    `[email] sending payment-validated #${order.orderNumber}  from="${FROM_EMAIL}"  to="${order.customerEmail}"`,
  );

  const tpl = order.bodyTemplate ?? DEFAULT_MESSAGES.emailPagoValidado;
  const body = renderTemplate(tpl, {
    pedido: order.orderNumber,
    total: formatCOP(order.total),
  });

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `Validamos el pago de tu pedido #${order.orderNumber} — La Banda`,
      text: body,
    });

    if (result.error) {
      console.error(
        "[email] Resend rejected the payment-validated email:",
        result.error,
      );
      return {
        ok: false,
        reason: "rejected",
        message: result.error.message ?? String(result.error),
      };
    }

    console.log(
      `[email] payment-validated #${order.orderNumber} accepted by Resend, id=${result.data?.id}`,
    );
    return { ok: true, id: result.data?.id };
  } catch (err) {
    console.error("[email] sendPaymentValidatedEmail threw:", err);
    return {
      ok: false,
      reason: "threw",
      message: (err as Error).message ?? String(err),
    };
  }
}

/** Notify the customer that their order has been shipped. */
export async function sendShippedEmail(order: {
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  whatsapp?: string;
  /** Plantilla editable desde Ajustes. Placeholders: {nombre} {pedido} {whatsapp}. */
  bodyTemplate?: string;
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

  const tpl = order.bodyTemplate ?? DEFAULT_MESSAGES.emailEnviado;
  const body = renderTemplate(tpl, {
    nombre: order.customerName,
    pedido: order.orderNumber,
    whatsapp: order.whatsapp ?? "",
  });

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `¡Tu pedido #${order.orderNumber} fue enviado! — La Banda`,
      text: body,
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

/**
 * ALERTA DE ERROR — manda un correo a la banda (Jeison) cuando algo falla en
 * el flujo crítico (crear pedido, subir comprobante, etc.). Así un error que
 * antes solo quedaba en los logs del servidor (invisible para Santi/Jeison)
 * ahora llega al inbox con el detalle real para poder reaccionar.
 *
 * NUNCA lanza: si Resend no está configurado o falla, solo loguea. No debe
 * romper el flujo que la llamó (ya está en un camino de error de por sí).
 */
// ── Dedup de alertas de error ───────────────────────────────────────────────
// Evita que un mismo fallo, reintentado por el cliente varias veces seguidas,
// genere 15 correos idénticos. Guarda en memoria del proceso (módulo) la última
// vez que se envió cada "fingerprint" (context + mensaje) y suprime repetidos
// dentro de una ventana. Con Fluid Compute la instancia se reutiliza entre
// requests, así que una ráfaga del mismo cliente cae en la misma instancia y se
// deduplica. No es 100% a prueba de balas entre instancias frías, pero corta el
// 99% del spam real (ráfagas) a costo cero (sin tabla ni infra extra).
const ALERT_DEDUP_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const lastAlertSentAt = new Map<string, number>();

export async function sendErrorAlertEmail(alert: {
  /** Dónde ocurrió, ej: "createOrder / RPC create_order" */
  context: string;
  /** Mensaje de error real (rpcError.message, etc.) */
  errorMessage: string;
  /** Datos extra para entender el caso (cliente, items, paths…). */
  details?: Record<string, unknown>;
}): Promise<void> {
  if (!resend) {
    console.log(
      `[email] RESEND_API_KEY not set — skipping error alert (${alert.context})`,
    );
    return;
  }

  // Dedup: mismo contexto + mismo mensaje dentro de la ventana → no reenviar.
  const fingerprint = `${alert.context}::${alert.errorMessage}`;
  const now = Date.now();
  const prev = lastAlertSentAt.get(fingerprint);
  if (prev && now - prev < ALERT_DEDUP_WINDOW_MS) {
    console.log(
      `[email] error alert deduped (${alert.context}) — ya enviado hace ${Math.round(
        (now - prev) / 1000,
      )}s`,
    );
    return;
  }
  lastAlertSentAt.set(fingerprint, now);

  const detailLines = alert.details
    ? Object.entries(alert.details)
        .map(([k, v]) => {
          let val: string;
          try {
            val =
              typeof v === "string" ? v : JSON.stringify(v, null, 0);
          } catch {
            val = String(v);
          }
          if (val && val.length > 800) val = val.slice(0, 800) + "… (cortado)";
          return `• ${k}: ${val}`;
        })
        .join("\n")
    : "(sin detalles)";

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ERROR_ALERT_EMAIL,
      subject: `⚠️ Error en la tienda — ${alert.context}`,
      text: `
Se detectó un error en la Tienda La Banda.

¿Dónde?  ${alert.context}

Error:
${alert.errorMessage}

Detalles:
${detailLines}

—
Reenviale esto a Santi para que lo revise.
🎶 La Banda de Los Del Sur
`.trim(),
    });

    if (result.error) {
      console.error("[email] Resend rejected the error alert:", result.error);
    } else {
      console.log(
        `[email] error alert sent (${alert.context}), id=${result.data?.id}`,
      );
    }
  } catch (err) {
    // Si hasta la alerta falla, solo logueamos — no propagamos.
    console.error("[email] sendErrorAlertEmail threw:", err);
  }
}
