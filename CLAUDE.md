@AGENTS.md

# Tienda Los del Sur — notas del proyecto

Tienda de merch para Los del Sur. Next.js 16 (App Router) + React 19 + TS.
Frontend implementado desde un handoff de Claude Design; backend pendiente.

## Reglas del proyecto

- **Fuente de verdad visual: `_design-ref/`** (handoff de Claude Design). Antes
  de cambiar una pantalla, mirá el `.jsx` correspondiente ahí. No inventes
  colores/spacing/componentes fuera de ese sistema.
- **Design system en `app/globals.css`**: tokens `--*` + clases `.lds-*`
  (botones, inputs, badges, tablas) portados del diseño. Usá esas clases; no
  agregues un framework de CSS.
- **Storefront vs Admin**:
  - Storefront (`app/(store)/`) — mobile-first, columna centrada sobre el
    fondo de video rotativo. Layout con `CartProvider` + `VideoBackground`.
  - Admin (`app/admin/`) — desktop, `<AdminShell>`, fondo off-white `--bg`.
    **Sin fondo de video** y **sin `CartProvider`**.
- **El fondo de video es solo del storefront.** `VideoBackground` rota los
  clips de `public/video/bg-*.mp4` con poster `.jpg` como fallback. Para
  regenerar clips: `bash _source-videos/process-videos.sh` (necesita ffmpeg).
- **Datos mock en `lib/data.ts`** — 5 productos placeholder (ids p1–p5),
  pedidos y ajustes mock. El carrito real vive en `lib/cart.tsx` (Context +
  localStorage). Cuando llegue el backend, esto se reemplaza por Supabase.
- **`ProductImage`** ya soporta fotos reales: poné `product.image` y se usa;
  si es `null` cae al glyph SVG placeholder.
- Componentes server por defecto; `"use client"` solo donde hay hooks/handlers.
- Rutas dinámicas en Next 16: `params` es `Promise` → `const { id } = await params`.

## Backend (pendiente)

Nada de Supabase/auth/email todavía. El plan completo (tablas + RLS desde el
día uno, `create_order` RPC atómico, Storage privado para pantallazos, Resend
para el email de "enviado") se diseñó en la sesión de ultraplan. Cuando se
implemente: RLS en toda tabla antes del primer deploy, `sb_secret_*` solo
server-side, endpoints validan auth antes de tocar la DB.
