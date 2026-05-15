"use server";

// Tienda La Banda — admin server actions for payment methods management.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("No autorizado");
  }
  return { supabase };
}

function revalidateAll() {
  revalidatePath("/admin/ajustes");
  revalidatePath("/(store)/checkout/pago", "page");
}

export async function createPaymentMethod(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from("payment_methods").insert({
      label: (formData.get("label") as string).trim(),
      kind: (formData.get("kind") as string) || "other",
      account_number: (formData.get("account_number") as string).trim(),
      holder: (formData.get("holder") as string).trim(),
      instructions: (formData.get("instructions") as string | null)?.trim() ?? "",
      is_active: formData.get("is_active") === "true",
      sort_order: parseInt((formData.get("sort_order") as string) || "0", 10),
    });

    if (error) return { ok: false, message: error.message };
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}

export async function updatePaymentMethod(
  id: string,
  formData: FormData,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("payment_methods")
      .update({
        label: (formData.get("label") as string).trim(),
        kind: (formData.get("kind") as string) || "other",
        account_number: (formData.get("account_number") as string).trim(),
        holder: (formData.get("holder") as string).trim(),
        instructions:
          (formData.get("instructions") as string | null)?.trim() ?? "",
        is_active: formData.get("is_active") === "true",
        sort_order: parseInt(
          (formData.get("sort_order") as string) || "0",
          10,
        ),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return { ok: false, message: error.message };
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}

export async function deletePaymentMethod(
  id: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id);

    if (error) return { ok: false, message: error.message };
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}
