"use client";

// Contexto de los datos del cliente del checkout, vivo en memoria mientras el
// cliente navega /checkout → /checkout/pago (el layout de (store) NO se
// re-monta entre rutas hermanas, así que el estado persiste).
//
// Por qué un contexto Y localStorage (defensa en 2 capas, para CUALQUIER device):
//  1. En memoria (este contexto): sobrevive la navegación SPA aunque el
//     navegador BLOQUEE el storage (ej. modo incógnito de iOS Safari, donde
//     localStorage.setItem tira excepción). El camino normal —llenar datos y
//     tocar "Continuar al pago"— funciona sin tocar disco.
//  2. localStorage (lib/checkoutStore): sobrevive un RELOAD o que el SO del
//     celular descarte la pestaña cuando el cliente sale a pagar a la app del
//     banco y vuelve. Es lo que rompía antes con sessionStorage.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type CheckoutData,
  readCheckout,
  saveCheckout,
  clearCheckout,
} from "./checkoutStore";

interface CheckoutContextValue {
  data: CheckoutData | null;
  setData: (d: CheckoutData) => void;
  clear: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<CheckoutData | null>(null);

  // Hidratar desde storage una vez (cubre reload / pestaña descartada).
  useEffect(() => {
    setDataState((cur) => cur ?? readCheckout());
  }, []);

  const setData = useCallback((d: CheckoutData) => {
    setDataState(d); // memoria: sobrevive navegación aunque el storage falle
    saveCheckout(d); // disco: sobrevive reload / eviction si el storage anda
  }, []);

  const clear = useCallback(() => {
    setDataState(null);
    clearCheckout();
  }, []);

  return (
    <CheckoutContext.Provider value={{ data, setData, clear }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx)
    throw new Error("useCheckout debe usarse dentro de <CheckoutProvider>");
  return ctx;
}
