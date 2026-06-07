@AGENTS.md

# Tienda La Banda — notas del proyecto

Tienda de merch para La Banda. Next.js 16 (App Router) + React 19 + TS.
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

## Backend (YA EN PRODUCCIÓN — live con clientes y pedidos reales)

Supabase + Resend están implementados y desplegados en Vercel
(`latiendadelabanda.vercel.app`, team de Vercel propio de la banda, NO el de
SantiagoDevRel). Piezas:

- **Supabase**: `lib/supabase/{client,server}.ts` (@supabase/ssr, anon key).
  Tablas: `products`, `product_images`, `orders`, `order_items`,
  `store_settings`, `payment_methods`. RLS: `orders`/`order_items` solo
  `is_admin()`. RPCs `SECURITY DEFINER`: `create_order` (atómico: valida stock,
  snapshot de precios, decrementa), `update_order_status`, `set_payment_validated`.
- **Storage privado** `payment-screenshots` (pantallazos + diseño del bombo),
  acceso por signed URL (600s). Los pantallazos se BORRAN al sacar el pedido de
  `pending` (admin.ts) → el Storage no crece infinito si la banda procesa.
- **Resend** (`lib/email.ts`): correo a la banda por pedido nuevo, al cliente
  cuando se valida el pago / se envía, y ALERTA de error a la banda. Si no hay
  `RESEND_API_KEY`, todo hace no-op limpio.
- **Auth admin**: `proxy.ts` (middleware) protege `/admin/**`; cada server
  action en `lib/actions/*` llama `requireAdmin()` (defense in depth).
- **MCP NO conectado a este proyecto**: el MCP de Supabase de Santi da
  `Unauthorized` (sin access token) y el de Vercel ve solo `santiago-prod` /
  `santiago-hobby` (este proyecto vive en otro team → 403). Para auditar
  límites/DB hay que conectar el token correcto.

### Datos del cliente en el checkout → localStorage (NO sessionStorage)
`lib/checkoutStore.ts` guarda nombre/correo/dirección en **localStorage**.
Quemada (jun-2026): estaban en `sessionStorage` y el navegador del celular
descartaba la pestaña cuando el cliente salía a pagar a la app del banco y
volvía → datos vacíos → `create_order` reventaba "Falta el nombre" (P0001) y
spam de correos de error. Reglas que quedaron:
- `createOrder` valida los datos del cliente ANTES de subir nada o llamar al
  RPC, y NO manda correo de alerta por errores de input (solo por fallos reales
  de sistema). `sendErrorAlertEmail` dedup por fingerprint (ventana 10 min).
- El botón "Confirmar pedido" NO se deshabilita en silencio: siempre clickable
  (salvo mientras envía) y `confirmOrder` muestra el mensaje exacto de lo que
  falta (pantallazo / diseño del bombo / stock / datos perdidos).

### Mensajes editables desde Ajustes
Los textos de cara al cliente son editables en `admin/ajustes` (sección
"Mensajes de la tienda"), persistidos en columnas de `store_settings`
(`msg_post_compra`, `msg_popup_titulo`, `msg_marca`, `msg_envio_contraentrega`,
`email_pago_validado`, `email_enviado`). Fuente única de defaults +
`renderTemplate` en `lib/messages.ts` — si la lectura falla, cae al texto
histórico. Los emails usan placeholders: `{pedido} {total}` (pago validado),
`{nombre} {pedido} {whatsapp}` (enviado). Para agregar otro mensaje editable:
columna nueva en store_settings (default = texto actual) → `lib/messages.ts` →
`dbSettingsToSettings` → `SettingsForm` → consumirlo en el componente.

### Riesgo de límites a vigilar
- **Vercel bandwidth (lo más crítico)**: `public/video/bg-*.mp4` son 9 clips
  (~40 MB total) servidos desde `/public`. `VideoBackground` auto-avanza al
  terminar cada clip → un visitante que se queda puede bajar varios (10-40 MB
  por sesión). En viral, satura los 100 GB/mes de Hobby. Mitigar: poster-only
  en mobile, menos clips, o mover a R2/Bunny/Cloudflare Stream.
- **Supabase Storage** (1 GB Free): acotado por backlog de pedidos `pending`.
  El `custom_artwork_path` (bombo) NO se borra al cambiar de estado — crece.
