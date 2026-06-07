// Mensajes de cara al cliente, editables desde admin/ajustes.
// Los defaults acá DEBEN coincidir con el texto histórico (y con los DEFAULT de
// la columna en store_settings) — así, si la DB todavía no tiene el valor o
// falla la lectura, la app muestra EXACTAMENTE lo de siempre. Nada cambia hasta
// que la banda lo edite en el panel.

export interface StoreMessages {
  /** Post-compra: popup + pantalla de confirmación + hint en la pantalla de pago. */
  postCompra: string;
  /** Título del popup de gracias. */
  popupTitulo: string;
  /** Frase de marca en el popup. */
  marca: string;
  /** Aviso de envío contraentrega (pago + confirmación). */
  envioContraentrega: string;
  /** Cuerpo del email "validamos tu pago". Placeholders: {pedido} {total} */
  emailPagoValidado: string;
  /** Cuerpo del email "tu pedido fue enviado". Placeholders: {nombre} {pedido} {whatsapp} */
  emailEnviado: string;
}

export const DEFAULT_MESSAGES: StoreMessages = {
  postCompra:
    "Verificaremos el pago manualmente, una vez lo validemos te avisaremos vía correo. Agradecemos su paciencia ya que podemos tener muchos pedidos.",
  popupTitulo: "¡¡Ey Gracias por apoyarnos!!",
  marca: "La Banda de Los del Sur — Hay Fiesta en la Popular.",
  envioContraentrega: "Debes pagar el valor del envío al momento de recibir.",
  emailPagoValidado:
    "Hola, esperamos que estes muy bien.\n\n✅ Ya validamos el pago de tu pedido #{pedido} ({total}).\n\n🕰️👐 Les pedimos paciencia, tenemos demasiados pedidos, el tiempo estimado de entrega es de 6 días hábiles aproximadamente, pero no te preocupes ¡VALDRÀ LA PENA!\n\n📱Si deseas nos Regalas tu número de Wsp para contactarte una vez tengamos listo tu pedido y así poder pactar la entrega de forma más ágil, sino no hay lío, nos avisas y te volvemos a contactar por acá.\n\nGracias por apoyarnos.\n\n🎶La Banda de Los Del Sur - Hay Fiesta en la Popular🎶",
  emailEnviado:
    "Hola {nombre},\n\n¡Buenas noticias! Tu pedido #{pedido} ya fue enviado y está en camino.\n\nSi tenés alguna pregunta, escribinos por WhatsApp.\n\nGracias por comprar en Tienda La Banda. 💚",
};

/** Reemplaza {clave} por su valor. Las claves desconocidas se dejan intactas. */
export function renderTemplate(
  tpl: string,
  vars: Record<string, string | number>,
): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) =>
    k in vars ? String(vars[k]) : m,
  );
}
