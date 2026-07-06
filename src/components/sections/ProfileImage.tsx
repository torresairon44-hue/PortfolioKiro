"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface ProfileImageProps {
  className?: string;
}

const ProfileImage = ({ className }: ProfileImageProps) => {
  const [isDark, setIsDark] = useState(true);

  return (
    <div
      className={cn(
        "relative w-full max-w-[420px] aspect-[3/3.5] lg:w-[420px] lg:h-[490px] rounded-[var(--radius-md)] overflow-hidden group/profile",
        className
      )}
    >
      {/* Light mode image */}
      <Image
        src="/images/profile-light.jpg"
        alt="Profile portrait (light)"
        fill
        className={cn(
          "object-cover transition-opacity duration-500 ease-in-out",
          isDark ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        )}
        priority
        sizes="(max-width: 1024px) 100vw, 420px"
      />

      {/* Dark mode image */}
      <Image
        src="/images/profile-dark.jpg"
        alt="Profile portrait (dark)"
        fill
        className={cn(
          "object-cover transition-opacity duration-500 ease-in-out",
          isDark ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        priority
        sizes="(max-width: 1024px) 100vw, 420px"
      />

      {/* Ultra-Premium Glassmorphic Switch */}
      <button
        type="button"
        onClick={() => setIsDark(!isDark)}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center w-[76px] h-[38px] p-[4px] bg-neutral-black/80 backdrop-blur-xl rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 group/toggle shadow-2xl cursor-pointer"
        aria-label={isDark ? "Switch profile picture to light theme" : "Switch profile picture to dark theme"}
      >
        {/* Sliding Active Knob */}
        <div
          className={cn(
            "absolute top-[4px] bottom-[4px] w-[30px] rounded-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            isDark 
              ? "left-[calc(100%-34px)] bg-accent-gold text-neutral-black shadow-[0_0_12px_rgba(212,178,111,0.5)]" 
              : "left-[4px] bg-accent-red text-neutral-white shadow-[0_0_12px_rgba(158,31,38,0.5)]"
          )}
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 animate-[spin_8s_linear_infinite]">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </div>

        {/* Background Icons */}
        <div className="w-full h-full flex justify-between items-center px-2.5 pointer-events-none text-neutral-offwhite/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default ProfileImage;
