interface ArrowIconProps {
  className?: string;
}

const ArrowIcon = ({ className = "size-6" }: ArrowIconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M7 17L17 7" />
    <path d="M7 7H17V17" />
  </svg>
);

export default ArrowIcon;
