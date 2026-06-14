"use client";

// Fondo cinematográfico del storefront — optimizado para NO reventar el límite
// de Fast Data Transfer de Vercel (100 GB free tier).
//
// Estrategia de egress (jun-2026, tras llegar al 75% del límite):
// - El fondo base son los FRAMES estáticos (bg-*.jpg, ~100-240 KB c/u, con
//   cache de 1 año en next.config). Rotan con un crossfade suave. Esto es lo
//   que ve TODO visitante → egress mínimo, y en visitas repetidas ni se
//   re-descarga.
// - El VIDEO (clip de varios MB) solo se reproduce en DESKTOP, UN solo clip en
//   loop (no auto-avanza por los 9 → un único download por sesión, no varios).
// - Móvil / pantalla chica / prefers-reduced-motion / save-data: SIN video,
//   solo los frames. La mayoría del tráfico es celular desde Instagram, así
//   que acá es donde más se ahorra.

import { useEffect, useRef, useState } from "react";
import { BG_CLIPS } from "@/lib/data";

export function VideoBackground() {
  // Par [actual, anterior] para el crossfade entre frames.
  const [[cur, prev], setPair] = useState<[number, number]>([0, 0]);
  // Clip fijo del video de desktop — se elige UNA vez y NO cambia con la
  // rotación de frames (si no, re-descargaría un mp4 nuevo cada pocos segundos).
  const [videoClip, setVideoClip] = useState<number | null>(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Después de montar: elegir frame inicial al azar + decidir si va el video.
  // El video solo en desktop con puntero fino, sin reduced-motion ni save-data.
  useEffect(() => {
    const start = Math.floor(Math.random() * BG_CLIPS.length);
    setPair([start, start]);
    setVideoClip(start);

    const desktop = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine)",
    );
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const saveData = conn?.saveData ?? false;

    const compute = () => desktop.matches && !reduce.matches && !saveData;
    setAllowVideo(compute());
    const onChange = () => setAllowVideo(compute());
    desktop.addEventListener("change", onChange);
    reduce.addEventListener("change", onChange);
    return () => {
      desktop.removeEventListener("change", onChange);
      reduce.removeEventListener("change", onChange);
    };
  }, []);

  // Rotación de frames con crossfade (cada ~8s). Barato: los .jpg son chicos y
  // quedan cacheados. No corre con un solo clip (no hay nada que rotar).
  useEffect(() => {
    if (BG_CLIPS.length < 2) return;
    const id = setInterval(() => {
      setPair(([c]) => [(c + 1) % BG_CLIPS.length, c]);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  // Arrancar el clip de desktop (uno solo, en loop).
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !allowVideo) return;
    const p = v.play();
    if (p) p.catch(() => setVideoVisible(false));
  }, [allowVideo, videoClip]);

  const curFrame = `/video/${BG_CLIPS[cur] ?? BG_CLIPS[0]}.jpg`;
  const prevFrame = `/video/${BG_CLIPS[prev] ?? BG_CLIPS[0]}.jpg`;
  const showVideo = allowVideo && videoClip !== null;
  const videoSrc = `/video/${BG_CLIPS[videoClip ?? 0] ?? BG_CLIPS[0]}.mp4`;

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
      {/* Video: solo desktop, un clip en loop, encima de los frames. */}
      {showVideo && (
        <video
          ref={videoRef}
          className={
            "store-bg__media store-bg__video" +
            (videoVisible ? " is-visible" : "")
          }
          src={videoSrc}
          poster={curFrame}
          muted
          playsInline
          autoPlay
          loop
          preload="metadata"
          onCanPlay={() => setVideoVisible(true)}
          onError={() => setVideoVisible(false)}
        />
      )}
      {/* Scrim oscuro para que la tienda siga siendo el foco. */}
      <div className="store-bg__overlay" />
    </div>
  );
}
