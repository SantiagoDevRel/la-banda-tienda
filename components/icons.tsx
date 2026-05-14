// La Banda — logo, generic icon set, product glyph placeholders.
// Ported from the Claude Design handoff (_design-ref/project/components.jsx).
// Pure presentational — safe to render in server or client components.

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { GlyphKind } from "@/lib/types";

// ── Logo ──────────────────────────────────────────────────────
export function Logo({
  size = "md",
  tone = "dark",
}: {
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
}) {
  const img = size === "sm" ? 26 : size === "lg" ? 42 : 32;
  const fs = size === "sm" ? 15 : size === "lg" ? 22 : 17;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <Image
        src="/main_logo_la_banda.webp"
        alt="La Banda"
        width={img}
        height={img}
        priority
        style={{ borderRadius: "50%", display: "block", objectFit: "cover" }}
      />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: fs,
          letterSpacing: "-0.02em",
          color: tone === "light" ? "#fff" : "var(--ink)",
          lineHeight: 1,
        }}
      >
        La Banda
      </span>
    </div>
  );
}

// ── Generic icon set ──────────────────────────────────────────
const ICON_PATHS = {
  back: <path d="M15 18 L9 12 L15 6" />,
  close: <path d="M6 6 L18 18 M18 6 L6 18" />,
  plus: <path d="M12 5 V 19 M5 12 H 19" />,
  minus: <path d="M5 12 H 19" />,
  check: <path d="M5 13 L 10 18 L 19 7" />,
  chevdown: <path d="M6 9 L 12 15 L 18 9" />,
  chevright: <path d="M9 6 L 15 12 L 9 18" />,
  search: (
    <g>
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16 L 20 20" />
    </g>
  ),
  trash: (
    <g>
      <path d="M4 6 H 20" />
      <path d="M9 6 V 4 H 15 V 6" />
      <path d="M6 6 L 7 20 H 17 L 18 6" />
    </g>
  ),
  edit: (
    <g>
      <path d="M4 20 L 8 19 L 19 8 L 16 5 L 5 16 Z" />
      <path d="M14 7 L 17 10" />
    </g>
  ),
  upload: (
    <g>
      <path d="M12 4 V 16" />
      <path d="M7 9 L 12 4 L 17 9" />
      <path d="M4 18 V 20 H 20 V 18" />
    </g>
  ),
  image: (
    <g>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M21 17 L 15 11 L 5 19" />
    </g>
  ),
  user: (
    <g>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20 Q 12 14 20 20" />
    </g>
  ),
  bag: (
    <g>
      <path d="M5 8 H 19 L 18 20 H 6 Z" />
      <path d="M8 8 V 6 A 4 4 0 0 1 16 6 V 8" />
    </g>
  ),
  box: (
    <g>
      <path d="M4 8 L 12 4 L 20 8 L 20 18 L 12 22 L 4 18 Z" />
      <path d="M4 8 L 12 12 L 20 8" />
      <path d="M12 12 V 22" />
    </g>
  ),
  grid: (
    <g>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
    </g>
  ),
  settings: (
    <g>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3 V 5 M12 19 V 21 M5 12 H 3 M21 12 H 19 M6.3 6.3 L 5 5 M19 19 L 17.7 17.7 M6.3 17.7 L 5 19 M19 5 L 17.7 6.3" />
    </g>
  ),
  logout: (
    <g>
      <path d="M9 4 H 5 V 20 H 9" />
      <path d="M14 8 L 19 12 L 14 16" />
      <path d="M9 12 H 19" />
    </g>
  ),
  filter: <path d="M4 5 H 20 L 14 12 V 19 L 10 17 V 12 Z" />,
  cart: (
    <g>
      <path d="M3 4 H 6 L 7.5 16.5 A 1.5 1.5 0 0 0 9 18 H 18 A 1.5 1.5 0 0 0 19.5 16.7 L 21 8 H 6.5" />
      <circle cx="10" cy="21" r="1" />
      <circle cx="17" cy="21" r="1" />
    </g>
  ),
  eye: (
    <g>
      <path d="M2 12 Q 7 5 12 5 Q 17 5 22 12 Q 17 19 12 19 Q 7 19 2 12 Z" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),
  bell: (
    <g>
      <path d="M6 16 V 11 A 6 6 0 0 1 18 11 V 16 L 20 18 H 4 Z" />
      <path d="M10 21 H 14" />
    </g>
  ),
  arrowup: (
    <g>
      <path d="M12 19 V 5" />
      <path d="M5 12 L 12 5 L 19 12" />
    </g>
  ),
  arrowdown: (
    <g>
      <path d="M12 5 V 19" />
      <path d="M5 12 L 12 19 L 19 12" />
    </g>
  ),
  paid: (
    <g>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 12 L 11 14 L 15 10" />
    </g>
  ),
  home: <path d="M3 11 L 12 4 L 21 11 V 20 H 14 V 14 H 10 V 20 H 3 Z" />,
  info: (
    <g>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8 V 8.01 M12 12 V 16" strokeLinecap="round" />
    </g>
  ),
  whatsapp: <path d="M4 20 L 5.5 15.5 A 8 8 0 1 1 8.5 18.5 Z" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICON_PATHS;

export function Icon({
  name,
  size = 18,
  stroke = 1.6,
  color = "currentColor",
}: {
  name: IconName;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

// ── Cart icon with count badge ────────────────────────────────
export function CartIcon({
  count = 0,
  color = "currentColor",
}: {
  count?: number;
  color?: string;
}) {
  return (
    <div style={{ position: "relative", width: 24, height: 24 }}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 4 H 6 L 7.5 16.5 A 1.5 1.5 0 0 0 9 18 H 18 A 1.5 1.5 0 0 0 19.5 16.7 L 21 8 H 6.5" />
        <circle cx="10" cy="21" r="1" />
        <circle cx="17" cy="21" r="1" />
      </svg>
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: -6,
            right: -8,
            minWidth: 18,
            height: 18,
            padding: "0 5px",
            background: "var(--accent)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-body)",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

// ── Product glyph placeholders ────────────────────────────────
// Single-line SVGs that stand in until real product photos arrive.
function glyphContent(kind: GlyphKind, color: string): ReactNode {
  const common = {
    fill: "none" as const,
    stroke: color,
    strokeWidth: 1.5,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
  switch (kind) {
    case "hoodie":
      return (
        <g {...common}>
          <path d="M28 22 L40 16 L42 20 Q51 26 60 20 L62 16 L74 22 L80 32 L72 36 L70 34 L70 76 L32 76 L32 34 L30 36 L22 32 Z" />
          <path d="M40 16 Q51 30 62 16" />
          <path d="M44 38 L44 56 L58 56 L58 38" />
        </g>
      );
    case "cap":
      return (
        <g {...common}>
          <path d="M18 56 Q24 28 51 28 Q78 28 84 56 L78 56 Q72 36 51 36 Q30 36 24 56 Z" />
          <path d="M24 56 L78 56 L74 62 L28 62 Z" />
          <circle cx="51" cy="42" r="3" />
        </g>
      );
    case "scarf":
      return (
        <g {...common}>
          <path d="M30 18 L46 22 L46 64 L30 60 Z" />
          <path d="M72 18 L56 22 L56 64 L72 60 Z" />
          <path d="M46 22 L56 22 M46 30 L56 30 M46 38 L56 38 M46 46 L56 46 M46 54 L56 54 M46 62 L56 62" />
          <path d="M30 60 L26 80 M34 62 L31 82 M38 63 L36 84 M42 64 L40 86" />
          <path d="M72 60 L76 80 M68 62 L71 82 M64 63 L66 84 M60 64 L62 86" />
        </g>
      );
    case "stickers":
      return (
        <g fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round">
          <rect x="22" y="22" width="22" height="22" rx="3" transform="rotate(-8 33 33)" />
          <rect x="46" y="20" width="22" height="22" rx="3" transform="rotate(5 57 31)" />
          <rect x="22" y="50" width="22" height="22" rx="3" transform="rotate(6 33 61)" />
          <circle cx="58" cy="60" r="11" />
          <path d="M52 60 L57 65 L66 56" strokeLinecap="round" />
        </g>
      );
    case "thermos":
      return (
        <g {...common}>
          <path d="M40 18 L62 18 L62 24 L60 26 L60 78 Q60 84 51 84 Q42 84 42 78 L42 26 L40 24 Z" />
          <path d="M42 32 L60 32 M42 70 L60 70" />
          <path d="M48 12 L54 12 L54 18 L48 18 Z" />
        </g>
      );
    case "longsleeve":
      return (
        <g {...common}>
          <path d="M30 18 L42 14 L48 18 L60 14 L72 18 L78 28 L74 72 L66 72 L66 30 L36 30 L36 72 L28 72 L24 28 Z" />
          <path d="M42 14 Q51 24 60 14" />
          <path d="M36 30 L66 30 L66 78 L36 78 Z" />
        </g>
      );
    case "shirt":
    default:
      return (
        <g {...common}>
          <path d="M30 18 L42 14 L48 18 L60 14 L72 18 L78 28 L70 32 L68 30 L68 70 L34 70 L34 30 L32 32 L24 28 Z" />
          <path d="M42 14 Q51 24 60 14" />
          <circle cx="51" cy="44" r="6" />
        </g>
      );
  }
}

export function ProductGlyph({
  kind,
  color = "#1E7A3D",
  bg = true,
  bare = false,
  style,
}: {
  kind: GlyphKind;
  color?: string;
  bg?: boolean;
  /** bare = just the <svg>, sized by the caller. */
  bare?: boolean;
  style?: CSSProperties;
}) {
  const svg = (
    <svg
      className="lds-glyph"
      viewBox="0 0 102 96"
      aria-hidden
      style={bare ? style : undefined}
    >
      {glyphContent(kind, color)}
    </svg>
  );
  if (bare) return svg;
  return (
    <div
      className="lds-prodfig"
      style={{ background: bg ? "var(--surface-alt)" : "transparent", ...style }}
    >
      {svg}
    </div>
  );
}
