"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/constants";
import { Button } from "@/components/ui";
import { LinkedInIcon, GitHubIcon } from "@/components/icons";
import ProfileImage from "./ProfileImage";

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Mobile-first default prevents SSR flash
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    setMounted(true);
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ── Desktop: scroll-driven fade/slide ────────────────────────────
  const updateDesktopStyles = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
    const leftProgress = Math.min(progress / 0.45, 1);
    const rightProgress = Math.min(Math.max((progress - 0.45) / 0.45, 0), 1);
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const leftEased = easeOut(leftProgress);
    const rightEased = easeOut(rightProgress);
    if (leftRef.current) {
      leftRef.current.style.opacity = `${leftEased}`;
      leftRef.current.style.transform = `translate3d(${(1 - leftEased) * -60}px, 0, 0)`;
    }
    if (rightRef.current) {
      rightRef.current.style.opacity = `${rightEased}`;
      rightRef.current.style.transform = `translate3d(${(1 - rightEased) * 60}px, 0, 0)`;
    }
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.opacity = `${Math.max(1 - progress * 4, 0)}`;
    }
  }, []);

  // ── Desktop scroll listener ───────────────────────────────────────
  useEffect(() => {
    if (!mounted || isMobile) return;
    if (leftRef.current) {
      leftRef.current.style.transition = "none";
      leftRef.current.style.opacity = "0";
      leftRef.current.style.transform = "translate3d(-60px, 0, 0)";
    }
    if (rightRef.current) {
      rightRef.current.style.transition = "none";
      rightRef.current.style.opacity = "0";
      rightRef.current.style.transform = "translate3d(60px, 0, 0)";
    }
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateDesktopStyles);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateDesktopStyles();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mounted, isMobile, updateDesktopStyles]);

  // ── Mobile: IntersectionObserver + CSS animation classes ─────────
  // When section enters viewport → add animation class
  // Much more reliable than JS transitions, works in DevTools emulator
  useEffect(() => {
    if (!mounted || !isMobile) return;

    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Entering view — trigger CSS animation
            left.classList.add('hero-fade-up');
            right.classList.add('hero-fade-up-delay');
          } else {
            // Left view — remove classes to re-trigger on re-entry
            left.classList.remove('hero-fade-up');
            right.classList.remove('hero-fade-up-delay');
            // Reset to hidden state
            left.style.opacity = '0';
            left.style.transform = 'translateY(32px)';
            right.style.opacity = '0';
            right.style.transform = 'translateY(32px)';
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -5% 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [mounted, isMobile]);

  const showMobile = !mounted || isMobile;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-[#0D0D0E] bg-[radial-gradient(circle_at_center,rgba(158,31,38,0.08)_0%,transparent_70%)]",
        showMobile ? "min-h-screen" : "h-[500vh]",
        className
      )}
    >
      <section
        className={cn(
          "flex flex-col overflow-hidden",
          showMobile
            ? "relative pt-20 min-h-screen"
            : "sticky top-0 h-screen will-change-transform"
        )}
        aria-label="Hero introduction"
      >
        <div className="flex flex-1 items-center px-6 md:px-12 lg:px-[108px]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 md:gap-12 lg:gap-0 w-full">

            {/* Left — Text Content */}
            <div
              ref={leftRef}
              className={cn(
                "flex flex-col gap-6 md:gap-8 max-w-[580px]",
                showMobile && "opacity-0"
              )}
              style={showMobile ? { transform: "translateY(32px)" } : undefined}
            >
              <h1 className="font-display text-[40px] sm:text-[52px] md:text-[72px] lg:text-[96px] leading-[0.9] text-neutral-white">
                {siteConfig.shortName}
              </h1>
              <h2 className="font-body font-light text-[16px] sm:text-[18px] md:text-[22px] leading-[1.4] text-neutral-offwhite italic">
                Aspiring Software &amp; Web Developer
                <br />
                <span className="not-italic font-medium text-accent-gold">
                  UI/UX Enthusiast
                </span>
              </h2>
              <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                <a
                  href={siteConfig.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="flex items-center justify-center size-11 md:size-12 rounded-full border border-neutral-dark-gray text-neutral-offwhite hover:border-accent-red hover:text-accent-red transition-colors duration-200"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href={siteConfig.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="flex items-center justify-center size-11 md:size-12 rounded-full border border-neutral-dark-gray text-neutral-offwhite hover:border-accent-red hover:text-accent-red transition-colors duration-200"
                >
                  <GitHubIcon />
                </a>
                <Button variant="primary" href="#contact">
                  Contact Me
                </Button>
              </div>
            </div>

            {/* Right — Profile Image */}
            <div
              ref={rightRef}
              className={cn(showMobile && "opacity-0")}
              style={showMobile ? { transform: "translateY(32px)" } : undefined}
            >
              <ProfileImage />
            </div>

          </div>
        </div>

        {/* Scroll indicator — desktop only */}
        <div
          ref={scrollIndicatorRef}
          className={cn(
            "absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2",
            showMobile ? "hidden" : "flex"
          )}
        >
          <span className="font-body text-sm text-neutral-offwhite">
            Scroll down
          </span>
          <div className="w-5 h-8 border-2 border-neutral-offwhite rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-neutral-offwhite rounded-full animate-bounce" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
