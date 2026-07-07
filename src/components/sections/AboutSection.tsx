"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { stats, timeline, certificates } from "@/lib/constants";
import { ZoomParallax } from "@/components/ui/zoom-parallax";

interface AboutSectionProps {
  className?: string;
}

const PARALLAX_IMAGES = [
  {
    src: "/images/Middleparallax.mp4",
    alt: "Middle parallax video",
    isVideo: true,
  },
  {
    src: "/images/parallax1.jpeg",
    alt: "Parallax image 1",
  },
  {
    src: "/images/parallax6.JPG",
    alt: "Parallax image 6 (Portrait)",
  },
  {
    src: "/images/parallax2.JPG",
    alt: "Parallax image 2",
  },
  {
    src: "/images/parallax3.JPG",
    alt: "Parallax image 3",
  },
  {
    src: "/images/parallax4.JPG",
    alt: "Parallax image 4",
  },
  {
    src: "/images/parallax5.JPG",
    alt: "Parallax image 5",
  },
];

const AboutSection = ({ className }: AboutSectionProps) => {
  // ── CounterGrid refs ──────────────────────────────────────────────
  const counterContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const numberRefs = useRef<(HTMLElement | null)[]>([]);
  const journeyRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Certificates refs ─────────────────────────────────────────────
  const certContainerRef = useRef<HTMLDivElement>(null);
  const certCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const certInfoRef = useRef<HTMLDivElement>(null);
  const [activeCertIndex, setActiveCertIndex] = useState(0);
  const [certScrollProgress, setCertScrollProgress] = useState(0);

  const rafRef = useRef<number>(0);

  // ── CounterGrid + journey scroll handler ─────────────────────────
  const updateCounter = useCallback(() => {
    if (!counterContainerRef.current) return;
    const rect = counterContainerRef.current.getBoundingClientRect();
    const containerHeight = counterContainerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

    // Stat cards
    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const cardStart = index * 0.1;
      const cardEnd = cardStart + 0.35;
      const cardProgress = Math.min(
        Math.max((progress - cardStart) / (cardEnd - cardStart), 0),
        1
      );
      const bounce = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const eased = bounce(cardProgress);
      const directions = [
        { x: -80, y: -40, rotate: -12 },
        { x: 80, y: -60, rotate: 8 },
        { x: -60, y: 60, rotate: 6 },
        { x: 80, y: 40, rotate: -10 },
      ];
      const dir = directions[index % 4];
      el.style.opacity = `${eased}`;
      el.style.transform = `translate3d(${(1 - eased) * dir.x}px, ${(1 - eased) * dir.y}px, 0) rotate(${(1 - eased) * dir.rotate}deg) scale(${0.6 + eased * 0.4})`;
    });

    numberRefs.current.forEach((el, index) => {
      if (!el) return;
      const cardStart = index * 0.1;
      const cardEnd = cardStart + 0.35;
      const cardProgress = Math.min(
        Math.max((progress - cardStart) / (cardEnd - cardStart), 0),
        1
      );
      el.style.transform = `scale(${cardProgress >= 1 ? 1 : 0.8 + cardProgress * 0.2})`;
    });

    // Journey items — animate in during second half of scroll
    const journeyStart = 0.55;
    journeyRefs.current.forEach((el, index) => {
      if (!el) return;
      const itemStart = journeyStart + index * 0.1;
      const itemEnd = itemStart + 0.2;
      const itemProgress = Math.min(
        Math.max((progress - itemStart) / (itemEnd - itemStart), 0),
        1
      );
      const eased = 1 - Math.pow(1 - itemProgress, 3);
      el.style.opacity = `${eased}`;
      el.style.transform = `translateY(${(1 - eased) * 24}px)`;
    });
  }, []);

  // ── Certificates scroll handler ───────────────────────────────────
  const updateCert = useCallback(() => {
    if (!certContainerRef.current) return;
    const rect = certContainerRef.current.getBoundingClientRect();
    const containerHeight = certContainerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

    setCertScrollProgress(progress);

    const totalCards = certificates.length;
    const rawIndex = progress * totalCards;
    const newIndex = Math.min(Math.floor(rawIndex), totalCards - 1);
    setActiveCertIndex(newIndex);

    // Animate each card in the stack
    certCardRefs.current.forEach((el, index) => {
      if (!el) return;

      const cardStart = index / totalCards;
      const cardEnd = (index + 1) / totalCards;
      const cardProgress = Math.min(Math.max((progress - cardStart) / (cardEnd - cardStart), 0), 1);

      if (index < newIndex) {
        // Already-seen cards: fly off upward and away
        el.style.opacity = "0";
        el.style.transform = `translate3d(0, -80px, 0) scale(0.85) rotate(-4deg)`;
        el.style.zIndex = `${index}`;
      } else if (index === newIndex) {
        // Active card: smooth entrance from bottom-right with tilt
        const easeIn = 1 - Math.pow(1 - cardProgress, 3);
        const entryX = (1 - easeIn) * 60;
        const entryY = (1 - easeIn) * 40;
        const entryRotate = (1 - easeIn) * 8;
        const entryScale = 0.82 + easeIn * 0.18;
        el.style.opacity = `${easeIn}`;
        el.style.transform = `translate3d(${entryX}px, ${entryY}px, 0) scale(${entryScale}) rotate(${entryRotate}deg)`;
        el.style.zIndex = `${totalCards + 10}`;
        el.style.boxShadow = "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)";
      } else {
        // Future cards: stacked behind with offset and tilt
        const offset = index - newIndex;
        el.style.opacity = `${Math.max(0, 1 - offset * 0.25)}`;
        el.style.transform = `translate3d(${offset * 10}px, ${offset * 8}px, 0) scale(${1 - offset * 0.04}) rotate(${offset * 2}deg)`;
        el.style.zIndex = `${totalCards - offset}`;
        el.style.boxShadow = "";
      }
    });

    // Animate info panel
    if (certInfoRef.current) {
      certInfoRef.current.style.opacity = progress > 0.02 ? "1" : "0";
      certInfoRef.current.style.transform = progress > 0.02 ? "translate3d(0,0,0)" : "translate3d(-20px,0,0)";
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateCounter();
        updateCert();
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateCounter();
    updateCert();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateCounter, updateCert]);

  const cardStyles = [
    "col-span-2 md:col-span-1 md:row-span-2 rounded-3xl",
    "col-span-1 rounded-[2rem]",
    "col-span-1 rounded-2xl",
    "col-span-2 md:col-span-1 rounded-[1.5rem_3rem_1.5rem_3rem]",
  ];
  const bgStyles = [
    "bg-gradient-to-br from-accent-red/15 to-accent-gold/5 border-accent-red/20 shadow-[0_4px_24px_rgba(0,0,0,0.04)]",
    "bg-gradient-to-tr from-black/5 to-black/2 border-black/10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]",
    "bg-gradient-to-bl from-accent-red/5 to-black/2 border-black/10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]",
    "bg-gradient-to-tl from-black/8 to-accent-gold/5 border-accent-gold/20 shadow-[0_4px_24px_rgba(0,0,0,0.04)]",
  ];

  const currentCert = certificates[activeCertIndex];
  const overallProgress = Math.round(certScrollProgress * 100);

  return (
    <section aria-label="About" className={cn("", className)}>

      {/* ── Zoom Parallax opener ── */}
      <div className="relative bg-[#0D0D0E] bg-[radial-gradient(circle_at_center,rgba(158,31,38,0.08)_0%,transparent_70%)]">
        <div className="flex flex-col items-center justify-center pt-24 pb-12 gap-3">
          <span className="font-display text-[11px] tracking-[4px] text-neutral-dark-gray uppercase">
            Section
          </span>
          <h2 className="font-display text-[56px] md:text-[80px] leading-none text-neutral-white">
            About
          </h2>
          <p className="font-body text-[15px] text-neutral-offwhite max-w-[420px] text-center leading-relaxed">
            A glimpse into who I am, what I&apos;ve built, and where I&apos;m heading.
          </p>
        </div>
        <ZoomParallax images={PARALLAX_IMAGES} />
      </div>

      <div className="bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] text-[#0A0A0A] relative">
        {/* Subtle top fade transition from Hero background #0D0D0E to light gray */}
        <div className="absolute top-0 left-0 right-0 h-[80vh] bg-gradient-to-b from-[#0D0D0E] to-transparent pointer-events-none z-10" />

        {/* ── Stats + Journey ── */}
        <div ref={counterContainerRef} className="relative h-[350vh]">
          <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6 md:px-12 lg:px-[108px] gap-8">

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 w-full max-w-[900px]">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-2 p-6 md:p-8",
                    "backdrop-blur-xl border",
                    "shadow-[0_4px_24px_rgba(0,0,0,0.3)]",
                    "hover:scale-105 transition-transform duration-300",
                    "will-change-[transform,opacity]",
                    cardStyles[index],
                    bgStyles[index]
                  )}
                  style={{ opacity: 0, transform: "translate3d(0,0,0) rotate(0deg) scale(0.6)" }}
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-accent-gold" />
                  </div>
                  <span
                    ref={(el) => { numberRefs.current[index] = el; }}
                    className="font-display text-[44px] md:text-[56px] leading-none text-accent-red relative z-10 will-change-transform"
                  >
                    {stat.value}
                  </span>
                  <span className="font-body font-normal text-[11px] md:text-[12px] text-zinc-600 uppercase tracking-[1.5px] text-center relative z-10">
                    {stat.label}
                  </span>
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-inherit" />
                </div>
              ))}
            </div>

            {/* Journey timeline strip */}
            <div className="flex items-start gap-0 w-full max-w-[900px]">
              {timeline.map((item, index) => (
                <div
                  key={item.title}
                  ref={(el) => { journeyRefs.current[index] = el; }}
                  className="flex-1 flex flex-col items-center gap-2 relative will-change-[transform,opacity]"
                  style={{ opacity: 0, transform: "translateY(24px)" }}
                >
                  {/* connector line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute top-[11px] left-1/2 w-full h-px bg-gradient-to-r from-accent-gold/60 to-accent-red/10" />
                  )}
                  {/* dot */}
                  <div className="w-5 h-5 rounded-full border-2 border-accent-gold bg-white relative z-10 shadow-[0_0_8px_rgba(212,178,111,0.2)]" />
                  {/* period */}
                  <span className="font-body text-[10px] text-[#8A6623] uppercase tracking-[1.5px] font-bold">
                    {item.period}
                  </span>
                  {/* title */}
                  <span className="font-display text-[13px] md:text-[15px] text-[#0A0A0A] text-center leading-tight">
                    {item.title}
                  </span>
                  {/* description */}
                  <p className="font-body text-[11px] text-zinc-600 text-center leading-relaxed px-2 hidden md:block">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Certificates & Awards ── */}
        <div ref={certContainerRef} className="relative h-[700vh]">
          <div className="sticky top-0 h-screen flex items-center overflow-hidden px-6 md:px-12 lg:px-[108px]">

            {/* ── Left Info Panel ── */}
            <div
              ref={certInfoRef}
              className="hidden lg:flex flex-col gap-6 w-[320px] shrink-0 transition-all duration-700"
              style={{ opacity: 0, transform: "translate3d(-20px,0,0)" }}
            >
              {/* Label */}
              <span className="font-body font-semibold text-[11px] uppercase tracking-[3px] text-zinc-400">
                Certifications & Awards
              </span>

              {/* Title */}
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-[36px] leading-none text-[#0A0A0A]">
                  {currentCert.title}
                </h3>
                <p className="font-body text-[14px] text-zinc-500">{currentCert.issuer} · {currentCert.year}</p>
              </div>

              {/* Type badge */}
              <span className={cn(
                "self-start px-3 py-1 rounded-full text-[11px] font-body font-bold uppercase tracking-[2px]",
                currentCert.type === "Award"
                  ? "bg-accent-gold/15 text-[#8A6623] border border-accent-gold/30"
                  : "bg-accent-red/10 text-accent-red border border-accent-red/20"
              )}>
                {currentCert.type}
              </span>

              {/* Progress bar */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-body text-[11px] text-zinc-400 uppercase tracking-[1px]">Progress</span>
                  <span className="font-body font-bold text-[12px] text-[#0A0A0A]">{activeCertIndex + 1} / {certificates.length}</span>
                </div>
                <div className="h-[3px] w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-red to-accent-gold rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>

              {/* Dot nav */}
              <div className="flex gap-2">
                {certificates.map((cert, index) => (
                  <div
                    key={index}
                    title={cert.title}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      index === activeCertIndex
                        ? "w-8 bg-accent-red"
                        : index < activeCertIndex
                          ? "w-3 bg-accent-red/30"
                          : "w-3 bg-zinc-300"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* ── Right — Stacked Card Deck ── */}
            <div className="flex-1 flex items-center justify-center lg:justify-end relative h-full">
              <div className="relative w-full max-w-[520px] aspect-[4/3]" style={{ perspective: "1200px" }}>
                {certificates.map((cert, index) => (
                  <div
                    key={cert.title}
                    ref={(el) => { certCardRefs.current[index] = el; }}
                    className="absolute inset-0 rounded-2xl overflow-hidden border border-black/8 will-change-[transform,opacity]"
                    style={{
                      opacity: 0,
                      transform: `translate3d(${(index) * 10}px, ${(index) * 8}px, 0) scale(${1 - index * 0.04}) rotate(${index * 2}deg)`,
                      transition: "box-shadow 0.4s ease",
                      zIndex: certificates.length - index,
                    }}
                  >
                    <Image
                      src={cert.imageSrc}
                      alt={cert.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 520px"
                      priority={index === 0}
                    />
                    {/* Bottom overlay with title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                      <div>
                        <p className="font-body font-bold text-[13px] text-white/90">{cert.title}</p>
                        <p className="font-body text-[11px] text-white/55">{cert.issuer} · {cert.year}</p>
                      </div>
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[1.5px]",
                        cert.type === "Award"
                          ? "bg-accent-gold/90 text-black"
                          : "bg-accent-red/90 text-white"
                      )}>
                        {cert.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: dot progress (bottom center) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden">
              {certificates.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    index === activeCertIndex ? "w-8 bg-accent-red" : "w-3 bg-zinc-300"
                  )}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
