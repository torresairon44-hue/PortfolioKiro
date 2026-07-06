import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/constants";

interface BrandHeaderProps {
  className?: string;
}

const BrandHeader = ({ className }: BrandHeaderProps) => {
  return (
    <header
      className={cn(
        "w-full flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-12 lg:px-[60px] py-6",
        className
      )}
    >
      {/* Left — Logo + Subtitle */}
      <div className="flex flex-col">
        <span className="font-display text-[28px] md:text-[32px] leading-[1.2] text-neutral-white">
          {siteConfig.logo}
        </span>
        <span className="font-body font-light text-[13px] tracking-[1px] text-neutral-offwhite uppercase">
          {siteConfig.subtitle}
        </span>
      </div>

      {/* Right — Discipline */}
      <span className="font-nav font-medium text-[11px] tracking-[2px] text-neutral-dark-gray uppercase mt-2 md:mt-0">
        {siteConfig.discipline}
      </span>
    </header>
  );
};

export default BrandHeader;
