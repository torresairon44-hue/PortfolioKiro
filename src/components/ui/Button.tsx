import { cn } from "@/lib/cn";
import { ArrowIcon } from "@/components/icons";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  target?: string;
  rel?: string;
}

const Button = ({
  children,
  variant = "primary",
  href,
  className,
  type = "button",
  onClick,
  target,
  rel,
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center font-body font-bold text-[16px] leading-none uppercase rounded-[var(--radius-full)] h-[54px] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-accent-red text-neutral-white pl-6 pr-1.5 gap-3 hover:bg-accent-red/90",
    secondary:
      "bg-accent-gold text-neutral-black px-10 hover:bg-accent-gold/90",
  };

  const classes = cn(baseStyles, variantStyles[variant], className);

  const content = (
    <>
      <span>{children}</span>
      {variant === "primary" && (
        <span className="flex items-center justify-center size-[42px] rounded-full bg-neutral-black text-neutral-white">
          <ArrowIcon className="size-5" />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
};

export default Button;
