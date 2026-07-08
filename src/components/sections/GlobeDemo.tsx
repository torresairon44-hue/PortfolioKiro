"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { techStack } from "@/lib/constants";
import { Globe } from "@/components/ui/cobe-globe";

const techLocations: [number, number][] = [
  [37.7595, -122.4367],
  [40.7128, -74.006],
  [35.6762, 139.6503],
  [51.5074, -0.1278],
  [-33.8688, 151.2093],
  [-33.9249, 18.4241],
  [25.2048, 55.2708],
  [48.8566, 2.3522],
  [-23.5505, -46.6333],
  [52.52, 13.405],
  [19.076, 72.8777],
  [1.3521, 103.8198],
  [34.0522, -118.2437],
  [55.7558, 37.6173],
  [14.5995, 120.9842],
  [41.9028, 12.4964],
];

const markers = techStack.map((tech, index) => ({
  id: tech.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  location: techLocations[index % techLocations.length],
  label: tech,
}));

const arcs = [
  {
    id: "javascript-react",
    from: [37.7595, -122.4367] as [number, number],
    to: [35.6762, 139.6503] as [number, number],
    label: "JavaScript → Next.js",
  },
  {
    id: "react-typescript",
    from: [40.7128, -74.006] as [number, number],
    to: [51.5074, -0.1278] as [number, number],
    label: "React → TypeScript",
  },
];

const categories = [
  {
    name: "Frontend",
    skills: ["JavaScript", "React", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"],
  },
  { name: "Backend & DB", skills: ["Node.js", "MongoDB", "Python"] },
  { name: "Tools & Design", skills: ["Figma", "Canva", "VS Code", "Git", "Vercel", "Linux"] },
];

function ZoomReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 100]);
  const bgColor = useTransform(
    scrollYProgress,
    [0.0,       0.68,      0.70,      1.0],
    ["#E2E8F0", "#E2E8F0", "#0A0A0A", "#0A0A0A"]
  );

  // On mobile skip the 1000vh zoom — just a thin black bridge
  if (isMobile) {
    return <div className="h-4 bg-[#0A0A0A]" />;
  }

  return (
    <div ref={containerRef} className="relative h-[500vh] md:h-[1000vh]">
      <motion.div
        className="sticky top-0 h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        {/* opacity is a plain static 1 — never interpolated, never fades */}
        <motion.div
          className="will-change-transform"
          style={{
            scale,
            opacity: 1,
            // Zoom origin locked on the R in "SCROLL":
            // X: Bebas Neue — R center ≈ calc(50% - 0.23em) for centered "SCROLL"
            // Y: "SCROLL" sits above the chevron. R is in upper portion → 30%
            transformOrigin: "calc(50% - 0.23em) 30%",
            fontSize: "8vmax",
          }}
        >
          {/* SCROLL */}
          <span
            className="font-display leading-none select-none block text-center"
            style={{ color: "#0A0A0A", letterSpacing: "-0.01em" }}
          >
            SCROLL
          </span>

          {/* Floating chevron — replaces "DOWN".
              Floats with a gentle y bob, always solid black. */}
          <motion.span
            className="block text-center select-none leading-none"
            style={{ color: "#0A0A0A", fontSize: "0.5em", marginTop: "0.2em" }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            ⌄
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function GlobeDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const update = useCallback(() => {
    if (!containerRef.current || !globeRef.current || !cardRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = -rect.top;
    const rawProgress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
    // reveal completes in first 60% of scroll
    const progress = Math.min(rawProgress / 0.6, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const dist = 60;

    globeRef.current.style.opacity = `${eased}`;
    globeRef.current.style.transform = `translate3d(${(1 - eased) * -dist}px, 0, 0)`;
    cardRef.current.style.opacity = `${eased}`;
    cardRef.current.style.transform = `translate3d(${(1 - eased) * dist}px, 0, 0)`;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  return (
    <div className="bg-[#E2E8F0]">

      {/* ── Part 1: Globe + Tech stack — scroll-pinned reveal ── */}
      <div ref={containerRef} className="relative h-[220vh]">
        <div className="sticky top-0 h-screen flex items-center">
          <div className="flex flex-col lg:flex-row items-center justify-center w-full p-6 md:p-12 lg:px-[108px] gap-10 lg:gap-16">

            {/* Left: Globe — slides in from left */}
            <div
              ref={globeRef}
              className="flex-1 flex items-center justify-center w-full max-w-[500px] lg:max-w-none aspect-square will-change-[transform,opacity]"
              style={{ opacity: 0, transform: "translate3d(-60px, 0, 0)" }}
            >
              <div className="w-full max-w-[480px]">
                <Globe
                  markers={markers}
                  arcs={arcs}
                  markerColor={[0.62, 0.12, 0.15]}
                  baseColor={[1, 1, 1]}
                  arcColor={[0.62, 0.12, 0.15]}
                  glowColor={[0.94, 0.93, 0.91]}
                  dark={0}
                  mapBrightness={10}
                  markerSize={0.025}
                  markerElevation={0.01}
                />
              </div>
            </div>

            {/* Right: Tech stack card — slides in from right */}
            <div
              ref={cardRef}
              className="w-full lg:w-[420px] shrink-0 z-10 will-change-[transform,opacity]"
              style={{ opacity: 0, transform: "translate3d(60px, 0, 0)" }}
            >
              <div className="backdrop-blur-xl bg-gradient-to-br from-zinc-400/15 via-zinc-500/10 to-zinc-800/5 border border-zinc-400/20 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                <div className="flex flex-col gap-1.5 mb-5 relative z-10">
                  <span className="font-body font-semibold text-[10px] uppercase tracking-[3px] text-zinc-500">
                    Global Stack
                  </span>
                  <h3 className="font-display text-[26px] md:text-[32px] leading-none text-[#0A0A0A]">
                    Technology
                  </h3>
                  <p className="font-body text-[13px] text-zinc-500 mt-1 leading-relaxed">
                    The modern languages, frameworks, and database environments I use to build
                    responsive interfaces and scalable applications.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5 relative z-10">
                  {categories.flatMap((c) => c.skills).map((skill) => (
                    <div
                      key={skill}
                      className="px-3.5 py-2 rounded-full text-[12px] font-body text-zinc-700 bg-white/70 border border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:scale-105 hover:bg-white hover:border-[#8E1F26]/30 hover:text-zinc-950 cursor-default"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 rounded-full bg-[#8E1F26]/5 blur-2xl pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Part 2: Zoom-reveal bridge into ServiceShowcase ── */}
      <ZoomReveal />

    </div>
  );
}
