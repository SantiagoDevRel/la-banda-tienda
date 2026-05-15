"use server";

// Tienda La Banda — admin server actions for product management.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("No autorizado");
  }
  return { supabase, user };
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  glyph: string;
  color: string;
  isActive: boolean;
  imageFile?: File | null;
}

export async function createProduct(
  formData: FormData,
): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  try {
    const { supabase } = await requireAdmin();

    // Upload image if provided
    let imageUrl: string | null = null;
    const imageFile = formData.get("imageFile") as File | null;
    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("product-images")
        .upload(path, imageFile, { contentType: imageFile.type, upsert: false });

      if (!uploadErr) {
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(
      (formData.get("price") as string).replace(/\./g, "").replace(",", ""),
      10,
    );
    const stock = parseInt(formData.get("stock") as string, 10);
    const category = (formData.get("category") as string).toLowerCase();
    const glyph = (formData.get("glyph") as string) || "shirt";
    const color = (formData.get("color") as string) || "#1E7A3D";
    const isActive = formData.get("isActive") !== "false";

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        description,
        price,
        stock,
        category,
        glyph,
        color,
        is_active: isActive,
        image_url: imageUrl,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { ok: false, message: error?.message ?? "Error al crear el producto." };
    }

    revalidatePath("/admin/productos");
    revalidatePath("/");

    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}

export async function updateProduct(
  productId: string,
  formData: FormData,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const { supabase } = await requireAdmin();

    // Upload image if provided
    let imageUrl: string | undefined = undefined;
    const imageFile = formData.get("imageFile") as File | null;
    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("product-images")
        .upload(path, imageFile, { contentType: imageFile.type, upsert: false });

      if (!uploadErr) {
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    const price = parseInt(
      (formData.get("price") as string).replace(/\./g, "").replace(",", ""),
      10,
    );

    type ProductUpdate = {
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
      glyph: string;
      color: string;
      is_active: boolean;
      image_url?: string;
    };

    const updates: ProductUpdate = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price,
      stock: parseInt(formData.get("stock") as string, 10),
      category: (formData.get("category") as string).toLowerCase(),
      glyph: (formData.get("glyph") as string) || "shirt",
      color: (formData.get("color") as string) || "#1E7A3D",
      is_active: formData.get("isActive") !== "false",
    };

    if (imageUrl !== undefined) {
      updates.image_url = imageUrl;
    }

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId);

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath("/admin/productos");
    revalidatePath(`/producto/${productId}`);
    revalidatePath("/");

    return { ok: true };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}

/** Soft-delete: sets is_active = false */
export async function deleteProduct(
  productId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", productId);

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath("/admin/productos");
    revalidatePath("/");

    return { ok: true };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}
