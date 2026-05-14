"use client";

import { Icon } from "./icons";

// Quantity stepper — ported from the Claude Design handoff. Controlled.
export function QtyStepper({
  value,
  onChange,
  min = 1,
  max,
  size = "md",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const w = size === "sm" ? 26 : 32;
  const fs = size === "sm" ? 13 : 15;
  const btn: React.CSSProperties = {
    width: w,
    height: w,
    border: "1px solid var(--line)",
    background: "var(--surface)",
    borderRadius: "var(--r-sm)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--ink)",
  };
  const dec = () => onChange(Math.max(min, (value || 1) - 1));
  const inc = () => {
    const next = (value || 1) + 1;
    onChange(max != null ? Math.min(max, next) : next);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button
        type="button"
        style={{ ...btn, opacity: value <= min ? 0.4 : 1 }}
        onClick={dec}
        disabled={value <= min}
        aria-label="Quitar uno"
      >
        <Icon name="minus" size={14} />
      </button>
      <span
        style={{
          minWidth: 22,
          textAlign: "center",
          fontWeight: 600,
          fontSize: fs,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
      <button
        type="button"
        style={{ ...btn, opacity: max != null && value >= max ? 0.4 : 1 }}
        onClick={inc}
        disabled={max != null && value >= max}
        aria-label="Agregar uno"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
