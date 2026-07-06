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
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&h=720&fit=crop&auto=format&q=80",
    alt: "Code editor with a web project",
  },
  {
    src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1280&h=720&fit=crop&auto=format&q=80",
    alt: "Designer working on UI layouts",
  },
  {
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=800&fit=crop&auto=format&q=80",
    alt: "Programming on a laptop",
  },
  {
    src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1280&h=720&fit=crop&auto=format&q=80",
    alt: "Web design wireframes on screen",
  },
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&auto=format&q=80",
    alt: "Minimalist design elements",
  },
  {
    src: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1280&h=720&fit=crop&auto=format&q=80",
    alt: "Creative workspace with monitor",
  },
  {
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1280&h=720&fit=crop&auto=format&q=80",
    alt: "Developer typing on keyboard",
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
  const certCardRef = useRef<HTMLDivElement>(null);
  const [activeCertIndex, setActiveCertIndex] = useState(0);

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
    if (!certContainerRef.current || !certCardRef.current) return;
    const rect = certContainerRef.current.getBoundingClientRect();
    const containerHeight = certContainerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

    const totalCards = certificates.length;
    const newIndex = Math.min(Math.floor(progress * totalCards), totalCards - 1);
    setActiveCertIndex(newIndex);

    const cardStart = newIndex / totalCards;
    const cardEnd = (newIndex + 1) / totalCards;
    const cardProgress = Math.min(
      Math.max((progress - cardStart) / (cardEnd - cardStart), 0),
      1
    );

    let opacity = 1,
      translateY = 0,
      scale = 1,
      rotate = 0;

    if (cardProgress < 0.3) {
      const eased = 1 - Math.pow(1 - cardProgress / 0.3, 3);
      opacity = eased;
      translateY = (1 - eased) * 80;
      scale = 0.8 + eased * 0.2;
      rotate = (1 - eased) * 5;
    } else if (cardProgress > 0.7) {
      const eased = Math.pow((cardProgress - 0.7) / 0.3, 2);
      opacity = 1 - eased;
      translateY = -eased * 60;
      scale = 1 - eased * 0.15;
      rotate = -eased * 3;
    }

    certCardRef.current.style.opacity = `${opacity}`;
    certCardRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotate}deg)`;
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
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6 md:px-12 lg:px-[108px]">

          {/* Progress dots */}
          <div className="absolute top-1/2 right-8 md:right-12 -translate-y-1/2 flex flex-col gap-3 z-10">
            {certificates.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-500",
                  index === activeCertIndex
                    ? "bg-accent-red scale-125 shadow-[0_0_10px_rgba(222,10,38,0.6)]"
                    : index < activeCertIndex
                    ? "bg-accent-red/40"
                    : "bg-zinc-400"
                )}
              />
            ))}
          </div>

          {/* Certificate card — image only */}
          <div
            ref={certCardRef}
            className="relative w-full max-w-[680px] aspect-[4/3] rounded-3xl overflow-hidden border border-black/5 shadow-[0_8px_40px_rgba(0,0,0,0.18)] will-change-[transform,opacity]"
          >
            <Image
              src={currentCert.imageSrc}
              alt={currentCert.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 680px"
            />
            {/* subtle vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

        </div>
      </div>

      </div>
    </section>
  );
};

export default AboutSection;
