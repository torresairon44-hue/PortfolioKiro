"use client";

import React from "react";

// ─── Shared isometric box geometry ────────────────────────────────────────────
// Each box is a self-contained SVG viewBox="0 0 87 100"
// matching the geometry from the original AppIcons component:
//   - left side rect:  matrix(0.866025  0.5  0 1 ...)
//   - right side rect: matrix(-0.866025 0.5  0 1 ...)
//   - top face path
//   - top face tile:   matrix(0.866025 -0.5  0.866025 0.5 ...)
//   - inner border rect (same matrix, inset)
//   - icon clipped to top face

interface BoxyIconProps {
  /** Brand accent color shown on hover (top face + inner border + icon) */
  accent: string;
  /** SVG path(s) or elements for the icon, drawn in a 16×16 space */
  icon: React.ReactNode;
  /** Unique id suffix to avoid gradient/clipPath collisions */
  id: string;
}

const BoxyIcon = ({ accent, icon, id }: BoxyIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 87 100"
    className="w-full h-full group"
  >
    <defs>
      {/* Tile fill gradient (dark, matches original paint0-5) */}
      <linearGradient
        id={`tile_${id}`}
        x1="0.037"
        y1="-0.037"
        x2="21.354"
        y2="42.747"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#414750" />
        <stop offset="1" stopColor="#414750" />
      </linearGradient>

      {/* Clip to the isometric top-face parallelogram */}
      <clipPath id={`face_${id}`}>
        <rect
          transform="matrix(0.866025 -0.5 0.866025 0.5 0 17)"
          fill="white"
          width="43.5"
          height="43.5"
        />
      </clipPath>

      {/* Clip for the 16×16 icon inside the inner border */}
      <clipPath id={`icon_${id}`}>
        <rect
          transform="matrix(0.866025 -0.5 0.866025 0.5 5.4 20.3)"
          fill="white"
          width="16"
          height="16"
        />
      </clipPath>
    </defs>

    {/* ── Left side face ── */}
    <rect
      fill="#3F454E"
      transform="matrix(0.866025 0.5 0 1 0 42)"
      width="43.5"
      height="58"
    />

    {/* ── Right side face ── */}
    <rect
      fill="#3F454E"
      transform="matrix(-0.866025 0.5 0 1 87 42)"
      width="43.5"
      height="58"
    />

    {/* ── Top face (dark base, lights up on hover) ── */}
    <path
      fill="#414750"
      className={`transition-colors duration-300 group-hover:fill-[${accent}]`}
      d="M0.45 42C0.163 41.834 0 41.968 0 42.3V72L43.5 96L87 72V42.2C87 42 86.845 41.91 86.654 42.02L43.5 65.7V65.6L0.45 42Z"
      clipRule="evenodd"
      fillRule="evenodd"
    />

    {/* ── Tile (isometric top face fill) ── */}
    <rect
      fill={`url(#tile_${id})`}
      transform="matrix(0.866025 -0.5 0.866025 0.5 0.1 17.5)"
      width="43.5"
      height="43.5"
      x="0.866025"
    />

    {/* ── Tile border ── */}
    <rect
      stroke="#3C4149"
      transform="matrix(0.866025 -0.5 0.866025 0.5 0.1 17.5)"
      width="43.5"
      height="43.5"
      x="0.866025"
    />

    {/* ── Inner inset border (the smaller rect inside) ── */}
    <rect
      stroke="#6B727C"
      strokeWidth="0.5"
      className={`transition-all duration-300 group-hover:stroke-[${accent}]`}
      transform="matrix(0.866025 -0.5 0.866025 0.5 5.4 17.3)"
      rx="1.75"
      width="34"
      height="34"
      x="0.433013"
    />

    {/* ── Icon on top face ── */}
    <g clipPath={`url(#icon_${id})`}>
      <g
        className={`transition-all duration-300 [&>*]:fill-[#6B727C] group-hover:[&>*]:fill-[${accent}]`}
        transform="matrix(0.866025 -0.5 0.866025 0.5 5.4 20.3)"
      >
        {/* Icon is drawn in a 16×16 local space */}
        {icon}
      </g>
    </g>
  </svg>
);

