"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "El correo es obligatorio.";
    else if (!email.includes("@")) e.email = "Ingresá un correo válido.";
    if (!password) e.password = "La contraseña es obligatoria.";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrors({ general: "Correo o contraseña incorrectos." });
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}
      noValidate
    >
      {errors.general && (
        <div
          className="lds-error"
          style={{ padding: "10px 14px", borderRadius: "var(--r-md)", fontSize: 13 }}
        >
          {errors.general}
        </div>
      )}
      <div>
        <label className="lds-label">Correo electrónico</label>
        <input
          className="lds-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jeison@labanda.com"
          aria-invalid={!!errors.email}
          autoComplete="email"
        />
        {errors.email && (
          <div className="lds-error" style={{ marginTop: 4, fontSize: 12 }}>
            {errors.email}
          </div>
        )}
      </div>
      <div>
        <label className="lds-label">Contraseña</label>
        <input
          className="lds-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
          aria-invalid={!!errors.password}
          autoComplete="current-password"
        />
        {errors.password && (
          <div className="lds-error" style={{ marginTop: 4, fontSize: 12 }}>
            {errors.password}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--ink-2)",
            cursor: "pointer",
          }}
        >
          <span
            onClick={() => setRemember((v) => !v)}
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              border: "1.5px solid var(--accent)",
              background: remember ? "var(--accent)" : "var(--surface)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            {remember && <Icon name="check" size={11} color="white" stroke={2.5} />}
          </span>
          Recordar mi sesión
        </label>
        <a className="lds-link" style={{ fontSize: 13, cursor: "pointer" }}>
          ¿Olvidaste tu clave?
        </a>
      </div>
      <button
        type="submit"
        className="lds-btn lds-btn-primary lds-btn-lg lds-btn-block"
        style={{ marginTop: 8 }}
        disabled={loading}
      >
        {loading ? "Ingresando…" : "Entrar al panel"}
      </button>
    </form>
  );
}
