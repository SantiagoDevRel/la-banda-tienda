// Admin dashboard shell — sidebar + topbar.
// Ported from the Claude Design handoff (_design-ref/project/components.jsx).

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Icon, Logo, type IconName } from "./icons";
import { createClient } from "@/lib/supabase/client";

const NAV: { id: string; label: string; icon: IconName; href: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "home", href: "/admin" },
  { id: "products", label: "Productos", icon: "box", href: "/admin/productos" },
  { id: "orders", label: "Pedidos", icon: "bag", href: "/admin/ordenes" },
  { id: "settings", label: "Ajustes", icon: "settings", href: "/admin/ajustes" },
];

export interface AdminPage {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}

export function AdminShell({
  section,
  page,
  children,
}: {
  section: "dashboard" | "products" | "orders" | "settings";
  page?: AdminPage;
  children: ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="lds-screen" style={{ display: "flex", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: "var(--surface)",
          borderRight: "1px solid var(--line)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100dvh",
        }}
      >
        <div
          style={{
            padding: "20px 18px 24px",
            borderBottom: "1px solid var(--line-2)",
          }}
        >
          <Link href="/admin">
            <Logo size="md" />
          </Link>
          <div
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              marginTop: 4,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Administrador
          </div>
        </div>
        <nav style={{ padding: 10, flex: 1 }}>
          {NAV.map((n) => {
            const active = n.id === section;
            return (
              <Link
                key={n.id}
                href={n.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: "var(--r-sm)",
                  background: active ? "var(--accent-tint)" : "transparent",
                  color: active ? "var(--accent-ink)" : "var(--ink-2)",
                  fontWeight: active ? 600 : 500,
                  fontSize: 14,
                  marginBottom: 2,
                }}
              >
                <Icon name={n.icon} size={16} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: 12, borderTop: "1px solid var(--line-2)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "var(--accent-tint)",
                color: "var(--accent-ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              JR
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink)",
                  lineHeight: 1.2,
                }}
              >
                Jeison Rasta
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Admin</div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              style={{
                background: "none",
                border: "none",
                padding: 4,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="logout" size={15} color="var(--ink-3)" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {page && (
          <header
            style={{
              minHeight: 64,
              borderBottom: "1px solid var(--line)",
              background: "var(--surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 28px",
              flexShrink: 0,
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 700 }}>{page.title}</h2>
              {page.subtitle && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-2)",
                    marginTop: 2,
                  }}
                >
                  {page.subtitle}
                </div>
              )}
            </div>
            {page.action}
          </header>
        )}
        <main style={{ flex: 1, padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}