// ─── Per-tech icon paths (16×16 space) ────────────────────────────────────────

export const BoxyReact = () => (
  <BoxyIcon
    id="react"
    accent="#61dafb"
    icon={
      <>
        <ellipse cx="8" cy="8" rx="7" ry="2.8" stroke="#6B727C" strokeWidth="1" fill="none" />
        <ellipse cx="8" cy="8" rx="7" ry="2.8" stroke="#6B727C" strokeWidth="1" fill="none" transform="rotate(60 8 8)" />
        <ellipse cx="8" cy="8" rx="7" ry="2.8" stroke="#6B727C" strokeWidth="1" fill="none" transform="rotate(120 8 8)" />
        <circle cx="8" cy="8" r="1.5" fill="#6B727C" />
      </>
    }
  />
);

export const BoxyNextJs = () => (
  <BoxyIcon
    id="nextjs"
    accent="#ffffff"
    icon={
      <path
        fill="#6B727C"
        d="M8 1a7 7 0 100 14A7 7 0 008 1zm2.5 4L7 10.5V5.5H6v6h1l4-6h-0.5z"
      />
    }
  />
);

export const BoxyJavaScript = () => (
  <BoxyIcon
    id="js"
    accent="#f7df1e"
    icon={
      <>
        <rect x="1" y="1" width="14" height="14" fill="#6B727C" rx="1" />
        <path fill="#414750" d="M5 11.5c.3.5.7.8 1.3.8.6 0 1-.3 1-1V6.5H9v5c0 1.4-.8 2-2 2-1 0-1.7-.5-2-1.3l.7-.7zm4.5-.2c.3.6.8 1 1.5 1 .6 0 1-.3 1-.8 0-.5-.3-.7-1-1l-.3-.1C9.5 10 9 9.4 9 8.6 9 7.6 9.8 7 10.8 7c.7 0 1.3.3 1.7.9l-.7.7c-.3-.4-.6-.6-1-.6-.5 0-.8.3-.8.6 0 .4.3.6.9.9l.3.1c1.1.5 1.6 1 1.6 1.8 0 1.1-.9 1.8-2 1.8-1 0-1.8-.5-2.2-1.4l.9-.5z" />
      </>
    }
  />
);

export const BoxyTailwind = () => (
  <BoxyIcon
    id="tailwind"
    accent="#38bdf8"
    icon={
      <path
        fill="#6B727C"
        d="M8 3c-2.2 0-3.5 1-4.1 3.2.8-1 1.7-1.4 2.7-1.1.6.1 1 .6 1.5 1.1.8.8 1.6 1.7 3.5 1.7 2.2 0 3.5-1 4.1-3.2-.8 1-1.7 1.4-2.7 1.1-.6-.1-1-.6-1.5-1.1C10.7 3.9 9.9 3 8 3zM4 8.8c-2.2 0-3.5 1-4.1 3.2.8-1 1.7-1.4 2.7-1.1.6.1 1 .6 1.5 1.1.8.8 1.6 1.7 3.5 1.7 2.2 0 3.5-1 4.1-3.2-.8 1-1.7 1.4-2.7 1.1-.6-.1-1-.6-1.5-1.1C8.7 9.7 7.9 8.8 6 8.8z"
      />
    }
  />
);

export const BoxyNodeJs = () => (
  <BoxyIcon
    id="nodejs"
    accent="#539e43"
    icon={
      <path
        fill="#6B727C"
        d="M8 1L1 5v6l7 4 7-4V5L8 1zm0 1.8l5.2 3L8 8.8 2.8 5.8 8 2.8zM2 6.8l5.5 3.2v5.2L2 12V6.8zm7.5 8.4V10l5.5-3.2V12l-5.5 3.2z"
      />
    }
  />
);

