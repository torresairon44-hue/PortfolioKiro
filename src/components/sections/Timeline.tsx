"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/cn";
import { timeline } from "@/lib/constants";

interface TimelineProps {
  className?: string;
}

const Timeline = ({ className }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateStyles = useCallback(() => {
    if (!containerRef.current || !cardRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

    // Determine which card to show based on progress
    const totalCards = timeline.length;
    const newIndex = Math.min(Math.floor(progress * totalCards), totalCards - 1);

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }

    // Animate the current card
    const cardStart = newIndex / totalCards;
    const cardEnd = (newIndex + 1) / totalCards;
    const cardProgress = Math.min(
      Math.max((progress - cardStart) / (cardEnd - cardStart), 0),
      1
    );

    // Entry animation (0 to 0.3)
    // Hold (0.3 to 0.7)
    // Exit animation (0.7 to 1.0)
    let opacity = 1;
    let translateY = 0;
    let scale = 1;
    let rotate = 0;

    if (cardProgress < 0.3) {
      // Entering
      const entry = cardProgress / 0.3;
      const eased = 1 - Math.pow(1 - entry, 3);
      opacity = eased;
      translateY = (1 - eased) * 80;
      scale = 0.8 + eased * 0.2;
      rotate = (1 - eased) * 5;
    } else if (cardProgress > 0.7) {
      // Exiting
      const exit = (cardProgress - 0.7) / 0.3;
      const eased = Math.pow(exit, 2);
      opacity = 1 - eased;
      translateY = -eased * 60;
      scale = 1 - eased * 0.15;
      rotate = -eased * 3;
    }

    cardRef.current.style.opacity = `${opacity}`;
    cardRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotate}deg)`;
  }, [activeIndex]);

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

  const currentItem = timeline[activeIndex];

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[400vh]", className)}
    >
      <section
        className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6 md:px-12 lg:px-[108px]"
        aria-label="Career timeline"
      >
        {/* Progress dots */}
        <div className="absolute top-1/2 right-8 md:right-12 -translate-y-1/2 flex flex-col gap-3 z-10">
          {timeline.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-500",
                index === activeIndex
                  ? "bg-accent-red scale-125 shadow-[0_0_10px_rgba(222,10,38,0.6)]"
                  : index < activeIndex
                  ? "bg-accent-red/50"
                  : "bg-neutral-dark-gray"
              )}
            />
          ))}
        </div>

        {/* Step counter */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="font-display text-[18px] text-accent-gold">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="font-body text-[14px] text-neutral-dark-gray">/</span>
          <span className="font-body text-[14px] text-neutral-dark-gray">
            {String(timeline.length).padStart(2, "0")}
          </span>
        </div>

        {/* Card — single visible at a time */}
        <div
          ref={cardRef}
          className="relative flex flex-col items-center text-center gap-6 p-8 md:p-12 max-w-[600px] w-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.4)] will-change-[transform,opacity]"
        >
          {/* Period badge */}
          <span className="inline-flex px-5 py-2 rounded-full bg-accent-gold/15 border border-accent-gold/30 font-body font-bold text-[13px] text-accent-gold uppercase tracking-[1.5px]">
            {currentItem.period}
          </span>

          {/* Title */}
          <h3 className="font-display text-[32px] md:text-[42px] leading-none text-neutral-white">
            {currentItem.title}
          </h3>

          {/* Description */}
          <p className="font-body font-normal text-[15px] md:text-[16px] leading-[1.7] text-neutral-offwhite max-w-[480px]">
            {currentItem.description}
          </p>

          {/* Decorative accent line */}
          <div className="w-12 h-1 rounded-full bg-accent-red/50 mt-2" />

          {/* Glass shine */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-3xl" />
        </div>
      </section>
    </div>
  );
};

export default Timeline;
