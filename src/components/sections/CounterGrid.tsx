"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/cn";
import { stats } from "@/lib/constants";

interface CounterGridProps {
  className?: string;
}

const CounterGrid = ({ className }: CounterGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const numberRefs = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  const updateStyles = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

    const totalCards = stats.length;

    cardRefs.current.forEach((el, index) => {
      if (!el) return;

      // Stagger each card
      const cardStart = index * 0.15;
      const cardEnd = cardStart + 0.4;
      const cardProgress = Math.min(
        Math.max((progress - cardStart) / (cardEnd - cardStart), 0),
        1
      );

      // Spring-like bounce ease
      const bounce = (t: number) => {
        if (t < 0.5) return 4 * t * t * t;
        return 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const eased = bounce(cardProgress);

      // Each card comes from a different direction
      const directions = [
        { x: -80, y: -40, rotate: -12 },  // top-left, rotated
        { x: 80, y: -60, rotate: 8 },     // top-right, rotated
        { x: -60, y: 60, rotate: 6 },     // bottom-left, rotated
        { x: 80, y: 40, rotate: -10 },    // bottom-right, rotated
      ];

      const dir = directions[index % 4];
      const x = (1 - eased) * dir.x;
      const y = (1 - eased) * dir.y;
      const rotate = (1 - eased) * dir.rotate;
      const scale = 0.6 + eased * 0.4;

      el.style.opacity = `${eased}`;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
    });

    // Animate numbers counting up
    numberRefs.current.forEach((el, index) => {
      if (!el) return;
      const cardStart = index * 0.15;
      const cardEnd = cardStart + 0.4;
      const cardProgress = Math.min(
        Math.max((progress - cardStart) / (cardEnd - cardStart), 0),
        1
      );

      // Pulse scale on the number
      const pulse = cardProgress >= 1 ? 1 : 0.8 + cardProgress * 0.2;
      el.style.transform = `scale(${pulse})`;
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateStyles);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateStyles();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateStyles]);

  // Different shapes/sizes for bento feel
  const cardStyles = [
    "col-span-2 md:col-span-1 md:row-span-2 rounded-3xl",  // tall
    "col-span-1 rounded-[2rem]",                             // circle-ish
    "col-span-1 rounded-2xl",                                // standard
    "col-span-2 md:col-span-1 rounded-[1.5rem_3rem_1.5rem_3rem]", // asymmetric
  ];

  const bgStyles = [
    "bg-gradient-to-br from-accent-red/15 to-accent-gold/5 border-accent-red/20",
    "bg-gradient-to-tr from-white/10 to-white/5 border-white/15",
    "bg-gradient-to-bl from-accent-red/5 to-white/5 border-white/10",
    "bg-gradient-to-tl from-white/8 to-accent-gold/5 border-accent-gold/20",
  ];

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[250vh]", className)}
    >
      <section
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-6 md:px-12 lg:px-[108px]"
        aria-label="Key metrics"
      >
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
              style={{ opacity: 0, transform: "translate3d(0, 0, 0) rotate(0deg) scale(0.6)" }}
            >
              {/* Decorative ring behind number */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-accent-gold" />
              </div>

              <span
                ref={(el) => { numberRefs.current[index] = el; }}
                className="font-display text-[44px] md:text-[56px] leading-none text-accent-red relative z-10 will-change-transform"
              >
                {stat.value}
              </span>
              <span className="font-body font-normal text-[11px] md:text-[12px] text-neutral-offwhite uppercase tracking-[1.5px] text-center relative z-10">
                {stat.label}
              </span>

              {/* Glass shine */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-inherit" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CounterGrid;
