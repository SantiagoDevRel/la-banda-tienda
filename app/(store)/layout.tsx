import type { ReactNode } from "react";
import { VideoBackground } from "@/components/VideoBackground";
import { CartProvider } from "@/lib/cart";

// Storefront shell: cart state + rotating cinematic video backdrop.
// The store lives in a centered phone-width column floating over the video.
export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="store-shell">
        <VideoBackground />
        <div className="store-column">{children}</div>
      </div>
    </CartProvider>
  );
}