export const BoxyMongoDB = () => (
  <BoxyIcon
    id="mongodb"
    accent="#4db33d"
    icon={
      <>
        <path fill="#6B727C" d="M8 1S3 6.5 3 10a5 5 0 0010 0C13 6.5 8 1 8 1zm0 12a1.2 1.2 0 110-2.4A1.2 1.2 0 018 13z" />
        <line x1="8" y1="1" x2="8" y2="13" stroke="#5a6370" strokeWidth="0.8" />
      </>
    }
  />
);

export const BoxyHtml5 = () => (
  <BoxyIcon
    id="html5"
    accent="#e34f26"
    icon={
      <path
        fill="#6B727C"
        d="M2 1l1.4 15 4.6 1.3 4.6-1.3L14 1H2zm9.5 4H5.8l.2 1.6h5.3L10.8 11l-2.8.8-2.8-.8-.2-2h1.6l.1 1 1.3.3 1.3-.3.2-1.6H5.2L4.8 5H11.5l-.3-2.5H4.3L4 4H12l-.5-2.5z"
      />
    }
  />
);

export const BoxyCss3 = () => (
  <BoxyIcon
    id="css3"
    accent="#1572b6"
    icon={
      <path
        fill="#6B727C"
        d="M2 1l1.4 15 4.6 1.3 4.6-1.3L14 1H2zm9.3 5H5.8l.1 1.6h5L10.6 11l-2.6.7-2.6-.7-.2-1.8h1.6l.1.9 1.1.3 1.1-.3.1-1.6H5.1L4.7 5h7l-.4-2H4.2L4 4h8.1L11.3 6z"
      />
    }
  />
);

export const BoxyBootstrap = () => (
  <BoxyIcon
    id="bootstrap"
    accent="#7952b3"
    icon={
      <>
        <rect x="2" y="2" width="12" height="12" rx="2" fill="#6B727C" />
        <path fill="#414750" d="M5.5 4.5h4a2.5 2.5 0 011.5 4.4A2.5 2.5 0 019 13H5.5V4.5zm2 3.5h1.7a.8.8 0 000-1.6H7.5V8zm0 3h2a.8.8 0 000-1.6h-2V11z" />
      </>
    }
  />
);

export const BoxyGit = () => (
  <BoxyIcon
    id="git"
    accent="#f05032"
    icon={
      <path
        fill="#6B727C"
        d="M15.2 7.3L8.7.8a.9.9 0 00-1.3 0L5.8 2.4l1.7 1.7a1.1 1.1 0 011.4 1.4l1.6 1.6a1.1 1.1 0 11-.7.7L8.3 6.3v4a1.1 1.1 0 11-.9 0V6.2a1.1 1.1 0 01-.6-1.4L5.1 3.1.8 7.3a.9.9 0 000 1.3l6.5 6.5a.9.9 0 001.3 0l6.6-6.5a.9.9 0 000-1.3z"
      />
    }
  />
);

export const BoxyPython = () => (
  <BoxyIcon
    id="python"
    accent="#3776ab"
    icon={
      <>
        <path fill="#6B727C" d="M8 1C5.2 1 5.5 2.2 5.5 2.2V4H8.5v.5H3.8S2 4.3 2 7s1.3 2.7 1.3 2.7H4.9V8.3s-.1-1.3 1.3-1.3H9.5S11 7 11 5.8V2.9S11.2 1 8 1zM7.5 2.8a.5.5 0 110 1 .5.5 0 010-1z" />
        <path fill="#5a6370" d="M8 15c2.8 0 2.5-1.2 2.5-1.2V12H7.5v-.5h4.7S14 11.7 14 9s-1.3-2.7-1.3-2.7H11.1v1.4s.1 1.3-1.3 1.3H6.5S5 9 5 10.2v2.9S4.8 15 8 15zm.5-1.8a.5.5 0 110-1 .5.5 0 010 1z" />
      </>
    }
  />
);

