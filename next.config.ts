import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // ── Clickjacking protection ──────────────────────────────────────
          { key: "X-Frame-Options", value: "DENY" },

          // ── MIME-sniffing protection ─────────────────────────────────────
          { key: "X-Content-Type-Options", value: "nosniff" },

          // ── Referrer: only send domain, not full URL ─────────────────────
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // ── Block embedded content from requesting camera/mic/location ───
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },

          // ── Content Security Policy ──────────────────────────────────────
          // Defines every domain allowed to load resources on this site.
          // default-src: fallback for anything not listed below
          // script-src:  only self + Next.js inline scripts (unsafe-inline for
          //              Next.js hydration) + Vercel analytics if added later
          // style-src:   self + inline styles (Tailwind inlines critical CSS)
          // img-src:     self + data URIs (base64 images used by cobe globe)
          // font-src:    self (next/font self-hosts Google Fonts at build time)
          // connect-src: self + GitHub contributions API (used by GithubCalendar)
          // frame-src:   Visme only (contact form iframe)
          // object-src:  none (no Flash/plugins)
          // base-uri:    self (prevents base-tag injection)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://github-contributions-api.jogruber.de",
              "frame-src https://forms.visme.co",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
