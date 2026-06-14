import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Fondo de video + posters: cachear fuerte en el browser para que una
        // visita repetida NO vuelva a descargar los MB. Reduce el Fast Data
        // Transfer de Vercel en visitantes recurrentes. (Si algún día se
        // cambia un clip, renombralo bg-10.mp4 etc. para romper la caché.)
        source: "/video/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
