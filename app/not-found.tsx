import Link from "next/link";
import { Logo } from "@/components/icons";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0d100e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "0 32px",
        textAlign: "center",
      }}
    >
      <Logo size="lg" tone="light" />
      <div>
        <h1 style={{ color: "#fff", fontSize: 26 }}>Página no encontrada</h1>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: 14,
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          El producto o la página que buscás no existe o fue movido.
        </p>
      </div>
      <Link href="/" className="lds-btn lds-btn-primary lds-btn-lg">
        Volver al catálogo
      </Link>
    </div>
  );
}
