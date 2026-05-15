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

    const { error } = await supabase
      .from("store_settings")
      .update({
        store_name: formData.get("storeName") as string,
        nequi_number: formData.get("nequiNumber") as string,
        nequi_holder: formData.get("nequiHolder") as string,
        whatsapp: formData.get("whatsapp") as string,
        shipping_info: formData.get("shippingInfo") as string,
        shipping_cost: parseInt(shippingCostRaw, 10),
        free_shipping_min: parseInt(freeShippingMinRaw, 10),
      })
      .eq("id", true); // single row, id is a boolean constant

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath("/admin/ajustes");
    revalidatePath("/checkout/pago");

    return { ok: true };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}
