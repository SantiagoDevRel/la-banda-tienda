"use server";

// Tienda La Banda — admin server action for store settings.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("No autorizado");
  }
  return { supabase };
}

export async function saveSettings(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const { supabase } = await requireAdmin();

    const shippingCostRaw = (formData.get("shippingCost") as string)
      .replace(/\./g, "")
      .replace(",", "");
    const freeShippingMinRaw = (formData.get("freeShippingMin") as string)
      .replace(/\./g, "")
      .replace(",", "");

    // Mensajes editables: solo se actualizan si el form los manda (así otros
    // forms/llamadas no los pisan). Cada uno cae a su valor actual si falta.
    const msgFields: Record<string, string> = {};
    const msgKeys: Array<[string, string]> = [
      ["msgPostCompra", "msg_post_compra"],
      ["msgPopupTitulo", "msg_popup_titulo"],
      ["msgMarca", "msg_marca"],
      ["msgEnvioContraentrega", "msg_envio_contraentrega"],
      ["emailPagoValidado", "email_pago_validado"],
      ["emailEnviado", "email_enviado"],
    ];
    for (const [formKey, col] of msgKeys) {
      const v = formData.get(formKey);
      if (typeof v === "string") msgFields[col] = v;
    }

    const { error } = await supabase
      .from("store_settings")
      .update({
        store_name: formData.get("storeName") as string,
        whatsapp: formData.get("whatsapp") as string,
        shipping_info: formData.get("shippingInfo") as string,
        shipping_cost: parseInt(shippingCostRaw, 10),
        free_shipping_min: parseInt(freeShippingMinRaw, 10),
        ...msgFields,
      })
      .eq("id", true); // single row, id is a boolean constant

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath("/admin/ajustes");
    revalidatePath("/checkout/pago");
    revalidatePath("/pedido/confirmado");
    revalidatePath("/");

    return { ok: true };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}
