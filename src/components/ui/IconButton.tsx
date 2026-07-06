import { cn } from "@/lib/cn";

interface IconButtonProps {
  children: React.ReactNode;
  href: string;
  ariaLabel: string;
  className?: string;
}

const IconButton = ({ children, href, ariaLabel, className }: IconButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "flex items-center justify-center size-[54px] rounded-full bg-surface-darker text-neutral-offwhite transition-colors duration-200 hover:bg-neutral-dark-gray hover:text-neutral-white",
        className
      )}
    >
      {children}
    </a>
  );
};

export default IconButton;
