import { cn } from "@/lib/cn";

interface SectionDividerProps {
  className?: string;
}

const SectionDivider = ({ className }: SectionDividerProps) => {
  return (
    <hr
      className={cn("border-t border-neutral-dark-gray w-full", className)}
      aria-hidden="true"
    />
  );
};

export default SectionDivider;
