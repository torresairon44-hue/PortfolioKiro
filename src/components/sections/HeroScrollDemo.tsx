"use client";

import React, { useState, useEffect } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { IDEWindow } from "@/components/ui/IDEWindow";

const roles = [
  "Front-end Developer",
  "Web Developer",
  "Junior Programmer",
  "UI/UX Designer",
  "AI Engineer",
  "Backend Developer"
];

const HeroScrollDemo = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile — same breakpoint ContainerScroll uses (≤768px)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const fullWord = roles[currentRoleIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        const nextText = fullWord.substring(0, currentText.length + 1);
        setCurrentText(nextText);
        if (nextText === fullWord) {
          setTypingSpeed(2000);
          setIsDeleting(true);
        } else {
          setTypingSpeed(80);
        }
      } else {
        const nextText = fullWord.substring(0, currentText.length - 1);
        setCurrentText(nextText);
        if (nextText === "") {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          setTypingSpeed(300);
        } else {
          setTypingSpeed(40);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, typingSpeed]);

  const titleComponent = (
    <div className="flex flex-col items-center gap-3 md:gap-4 mb-8 md:mb-16">
      <p className="text-sm md:text-lg font-body font-medium text-neutral-offwhite uppercase tracking-widest">
        Airon Torres — Portfolio
      </p>
      <h1 className="font-display text-4xl md:text-7xl lg:text-[6rem] leading-none text-neutral-white min-h-[1.2em] flex items-center justify-center">
        <span>{currentText}</span>
        <span className="w-[3px] md:w-[4px] h-[0.8em] bg-current ml-1 animate-pulse" aria-hidden="true" />
      </h1>
      <p className="text-base md:text-xl text-neutral-offwhite font-body font-light italic">
        Scroll to explore
      </p>
    </div>
  );

  return (
    <section
      className="flex flex-col overflow-hidden bg-[#0B0B0C] bg-[linear-gradient(to_right,#1f29371a_1px,transparent_1px),linear-gradient(to_bottom,#1f29371a_1px,transparent_1px)] bg-[size:4rem_4rem]"
      aria-label="Portfolio preview"
    >
      {isMobile ? (
        /* ── Mobile: flat layout, no tilt, no scroll-driven 3D ── */
        <div className="flex flex-col items-center px-4 py-10 gap-6">
          {titleComponent}
          {/* IDE sits in a plain rounded card, no perspective/rotateX */}
          <div className="w-full rounded-2xl border-2 border-[#2e2b26] overflow-hidden shadow-2xl"
               style={{ height: "min(520px, 75vh)" }}>
            <IDEWindow className="h-full" />
          </div>
        </div>
      ) : (
        /* ── Desktop: full ContainerScroll 3D parallax ── */
        <ContainerScroll titleComponent={titleComponent}>
          <IDEWindow className="h-full" />
        </ContainerScroll>
      )}
    </section>
  );
};

export default HeroScrollDemo;

