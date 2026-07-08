"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/cn";
import { stats, timeline } from "@/lib/constants";
import { ZoomParallax } from "@/components/ui/zoom-parallax";

interface AboutSectionProps {
  className?: string;
}

const PARALLAX_IMAGES = [
  { src: "/images/Middleparallax.mp4", alt: "Middle parallax video", isVideo: true },
  { src: "/images/parallax1.jpeg",     mobileSrc: "/images/mobile1.JPG", alt: "Parallax image 1" },
  { src: "/images/parallax6.JPG",      mobileSrc: "/images/mobile2.JPG", alt: "Parallax image 6" },
  { src: "/images/parallax2.JPG",      mobileSrc: "/images/mobile3.JPG", alt: "Parallax image 2" },
  { src: "/images/parallax3.JPG",      mobileSrc: "/images/mobile4.JPG", alt: "Parallax image 3" },
  { src: "/images/parallax4.JPG",      mobileSrc: "/images/mobile5.JPG", alt: "Parallax image 4" },
  { src: "/images/parallax5.JPG",      mobileSrc: "/images/mobile6.JPG", alt: "Parallax image 5" },
];

const AboutSection = ({ className }: AboutSectionProps) => {
  const counterContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const numberRefs = useRef<(HTMLElement | null)[]>([]);
  const journeyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  // Mobile-first default to avoid SSR flash
  const [isMobile, setIsMobile] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setMounted(true);
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Desktop: scroll-driven bounce/reveal animation ────────────────
  const updateCounter = useCallback(() => {
    if (!counterContainerRef.current) return;
    const rect = counterContainerRef.current.getBoundingClientRect();
    const containerHeight = counterContainerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const cardStart = index * 0.1;
      const cardEnd = cardStart + 0.35;
      const cardProgress = Math.min(Math.max((progress - cardStart) / (cardEnd - cardStart), 0), 1);
      const bounce = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const eased = bounce(cardProgress);
      const directions = [
        { x: -80, y: -40, rotate: -12 },
        { x: 80,  y: -60, rotate: 8   },
        { x: -60, y:  60, rotate: 6   },
        { x: 80,  y:  40, rotate: -10 },
      ];
      const dir = directions[index % 4];
      el.style.opacity = `${eased}`;
      el.style.transform = `translate3d(${(1 - eased) * dir.x}px, ${(1 - eased) * dir.y}px, 0) rotate(${(1 - eased) * dir.rotate}deg) scale(${0.6 + eased * 0.4})`;
    });

    numberRefs.current.forEach((el, index) => {
      if (!el) return;
      const cardStart = index * 0.1;
      const cardEnd = cardStart + 0.35;
      const cardProgress = Math.min(Math.max((progress - cardStart) / (cardEnd - cardStart), 0), 1);
      el.style.transform = `scale(${cardProgress >= 1 ? 1 : 0.8 + cardProgress * 0.2})`;
    });

    const journeyStart = 0.55;
    journeyRefs.current.forEach((el, index) => {
      if (!el) return;
      const itemStart = journeyStart + index * 0.1;
      const itemEnd = itemStart + 0.2;
      const itemProgress = Math.min(Math.max((progress - itemStart) / (itemEnd - itemStart), 0), 1);
      const eased = 1 - Math.pow(1 - itemProgress, 3);
      el.style.opacity = `${eased}`;
      el.style.transform = `translateY(${(1 - eased) * 24}px)`;
    });
  }, []);

  // ── Desktop: attach scroll listener ──────────────────────────────
  useEffect(() => {
    if (!mounted || isMobile) return;
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateCounter);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateCounter();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mounted, isMobile, updateCounter]);

  // ── Mobile: IntersectionObserver → CSS animation classes ─────────
  useEffect(() => {
    if (!mounted || !isMobile) return;

    // Cards observer — triggers staggered fade-in
    const cardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cardRefs.current.forEach((el, i) => {
              if (!el) return;
              el.classList.remove(`about-card-in-${i}`);
              // Force reflow so re-adding the class restarts the animation
              void (el as HTMLElement).offsetWidth;
              el.classList.add(`about-card-in-${i}`);
            });
          } else {
            // Reset so animation re-fires on next entry
            cardRefs.current.forEach((el, i) => {
              if (!el) return;
              el.classList.remove(`about-card-in-${i}`);
              (el as HTMLElement).style.opacity = "0";
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    // Timeline observer — triggers after cards
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            journeyRefs.current.forEach((el, i) => {
              if (!el) return;
              el.classList.remove("about-timeline-in");
              void (el as HTMLElement).offsetWidth;
              el.style.animationDelay = `${i * 80}ms`;
              el.classList.add("about-timeline-in");
            });
          } else {
            journeyRefs.current.forEach((el) => {
              if (!el) return;
              el.classList.remove("about-timeline-in");
              (el as HTMLElement).style.opacity = "0";
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (counterContainerRef.current) {
      cardsObserver.observe(counterContainerRef.current);
    }

    // Observe timeline section separately — it's a child
    const timelineEl = journeyRefs.current[0]?.parentElement;
    if (timelineEl) timelineObserver.observe(timelineEl);

    return () => {
      cardsObserver.disconnect();
      timelineObserver.disconnect();
    };
  }, [mounted, isMobile]);

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

  const showMobile = !mounted || isMobile;

  return (
    <section aria-label="About" className={cn("", className)}>

      {/* ── Zoom Parallax opener ── */}
      <div className="relative bg-[#0D0D0E] bg-[radial-gradient(circle_at_center,rgba(158,31,38,0.08)_0%,transparent_70%)]">
        <div className="flex flex-col items-center justify-center pt-24 pb-12 gap-3">
          <span className="font-display text-[11px] tracking-[4px] text-neutral-dark-gray uppercase">
            Section
          </span>
          <h2 className="font-display text-[44px] md:text-[80px] leading-none text-neutral-white">
            About
          </h2>
          <p className="font-body text-[15px] text-neutral-offwhite max-w-[420px] text-center leading-relaxed">
            A glimpse into who I am, what I&apos;ve built, and where I&apos;m heading.
          </p>
        </div>
        <ZoomParallax images={PARALLAX_IMAGES} />
      </div>

      {/* ── Stats + Journey ── */}
      <div className="bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] text-[#0A0A0A] relative">
        <div className={cn(
          "absolute top-0 left-0 right-0 bg-gradient-to-b from-[#0D0D0E] to-transparent pointer-events-none z-10",
          showMobile ? "h-[20vh]" : "h-[80vh]"
        )} />

        {showMobile ? (
          /* ── Mobile: natural flow, CSS-animated ── */
          <div ref={counterContainerRef} className="relative px-5 py-20 pt-24 flex flex-col gap-12">

            {/* Stat cards — 2 column grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-2 p-5",
                    "backdrop-blur-xl border",
                    "shadow-[0_4px_24px_rgba(0,0,0,0.3)]",
                    cardStyles[index],
                    bgStyles[index]
                  )}
                  style={{ opacity: 0 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <div className="w-16 h-16 rounded-full border-2 border-accent-gold" />
                  </div>
                  <span
                    ref={(el) => { numberRefs.current[index] = el; }}
                    className="font-display text-[40px] leading-none text-accent-red relative z-10"
                  >
                    {stat.value}
                  </span>
                  <span className="font-body font-normal text-[10px] text-zinc-600 uppercase tracking-[1.5px] text-center relative z-10">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Journey timeline — vertical on mobile */}
            <div className="flex flex-col gap-5 w-full">
              {timeline.map((item, index) => (
                <div
                  key={item.title}
                  ref={(el) => { journeyRefs.current[index] = el; }}
                  className="flex items-start gap-4 relative"
                  style={{ opacity: 0 }}
                >
                  {/* Vertical connector */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-[9px] top-5 w-px h-full bg-gradient-to-b from-accent-gold/60 to-accent-red/10" />
                  )}
                  {/* Dot */}
                  <div className="w-5 h-5 rounded-full border-2 border-accent-gold bg-white shrink-0 shadow-[0_0_8px_rgba(212,178,111,0.2)] z-10 mt-0.5" />
                  {/* Text */}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-body text-[10px] text-[#8A6623] uppercase tracking-[1.5px] font-bold">
                      {item.period}
                    </span>
                    <span className="font-display text-[15px] text-[#0A0A0A] leading-tight">
                      {item.title}
                    </span>
                    <p className="font-body text-[11px] text-zinc-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* ── Desktop: sticky scroll-driven animation ── */
          <div ref={counterContainerRef} className="relative h-[200vh] md:h-[350vh]">
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
                    {index < timeline.length - 1 && (
                      <div className="absolute top-[11px] left-1/2 w-full h-px bg-gradient-to-r from-accent-gold/60 to-accent-red/10" />
                    )}
                    <div className="w-5 h-5 rounded-full border-2 border-accent-gold bg-white relative z-10 shadow-[0_0_8px_rgba(212,178,111,0.2)]" />
                    <span className="font-body text-[10px] text-[#8A6623] uppercase tracking-[1.5px] font-bold">
                      {item.period}
                    </span>
                    <span className="font-display text-[13px] md:text-[15px] text-[#0A0A0A] text-center leading-tight">
                      {item.title}
                    </span>
                    <p className="font-body text-[11px] text-zinc-600 text-center leading-relaxed px-2 hidden md:block">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
