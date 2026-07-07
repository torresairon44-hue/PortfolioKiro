"use client";

import { siteConfig } from "@/lib/constants";
import { LinkedInIcon, GitHubIcon, InstagramIcon } from "@/components/icons";

const FloatingSidebar = () => {
  return (
    <aside
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-5 hidden md:flex"
      aria-label="Social links"
    >
      {/* LinkedIn */}
      <a
        href={siteConfig.socials.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn profile"
        className="text-neutral-offwhite hover:text-neutral-white transition-colors duration-200"
      >
        <LinkedInIcon />
      </a>

      {/* GitHub */}
      <a
        href={siteConfig.socials.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub profile"
        className="text-neutral-offwhite hover:text-neutral-white transition-colors duration-200"
      >
        <GitHubIcon />
      </a>

      {/* Resume/CV */}
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Resume"
        className="text-neutral-offwhite hover:text-neutral-white transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-[22px]">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      </a>

      {/* Instagram (Duplicate) */}
      <a
        href={siteConfig.socials.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram profile"
        className="text-neutral-offwhite hover:text-neutral-white transition-colors duration-200 hover:scale-110"
      >
        <InstagramIcon />
      </a>

      {/* Gmail / Email */}
      <a
        href={`mailto:${siteConfig.email}`}
        aria-label="Send Email"
        className="text-neutral-offwhite hover:text-neutral-white transition-colors duration-200 hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-[22px]">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </a>
    </aside>
  );
};

export default FloatingSidebar;
