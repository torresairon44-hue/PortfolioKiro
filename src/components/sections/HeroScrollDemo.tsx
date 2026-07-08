"use client";

import React, { useState, useEffect } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

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

  useEffect(() => {
    const fullWord = roles[currentRoleIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        const nextText = fullWord.substring(0, currentText.length + 1);
        setCurrentText(nextText);

        if (nextText === fullWord) {
          setTypingSpeed(2000); // Pause on complete word
          setIsDeleting(true);
        } else {
          setTypingSpeed(80); // Typing speed
        }
      } else {
        const nextText = fullWord.substring(0, currentText.length - 1);
        setCurrentText(nextText);

        if (nextText === "") {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          setTypingSpeed(300); // Pause before next word
        } else {
          setTypingSpeed(40); // Deleting speed
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, typingSpeed]);

  return (
    <section
      className="flex flex-col overflow-hidden bg-[#0B0B0C] bg-[linear-gradient(to_right,#1f29371a_1px,transparent_1px),linear-gradient(to_bottom,#1f29371a_1px,transparent_1px)] bg-[size:4rem_4rem]"
      aria-label="Portfolio preview"
    >
      <ContainerScroll
        titleComponent={
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
        }
      >
        <Image
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=75"
          alt="A code editor with a web development project open"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
          priority
        />
      </ContainerScroll>
    </section>
  );
};

export default HeroScrollDemo;

