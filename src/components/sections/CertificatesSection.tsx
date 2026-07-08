"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/cn";

interface CertificatesSectionProps {
  className?: string;
}

const CERTS = [
  { src: "/images/ServiceNow.jpg", label: "ServiceNow" },
  { src: "/images/SecurityPrivacy.jpg", label: "Security & Privacy" },
  { src: "/images/ProjectManagement.jpg", label: "Project Management" },
  { src: "/images/GenerativeAI.jpg", label: "Generative AI" },
  { src: "/images/uicert.png", label: "UI Certification" },
];

const CARD_W = typeof window !== "undefined" && window.innerWidth < 400 ? 260 : 320;
const CARD_H = typeof window !== "undefined" && window.innerWidth < 400 ? 180 : 220;
const AUTO_INTERVAL = 3500;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const CertificatesSection = ({ className }: CertificatesSectionProps) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = CERTS.length;

  // Mouse parallax on the glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 80);
      mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 40);
    },
    [mouseX, mouseY]
  );

  const next = useCallback(() => setActive((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setActive((p) => (p - 1 + count) % count), [count]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, AUTO_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Card position/style based on offset from active
  const getCardStyle = (index: number) => {
    const offset = ((index - active + count) % count + count) % count;
    // Normalize: offset 0 = center, 1 = right1, count-1 = left1, etc.
    let normalizedOffset = offset;
    if (normalizedOffset > Math.floor(count / 2)) {
      normalizedOffset = normalizedOffset - count;
    }
    const abs = Math.abs(normalizedOffset);
    const sign = Math.sign(normalizedOffset);

    const translateX = sign * lerp(0, CARD_W * 0.78, Math.min(abs, 2));
    const translateZ = -lerp(0, 180, Math.min(abs, 2));
    const rotateY = sign * lerp(0, 28, Math.min(abs, 2));
    const scale = lerp(1, 0.72, Math.min(abs / 2, 1));
    const opacity = abs === 0 ? 1 : abs === 1 ? 0.72 : 0.38;
    const blur = abs === 0 ? 0 : abs === 1 ? 1 : 3;
    const zIndex = 10 - abs;

    return { translateX, translateZ, rotateY, scale, opacity, blur, zIndex };
  };

  return (
    <>
      <section
        aria-label="Certifications and Awards"
        className={cn(
          "relative w-full bg-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center",
          className
        )}
        style={{ minHeight: "100vh" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
      >
        {/* Ambient radial glow that tracks mouse */}
        <motion.div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 600,
            height: 400,
            background:
              "radial-gradient(ellipse at center, rgba(158,31,38,0.18) 0%, rgba(212,178,111,0.07) 50%, transparent 75%)",
            x: glowX,
            y: glowY,
            translateX: "-50%",
            translateY: "-50%",
            top: "50%",
            left: "50%",
            filter: "blur(12px)",
          }}
        />

        {/* Static soft bottom glow */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] rounded-full opacity-30"
          style={{ background: "radial-gradient(ellipse at center, rgba(158,31,38,0.25) 0%, transparent 70%)", filter: "blur(30px)" }}
        />

        {/* Section header */}
        <div className="relative z-20 text-center mb-12 px-4">
          <span className="font-body font-semibold text-[11px] uppercase tracking-[3px] text-neutral-dark-gray block mb-3">
            Certifications &amp; Awards
          </span>
          <h2 className="font-display text-[44px] md:text-[64px] leading-none text-neutral-white">
            My Credentials
          </h2>
          <p className="font-body text-[13px] text-neutral-offwhite/60 mt-3 max-w-[280px] mx-auto leading-relaxed">
            Click any certificate to view full size
          </p>
        </div>

        {/* 3D Floating Carousel */}
        <div
          className="relative z-10 flex items-center justify-center"
          style={{
            width: "100%",
            height: CARD_H + 80,
            perspective: "1200px",
          }}
          role="region"
          aria-label="Certificate carousel"
        >
          {CERTS.map((cert, i) => {
            const { translateX, translateZ, rotateY, scale, opacity, blur, zIndex } =
              getCardStyle(i);
            const isActive = i === active;

            return (
              <motion.div
                key={cert.src}
                className="absolute cursor-pointer select-none"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  zIndex,
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  x: translateX,
                  z: translateZ,
                  rotateY,
                  scale,
                  opacity,
                  filter: `blur(${blur}px)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 30,
                  mass: 0.8,
                }}
                onClick={() => {
                  if (isActive) {
                    setLightbox(cert.src);
                  } else {
                    setActive(i);
                  }
                }}
                whileHover={isActive ? { scale: scale * 1.04 } : {}}
                aria-label={`${cert.label} certificate${isActive ? " (active)" : ""}`}
              >
                {/* Card */}
                <div
                  className="w-full h-full rounded-2xl overflow-hidden relative"
                  style={{
                    boxShadow: isActive
                      ? "0 0 0 1px rgba(212,178,111,0.25), 0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(158,31,38,0.2)"
                      : "0 8px 32px rgba(0,0,0,0.5)",
                    background: "#1A1A1A",
                  }}
                >
                  <img
                    src={cert.src}
                    alt={cert.label}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  {/* Active card overlay hint */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-body text-[11px] text-neutral-offwhite/70 uppercase tracking-[2px]">
                          Click to expand
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Border glow for active */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        boxShadow: "inset 0 0 0 1px rgba(212,178,111,0.3)",
                      }}
                    />
                  )}
                </div>

                {/* Label below card */}
                <motion.p
                  className="text-center font-body text-[12px] uppercase tracking-[2px] mt-3"
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
                  transition={{ duration: 0.3 }}
                  style={{ color: "var(--color-accent-gold)" }}
                >
                  {cert.label}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        {/* Prev / Next arrows */}
        <div className="relative z-20 flex items-center gap-6 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white flex items-center justify-center transition-all duration-200"
            aria-label="Previous certificate"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Certificate navigation">
            {CERTS.map((cert, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                role="tab"
                aria-selected={i === active}
                aria-label={`Go to ${cert.label}`}
                className="transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
                style={{
                  width: i === active ? 24 : 6,
                  height: 6,
                  background:
                    i === active
                      ? "var(--color-accent-gold)"
                      : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white flex items-center justify-center transition-all duration-200"
            aria-label="Next certificate"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Top / bottom fades */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0A0A0A] to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent z-20" />
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Certificate full view"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-lg transition-colors z-10"
              aria-label="Close"
            >
              ✕
            </button>

            <motion.img
              src={lightbox}
              alt="Certificate full size"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            />

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-xs font-body tracking-widest uppercase">
              Click anywhere to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CertificatesSection;
