import { cn } from "@/lib/cn";
import { ArrowIcon, GitHubIcon } from "@/components/icons";

interface TextLinkProps {
  children: React.ReactNode;
  href: string;
  variant?: "arrow" | "github";
  className?: string;
}

const TextLink = ({ children, href, variant = "arrow", className }: TextLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex flex-col gap-1 items-start",
        className
      )}
    >
      <span className="flex items-center gap-1 font-body font-bold text-[16px] leading-[1.5] text-accent-red uppercase">
        {children}
        {variant === "arrow" && <ArrowIcon className="size-6 text-accent-red" />}
        {variant === "github" && <GitHubIcon className="size-[26px] text-accent-red" />}
      </span>
      <span className="block w-full h-[2px] bg-accent-gold transition-transform duration-200 origin-left group-hover:scale-x-110" />
    </a>
  );
};

export default TextLink;
