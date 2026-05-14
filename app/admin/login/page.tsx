// Admin login — two-column layout, NO AdminShell.
import { Logo } from "@/components/icons";
import { LoginForm } from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="lds-screen"
      style={{ display: "flex", background: "var(--bg)" }}
    >
      {/* Left: brand */}
      <div
        style={{
          width: 460,
          background: "var(--surface)",
          borderRight: "1px solid var(--line)",
          padding: "60px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Logo size="lg" />
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--accent)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Panel privado
          </div>
          <h1
            style={{
              fontSize: 32,
              marginTop: 10,
              lineHeight: 1.15,
              textWrap: "pretty",
            }}
          >
            Administrá tu tienda
            <br />
            desde un solo lugar.
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--ink-2)",
              marginTop: 12,
              lineHeight: 1.55,
              textWrap: "pretty",
            }}
          >
            Pedidos, productos, pagos por Nequi y reportes. Todo cifrado y solo
            para el equipo.
          </p>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
          © 2026 Los del Sur ·{" "}
          <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>Ayuda</span>
        </div>
      </div>

      {/* Right: form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 380 }}>
          <h2 style={{ fontSize: 24 }}>Iniciar sesión</h2>
          <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 6 }}>
            Ingresá con tu correo y contraseña de administrador.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
