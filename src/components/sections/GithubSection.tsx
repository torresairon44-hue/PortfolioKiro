"use client";

import { cn } from "@/lib/cn";
import { GithubCalendar } from "@/components/ui/GithubCalendar";
import { siteConfig } from "@/lib/constants";

interface GithubSectionProps {
  className?: string;
}

const GithubSection = ({ className }: GithubSectionProps) => {
  const githubUsername = siteConfig.socials.github.replace("https://github.com/", "").replace(/\/$/, "");

  return (
    <section
      aria-label="GitHub contributions"
      className={cn("px-6 md:px-12 lg:px-[108px] py-24 flex flex-col items-center gap-8 bg-transparent", className)}
    >
      <div className="flex w-full max-w-[1100px] flex-col gap-3 text-left md:text-center">
        <span className="font-nav text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-dark-gray">
          GitHub activity
        </span>
        <h2 className="font-display text-[44px] md:text-[60px] leading-none text-neutral-white">
          Contribution history
        </h2>
        <p className="font-body text-[15px] text-neutral-offwhite max-w-[560px] leading-relaxed md:mx-auto">
          A GitHub-style view of commits and contribution streaks, kept compact and easy to scan.
        </p>
      </div>

      <div className="w-full max-w-[1100px] rounded-[24px] border border-[#30363d] bg-[#161b22] px-4 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:px-6 md:py-6 overflow-x-auto">
        <div className="min-w-[340px]">
          <GithubCalendar
            username={githubUsername}
            cellSize={13}
            cellGap={3}
            cellShape="rounded"
            showMonthLabels
            showStats
            showLegend
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default GithubSection;
