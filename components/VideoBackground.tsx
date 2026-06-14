"use client";

// Fondo del storefront — frames estáticos rotando con crossfade.
//
// Antes era un fondo de video que auto-avanzaba por 9 clips de 3-6 MB c/u
// (10-40 MB por sesión) → reventaba el Fast Data Transfer de Vercel (100 GB
// free tier; jun-2026 llegamos al 75%). Ahora NO hay video en ningún
// dispositivo: el fondo son los frames .jpg (~100-240 KB c/u, cacheados 1 año
// en next.config), que rotan con un fade suave. Egress prácticamente nulo y en
// visitas repetidas ni se re-descargan.
//
// (Los .mp4 siguen en public/video/ por si algún día se quiere volver al video
// — el historial de git tiene la versión con video desktop-only.)

import { useEffect, useState } from "react";
import { BG_CLIPS } from "@/lib/data";

export function VideoBackground() {
  // Par [actual, anterior] para el crossfade entre frames.
  const [[cur, prev], setPair] = useState<[number, number]>([0, 0]);

  // Frame inicial al azar tras montar (mantiene SSR/CSR en sync).
  useEffect(() => {
    const start = Math.floor(Math.random() * BG_CLIPS.length);
    setPair([start, start]);
  }, []);

  // Rotación con crossfade (cada ~8s). Barato: los .jpg son chicos y cacheados.
  useEffect(() => {
    if (BG_CLIPS.length < 2) return;
    const id = setInterval(() => {
      setPair(([c]) => [(c + 1) % BG_CLIPS.length, c]);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const curFrame = `/video/${BG_CLIPS[cur] ?? BG_CLIPS[0]}.jpg`;
  const prevFrame = `/video/${BG_CLIPS[prev] ?? BG_CLIPS[0]}.jpg`;

  return (
    <div className="store-bg" aria-hidden="true">
      {/* Frame anterior (debajo) — se mantiene mientras entra el nuevo. */}
      <img
        className="store-bg__media store-bg__poster"
        src={prevFrame}
        alt=""
        decoding="async"
      />
      {/* Frame actual (encima) — el key reinicia el fade-in en cada cambio. */}
      <img
        key={cur}
        className="store-bg__media store-bg__frame"
        src={curFrame}
        alt=""
        decoding="async"
      />
      {/* Scrim oscuro para que la tienda siga siendo el foco. */}
      <div className="store-bg__overlay" />
    </div>
  );
}
