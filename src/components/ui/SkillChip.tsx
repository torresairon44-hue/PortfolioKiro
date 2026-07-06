import { cn } from "@/lib/cn";

interface SkillChipProps {
  label: string;
  className?: string;
}

const SkillChip = ({ label, className }: SkillChipProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-10 py-5 border border-neutral-dark-gray rounded-[var(--radius-full)] font-body font-bold text-[16px] leading-none text-neutral-white uppercase",
        className
      )}
    >
      {label}
    </span>
  );
};

export default SkillChip;
