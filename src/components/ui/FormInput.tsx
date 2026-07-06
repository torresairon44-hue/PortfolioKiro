import { cn } from "@/lib/cn";

interface FormInputProps {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea";
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const FormInput = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  className,
}: FormInputProps) => {
  const inputStyles =
    "w-full bg-surface-dark rounded-[var(--radius-sm)] px-4 py-3 font-body font-normal text-[18px] leading-[1.5] text-neutral-white placeholder:text-neutral-dark-gray focus:outline-none focus:ring-2 focus:ring-accent-red";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={name}
        className="font-body font-medium text-[16px] leading-[1.6] text-neutral-offwhite"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          required={required}
          placeholder={placeholder}
          rows={5}
          className={cn(inputStyles, "resize-none")}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={inputStyles}
        />
      )}
    </div>
  );
};

export default FormInput;
