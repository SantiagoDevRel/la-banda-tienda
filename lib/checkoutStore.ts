// Datos del cliente del checkout, compartidos entre la pantalla "Tus datos"
// (/checkout) y la pantalla de pago (/checkout/pago).
//
// IMPORTANTE: usa localStorage, NO sessionStorage. En el celular, cuando el
// cliente sale del navegador para pagar en la app del banco/Nequi y vuelve, el
// sistema operativo suele descartar la pestaña → sessionStorage se borra y los
// datos (nombre, correo, dirección) llegaban VACÍOS al confirmar, reventando el
// pedido con "Falta el nombre del comprador". localStorage sobrevive a eso.
// Se limpia explícitamente al confirmar un pedido con éxito.

export interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  addr: string;
  city: string;
  department: string;
  deliveryMethod: "shipping" | "pickup";
}

const KEY = "lds-checkout";

export function saveCheckout(data: CheckoutData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage no disponible — el flujo sigue en memoria */
  }
}

export function readCheckout(): CheckoutData | null {
  try {
    // Lee de localStorage; cae a sessionStorage por compatibilidad con
    // sesiones que quedaron a mitad del flujo con el código viejo.
    const raw =
      localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY) ?? null;
    if (!raw) return null;
    const p = JSON.parse(raw);
    return {
      name: p.name ?? "",
      email: p.email ?? "",
      phone: p.phone ?? "",
      addr: p.addr ?? "",
      city: p.city ?? "",
      department: p.department ?? "",
      deliveryMethod: p.deliveryMethod === "pickup" ? "pickup" : "shipping",
    };
  } catch {
    return null;
  }
}

export function clearCheckout(): void {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** ¿Están completos los datos mínimos para crear un pedido? */
export function isCheckoutComplete(d: CheckoutData | null): d is CheckoutData {
  if (!d) return false;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim());
  const base =
    !!d.name.trim() &&
    emailOk &&
    !!d.phone.trim() &&
    !!d.city.trim() &&
    !!d.department.trim();
  if (!base) return false;
  // Envío necesita dirección; recoger no.
  if (d.deliveryMethod === "shipping" && !d.addr.trim()) return false;
  return true;
}
