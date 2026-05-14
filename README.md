# Tienda La banda

Tienda online sencilla de merch para **La banda**. Catálogo público con
pago offline por **Nequi** (transferí + subí el pantallazo) y un **panel de
administración** para gestionar productos y pedidos.

Construida desde un handoff de [Claude Design](https://claude.ai/design) — el
bundle original está en `_design-ref/` y es la fuente de verdad visual.

---

## Qué hay construido

**Storefront público** (mobile-first, columna centrada sobre fondo de video):

| Ruta | Pantalla |
|---|---|
| `/` | Catálogo con hero + chips de categoría + grid de productos |
| `/producto/[id]` | Detalle: imagen, precio, descripción, talla, cantidad |
| `/carrito` | Carrito interactivo (qty, quitar, totales) + estado vacío |
| `/checkout` | Formulario de datos del comprador con validación |
| `/checkout/pago` | **Pago Nequi**: monto, cuenta, pasos, subir pantallazo |
| `/pedido/confirmado` | Confirmación con #pedido y resumen de compra |

**Admin dashboard** (desktop, sidebar + topbar, sin fondo de video):

| Ruta | Pantalla |
|---|---|
| `/admin/login` | Login (email + contraseña) |
| `/admin` | Dashboard: métricas + pedidos recientes + accesos rápidos |
| `/admin/productos` | Lista de productos con buscador y acciones |
| `/admin/productos/nuevo` | Formulario de producto con subida de imagen |
| `/admin/ordenes` | Lista de pedidos con tabs de filtro por estado |
| `/admin/ordenes/[id]` | Detalle: cliente, items, comprobante, acciones |
| `/admin/ajustes` | Ajustes: cuenta Nequi, tienda, envíos |

**Fondo de video rotativo** — 9 clips en cámara lenta recortados de 3 videos
fuente, con poster estático (primer frame) como fallback para internet lento,
y overlay oscuro para que no distraigan de la tienda. Solo en el storefront.

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- CSS plano con design tokens (sin Tailwind) — ver `app/globals.css`
- Estado del carrito: React Context + `localStorage` (sin backend todavía)
- Tipografías: Inter + Space Grotesk vía `next/font`

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Estructura

```
app/
  layout.tsx              # root: fuentes + metadata
  globals.css             # design tokens + clases .lds-* (portado del diseño)
  not-found.tsx
  (store)/                # storefront — layout con CartProvider + VideoBackground
    layout.tsx
    page.tsx              # catálogo
    producto/[id]/
    carrito/
    checkout/  checkout/pago/
    pedido/confirmado/
  admin/                  # panel admin — cada page renderiza <AdminShell>
    page.tsx  login/  productos/  productos/nuevo/  ordenes/  ordenes/[id]/  ajustes/
components/
  icons.tsx               # Logo, Icon, CartIcon, ProductGlyph
  ui.tsx                  # Money, StockBadge, OrderStatusBadge
  QtyStepper.tsx  StoreHeader.tsx  AdminShell.tsx  ProductImage.tsx
  VideoBackground.tsx     # fondo de video rotativo + poster fallback
  storefront/             # Catalog, ProductCard, ProductDetail
  admin/                  # LoginForm, OrdersTable, OrderActions, ProductFormFields
lib/
  data.ts                 # MOCK: productos, pedidos, ajustes, formatCOP
  types.ts  cart.tsx  lastOrder.ts
public/video/             # bg-1..bg-9 .mp4 + .jpg (clips procesados — committed)
scripts/process-videos.sh # pipeline ffmpeg de los clips de fondo
_source-videos/           # videos DJI originales (~3.7 GB, gitignored)
_design-ref/              # handoff de Claude Design (referencia visual)
```

## Pipeline de video

Los 3 videos fuente viven en `_source-videos/` (gitignored por tamaño). El
script `scripts/process-videos.sh` los recorta en clips de ~9s
(6s de fuente a 0.67x = cámara lenta suave), los baja a 1080p H.264 para web,
y extrae el primer frame de cada clip como poster `.jpg`.

Para regenerar los clips (requiere `ffmpeg`):

```bash
bash scripts/process-videos.sh
```

Editá el array `clips` del script para cambiar qué segmentos se usan.

## Estado / qué es mock

Esta entrega es la **implementación del frontend**. Todo es interactivo pero
los datos son mock:

- `lib/data.ts` tiene **5 productos placeholder** (sin foto/nombre real —
  Santiago los envía después). `ProductImage` ya muestra `product.image`
  cuando exista; mientras tanto cae al glyph SVG.
- El carrito es real (Context + localStorage) y arranca con 2 items semilla.
- El pago Nequi acepta y previsualiza el pantallazo en el cliente, pero no
  lo sube a ningún lado todavía.
- El admin usa pedidos mock; los botones de acción son interactivos pero no
  persisten.

## Próximos pasos (backend)

Pendiente — el plan completo (Supabase, RLS, auth, `create_order` RPC,
Resend para emails) se diseñó en la sesión de ultraplan. Resumen:

1. **Supabase**: tablas `products` / `orders` / `order_items` / `store_settings`,
   RLS desde el primer deploy, Storage privado para los pantallazos.
2. **Auth** del admin (Supabase Auth + middleware en `/admin/*`).
3. **`create_order` RPC** atómico (valida stock, descuenta, snapshot de precios).
4. **Resend** — email "tu pedido fue enviado" al marcar como enviado.
5. Reemplazar los 5 placeholders con los productos reales.
