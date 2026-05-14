// Tienda Los del Sur — data: products, orders, settings
// Pesos colombianos format
window.LDS = window.LDS || {};

LDS.formatCOP = (n) => {
  const s = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (n < 0 ? "-$ " : "$ ") + s;
};

LDS.PRODUCTS = [
  {
    id: "p1",
    name: "Camiseta Clásica Local",
    price: 89000,
    stock: 24,
    status: "ok",
    color: "#1E7A3D",
    glyph: "shirt",
    desc: "Camiseta oficial Los del Sur, tela deportiva transpirable. Estampado serigrafiado en el pecho y escudo bordado en la manga. Talles S a XXL.",
    tags: ["camisetas"]
  },
  {
    id: "p2",
    name: "Camiseta Visitante",
    price: 89000,
    stock: 3,
    status: "low",
    color: "#0F172A",
    glyph: "shirt",
    desc: "Versión visitante de la camiseta clásica, en negro con detalles en verde. Estampado serigrafiado y escudo bordado.",
    tags: ["camisetas"]
  },
  {
    id: "p3",
    name: "Buzo Capucha LDS",
    price: 165000,
    stock: 12,
    status: "ok",
    color: "#155A2B",
    glyph: "hoodie",
    desc: "Buzo con capucha en algodón 80/20, bolsillo canguro y cordones a tono. Estampado en la espalda \"LOS DEL SUR\".",
    tags: ["abrigos"]
  },
  {
    id: "p4",
    name: "Gorra Snapback Verde",
    price: 55000,
    stock: 18,
    status: "ok",
    color: "#1E7A3D",
    glyph: "cap",
    desc: "Gorra snapback con bordado frontal y cierre ajustable. Talla única.",
    tags: ["accesorios"]
  },
  {
    id: "p5",
    name: "Bufanda Tradicional",
    price: 45000,
    stock: 0,
    status: "out",
    color: "#15803D",
    glyph: "scarf",
    desc: "Bufanda de hincha tejida en hilo grueso, con flecos y leyenda \"LOS DEL SUR\" intercalada con franjas verdes.",
    tags: ["accesorios"]
  },
  {
    id: "p6",
    name: "Pack 10 Stickers",
    price: 18000,
    stock: 86,
    status: "ok",
    color: "#52525B",
    glyph: "stickers",
    desc: "Diez stickers vinílicos resistentes al agua. Diseños variados.",
    tags: ["accesorios"]
  },
  {
    id: "p7",
    name: "Termo Acero 500ml",
    price: 75000,
    stock: 9,
    status: "ok",
    color: "#1E293B",
    glyph: "thermos",
    desc: "Termo de acero inoxidable doble pared, mantiene frío 24h y caliente 12h. Grabado láser del escudo.",
    tags: ["accesorios"]
  },
  {
    id: "p8",
    name: "Manga Larga Entrenamiento",
    price: 105000,
    stock: 2,
    status: "low",
    color: "#16A34A",
    glyph: "longsleeve",
    desc: "Camiseta manga larga térmica para entrenamiento, tela elástica con tecnología antitranspirante.",
    tags: ["camisetas"]
  }
];

LDS.STOCK_LABEL = {
  ok: "Disponible",
  low: "Últimas unidades",
  out: "Agotado"
};

// Cart sample (3 items)
LDS.CART = [
  { productId: "p1", qty: 1 },
  { productId: "p4", qty: 2 },
  { productId: "p6", qty: 1 }
];

LDS.ORDERS = [
  { id: 1048, customer: "Camila Restrepo", email: "camila.r@gmail.com", phone: "300 412 8839", total: 187000, date: "Hoy · 14:22", status: "pending", items: 3 },
  { id: 1047, customer: "Andrés Mejía",     email: "amejia@outlook.com", phone: "311 209 4471", total: 89000,  date: "Hoy · 11:08",  status: "pending", items: 1 },
  { id: 1046, customer: "Mariana Quintero", email: "mariq@gmail.com",    phone: "320 887 1023", total: 220000, date: "Hoy · 09:51",  status: "shipped", items: 2 },
  { id: 1045, customer: "Juan David López", email: "jdlopez@gmail.com",  phone: "315 660 0091", total: 165000, date: "Ayer · 19:34", status: "done",    items: 1 },
  { id: 1044, customer: "Sofía Vargas",     email: "sofiav@gmail.com",   phone: "318 554 2210", total: 134000, date: "Ayer · 16:02", status: "done",    items: 3 },
  { id: 1043, customer: "Tomás Cárdenas",   email: "tcardenas@hey.com",  phone: "316 994 4480", total: 75000,  date: "Ayer · 12:18", status: "cancel",  items: 1 },
  { id: 1042, customer: "Laura González",   email: "lauragn@gmail.com",  phone: "302 778 1190", total: 252000, date: "Mar 12 · 18:40", status: "done", items: 4 }
];

LDS.STATUS_LABEL = {
  pending: "Pendiente",
  done: "Finalizada",
  shipped: "Enviado",
  cancel: "Cancelada"
};

LDS.SETTINGS = {
  storeName: "Tienda Los del Sur",
  nequiNumber: "300 482 7791",
  nequiHolder: "Carlos Andrés Marín",
  whatsapp: "+57 300 482 7791",
  shippingInfo: "Envíos a todo Colombia con Servientrega. 2-4 días hábiles. Envío gratis en compras sobre $ 200.000."
};
