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

/** Upload one image file to product-images bucket, return public URL or null. */
async function uploadImageFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: uploadErr } = await supabase.storage
    .from("product-images")
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
      // 1 año: las fotos de producto no cambian (cada subida usa un UUID nuevo),
      // así el browser del cliente que vuelve NO re-descarga → menos egress.
      cacheControl: "31536000",
    });

  if (uploadErr) {
    console.error("[uploadImageFile]", uploadErr.message);
    return null;
  }
  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);
  return urlData.publicUrl;
}

export async function createProduct(
  formData: FormData,
): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  try {
    const { supabase } = await requireAdmin();

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

    // Upload all image files
    const imageFiles = formData.getAll("imageFiles") as File[];
    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const url = await uploadImageFile(supabase, file);
        if (url) uploadedUrls.push(url);
      }
    }

    // Cover = first uploaded URL (or null if no images)
    const imageUrl = uploadedUrls[0] ?? null;

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

    // Insert gallery rows
    if (uploadedUrls.length > 0) {
      const galleryRows = uploadedUrls.map((url, idx) => ({
        product_id: data.id,
        url,
        sort_order: idx,
      }));
      const { error: galleryErr } = await supabase
        .from("product_images")
        .insert(galleryRows);
      if (galleryErr) {
        console.error("[createProduct] gallery insert error:", galleryErr.message);
      }
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

    // Existing image IDs to keep (in the desired order)
    const keepIdsRaw = formData.get("keepImageIds") as string | null;
    const keepImageIds: string[] = keepIdsRaw ? JSON.parse(keepIdsRaw) : [];

    // Upload new image files
    const imageFiles = formData.getAll("imageFiles") as File[];
    const newUploadedUrls: string[] = [];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const url = await uploadImageFile(supabase, file);
        if (url) newUploadedUrls.push(url);
      }
    }

    // Delete gallery rows NOT in keepImageIds
    const { data: existingImages } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId);

    const allExistingIds = (existingImages ?? []).map((r) => r.id);
    const toDelete = allExistingIds.filter((id) => !keepImageIds.includes(id));
    if (toDelete.length > 0) {
      await supabase
        .from("product_images")
        .delete()
        .in("id", toDelete);
    }

    // Re-index kept images to match the desired order
    for (let i = 0; i < keepImageIds.length; i++) {
      await supabase
        .from("product_images")
        .update({ sort_order: i })
        .eq("id", keepImageIds[i]);
    }

    // Insert new images, sort_order continues after kept ones
    const startOrder = keepImageIds.length;
    if (newUploadedUrls.length > 0) {
      const galleryRows = newUploadedUrls.map((url, idx) => ({
        product_id: productId,
        url,
        sort_order: startOrder + idx,
      }));
      await supabase.from("product_images").insert(galleryRows);
    }

    // Determine new cover (first gallery image by sort_order)
    const { data: galleryRows } = await supabase
      .from("product_images")
      .select("url, sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true })
      .limit(1);
    const newCover = galleryRows?.[0]?.url ?? null;

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
      image_url: string | null;
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
      image_url: newCover,
    };

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