export const BoxyFigma = () => (
  <BoxyIcon
    id="figma"
    accent="#a259ff"
    icon={
      <>
        <path fill="#6B727C" d="M5.5 1H8.5a2.5 2.5 0 010 5H5.5V1z" />
        <path fill="#6B727C" d="M8.5 6H11a2.5 2.5 0 010 5H8.5V6z" />
        <circle cx="9.8" cy="13.5" r="2.5" fill="#6B727C" />
        <path fill="#6B727C" d="M5.5 11H8V15a2.5 2.5 0 01-2.5-2.5V11z" />
        <path fill="#6B727C" d="M5.5 1H8V6H5.5a2.5 2.5 0 010-5z" />
      </>
    }
  />
);

export const BoxyCanva = () => (
  <BoxyIcon
    id="canva"
    accent="#7d2ae8"
    icon={
      <>
        <circle cx="8" cy="8" r="6.5" fill="#6B727C" />
        <path fill="#414750" d="M10.5 6c-.3-.9-1-1.5-1.8-1.5-1.5 0-2.7 1.6-2.7 3.5s1.2 3.5 2.7 3.5c.8 0 1.5-.6 1.8-1.5l1.2.3C11.3 12 10.1 13 8.7 13 6.6 13 5 10.8 5 8s1.6-5 3.7-5c1.4 0 2.6 1 3 2.7L10.5 6z" />
      </>
    }
  />
);

export const BoxyVSCode = () => (
  <BoxyIcon
    id="vscode"
    accent="#007acc"
    icon={
      <path
        fill="#6B727C"
        d="M14.5 2.3L10.3 6l-4-3.3L5 4l3 2.5-3 2.5.7.7 3.8-2.8 4.3 3.8 1-.5V2.8l-1-.5zm-.5 7.4l-3.3-2.7L14 4.2v5.5z"
      />
    }
  />
);

export const BoxyLinux = () => (
  <BoxyIcon
    id="linux"
    accent="#f5c518"
    icon={
      <>
        <path fill="#6B727C" d="M8 1C6.3 1 5 3.2 5 6c0 1.8.5 3.3 1.2 4.3-.8.3-2 1.3-2.3 2.8-.2.9 0 1.8.7 2.1.4.2.8.2 1.1-.1.2 2 1.7 3.2 3.8 3.2s3.7-1.2 3.8-3.2c.3.3.7.3 1.1.1.7-.3.9-1.2.7-2.1-.3-1.5-1.5-2.5-2.3-2.8C12.5 9.3 13 7.8 13 6c0-2.8-1.3-5-3-5-1 0-2 .3-2 0zm0 12a1 1 0 110-2 1 1 0 010 2z" />
        <circle cx="6.5" cy="7" r=".8" fill="#414750" />
        <circle cx="9.5" cy="7" r=".8" fill="#414750" />
        <path stroke="#414750" strokeWidth=".7" d="M6.5 9.5c.5.7 2.5.7 3 0" />
      </>
    }
  />
);

export const BoxyVercel = () => (
  <BoxyIcon
    id="vercel"
    accent="#ffffff"
    icon={
      <path fill="#6B727C" d="M8 2L15 14H1L8 2z" />
    }
  />
);

// ─── Map from techStack label → component ─────────────────────────────────────

export const techIconMap: Record<string, React.ComponentType> = {
  JavaScript:     BoxyJavaScript,
  React:          BoxyReact,
  "Next.js":      BoxyNextJs,
  "Node.js":      BoxyNodeJs,
  MongoDB:        BoxyMongoDB,
  HTML5:          BoxyHtml5,
  CSS3:           BoxyCss3,
  "Tailwind CSS": BoxyTailwind,
  Bootstrap:      BoxyBootstrap,
  Git:            BoxyGit,
  Python:         BoxyPython,
  Figma:          BoxyFigma,
  Canva:          BoxyCanva,
  "VS Code":      BoxyVSCode,
  Linux:          BoxyLinux,
  Vercel:         BoxyVercel,
};
