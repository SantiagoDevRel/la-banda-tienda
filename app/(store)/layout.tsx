import type { ReactNode } from "react";
import { VideoBackground } from "@/components/VideoBackground";
import { CartProvider } from "@/lib/cart";
import { CheckoutProvider } from "@/lib/checkout-context";
import { getActiveProducts, getStoreSettings } from "@/lib/queries";

// Storefront shell: fetches products + settings server-side so the cart
// and Nequi screen can resolve product data without hitting the DB again.
export default async function StoreLayout({ children }: { children: ReactNode }) {
  const [products, settings] = await Promise.all([
    getActiveProducts(),
    getStoreSettings(),
  ]);

  return (
    <CartProvider
      products={products}
      shippingCost={settings.shippingCost}
      freeShippingMin={settings.freeShippingMin}
    >
      <CheckoutProvider>
        <div className="store-shell">
          <VideoBackground />
          <div className="store-column">{children}</div>
        </div>
      </CheckoutProvider>
    </CartProvider>
  );
}
