"use client";

// Rotating cinematic backdrop for the storefront.
// - Cycles through the slow-mo clips generated from the 3 source videos
//   (public/video/bg-*.mp4), advancing when each clip ends.
// - Each clip ships with a poster (bg-*.jpg = its first frame) shown as a
//   static fallback on slow connections / while the video loads / on error.
// - A dark gradient overlay (in globals.css) keeps it from distracting.
// - Honors prefers-reduced-motion: poster only, no video playback.

import { useEffect, useRef, useState } from "react";
import { BG_CLIPS } from "@/lib/data";

export function VideoBackground() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [allowVideo, setAllowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pick a random starting clip after mount (keeps SSR/CSR markup in sync).
  useEffect(() => {
    setIndex(Math.floor(Math.random() * BG_CLIPS.length));

    // ¿Reproducimos video o mostramos SOLO el poster (imagen ~100 KB)?
    // NO reproducimos video si:
    //  - el usuario pidió menos movimiento (prefers-reduced-motion), o
    //  - es una pantalla chica / celular (la mayoría del tráfico), o
    //  - el navegador está en modo ahorro de datos (Save-Data).
    // Cada clip pesa 3-6 MB y antes se auto-encadenaban → era el driver del
    // bandwidth de Vercel. En celular el poster se ve igual de bien y pesa nada.
    const reduceMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia("(max-width: 768px)");
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;

    const compute = () =>
      setAllowVideo(
        !reduceMotionMq.matches && !mobileMq.matches && !saveData,
      );
    compute();

    reduceMotionMq.addEventListener("change", compute);
    mobileMq.addEventListener("change", compute);
    return () => {
      reduceMotionMq.removeEventListener("change", compute);
      mobileMq.removeEventListener("change", compute);
    };
  }, []);

  // On clip change: fade out, reload the new source, start playback.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !allowVideo) return;
    setVisible(false);
    v.load();
    const p = v.play();
    if (p) p.catch(() => setVisible(false));
  }, [index, allowVideo]);

  const clip = BG_CLIPS[index] ?? BG_CLIPS[0];
  const poster = `/video/${clip}.jpg`;
  const src = `/video/${clip}.mp4`;

  return (
    <div className="store-bg" aria-hidden="true">
      {/* Static fallback — the clip's first frame. Always rendered behind. */}
      <img
        className="store-bg__media store-bg__poster"
        src={poster}
        alt=""
        decoding="async"
      />
      {/* Rotating slow-mo clip — fades in once it can play. */}
      {allowVideo && (
        <video
          ref={videoRef}
          className={
            "store-bg__media store-bg__video" + (visible ? " is-visible" : "")
          }
          src={src}
          poster={poster}
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
          onCanPlay={() => setVisible(true)}
          onError={() => setVisible(false)}
        />
      )}
      {/* Dark scrim so the store stays the focus. */}
      <div className="store-bg__overlay" />
    </div>
  );
}
