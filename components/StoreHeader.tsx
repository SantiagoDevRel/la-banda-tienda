"use client";

// Storefront header — dark glass bar that floats over the video backdrop.
// Adapted from the design's MobileHeader for the rotating-video context.

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { CartIcon, Icon, Logo } from "./icons";

export function StoreHeader({
  title,
  back,
  action,
  hideCart = false,
}: {
  title?: string;
  back?: boolean;
  action?: ReactNode;
  hideCart?: boolean;
}) {
  const { count } = useCart();
  const router = useRouter();

  return (
    <header className="store-header">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {back && (
          <button
            type="button"
            className="store-header__icon-btn"
            onClick={() => router.back()}
            aria-label="Volver"
          >
            <Icon name="back" size={18} color="#fff" />
          </button>
        )}
        {title ? (
          <h1 style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>
            {title}
          </h1>
        ) : (
          <Link href="/" aria-label="Inicio">
            <Logo size="md" tone="light" />
          </Link>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {action}
        {!hideCart && (
          <Link
            href="/carrito"
            aria-label={`Carrito, ${count} artículos`}
            style={{ color: "#fff", display: "flex" }}
          >
            <CartIcon count={count} color="#fff" />
          </Link>
        )}
      </div>
    </header>
  );
}
