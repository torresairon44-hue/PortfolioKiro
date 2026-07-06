interface TwitterIconProps {
  className?: string;
}

const TwitterIcon = ({ className = "size-[26px]" }: TwitterIconProps) => (
  <svg
    className={className}
    viewBox="0 0 26 26"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M19.8217 2.4375H23.2775L15.5667 11.3125L24.6458 23.5625H17.5175L11.9017 16.2338L5.46667 23.5625H2.00917L10.2483 14.0833L1.54333 2.4375H8.85333L13.9425 9.14875L19.8217 2.4375ZM18.5708 21.4188H20.5667L7.66833 4.4825H5.53083L18.5708 21.4188Z" />
  </svg>
);

export default TwitterIcon;
