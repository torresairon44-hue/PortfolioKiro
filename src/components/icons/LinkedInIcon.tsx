interface LinkedInIconProps {
  className?: string;
}

const LinkedInIcon = ({ className = "size-[26px]" }: LinkedInIconProps) => (
  <svg
    className={className}
    viewBox="0 0 26 26"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M5.95833 3.25C5.95833 4.26252 5.12919 5.08333 4.10417 5.08333C3.07914 5.08333 2.25 4.26252 2.25 3.25C2.25 2.23748 3.07914 1.41667 4.10417 1.41667C5.12919 1.41667 5.95833 2.23748 5.95833 3.25ZM6 6.91667H2.16667V23.8333H6V6.91667ZM14.0833 6.91667H10.2717V23.8333H14.0842V15.08C14.0842 10.2892 20.2542 9.90667 20.2542 15.08V23.8333H24.0833V13.6717C24.0833 6.5 15.8742 6.7725 14.0833 10.2917V6.91667Z" />
  </svg>
);

export default LinkedInIcon;
