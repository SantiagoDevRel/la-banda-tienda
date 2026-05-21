// Tienda La Banda — todo se muestra/calcula en hora de Colombia.
// El servidor (Vercel) corre en UTC, así que sin esto las fechas salían
// corridas ~5h y el corte de "hoy" del dashboard caía en el día UTC, no el
// colombiano. Colombia es UTC-5 fijo (no tiene horario de verano).

export const BOGOTA_TZ = "America/Bogota";

/** Formatea un instante (ISO de la DB) como fecha+hora de Colombia. */
export function formatBogota(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BOGOTA_TZ,
  });
}

/** Instante UTC (ISO) correspondiente a las 00:00 de hoy en Colombia. */
export function bogotaTodayStartISO(): string {
  // "YYYY-MM-DD" del día actual según el calendario colombiano.
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOGOTA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  // 00:00 en -05:00 → instante absoluto en UTC.
  return new Date(`${today}T00:00:00-05:00`).toISOString();
}
