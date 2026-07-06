export const siteConfig = {
  name: "Ronald Airon S. Torres",
  shortName: "Airon Torres",
  logo: "AIRON TORRES",
  subtitle: "Software & Web Developer",
  discipline: "FULL-STACK DEVELOPMENT",
  email: "torresairon44@gmail.com",
  phone: "+63 930 009 2838",
  location: "Manila, Philippines",
  copyright: "© 2026 Ronald Airon S. Torres",
  socials: {
    linkedin: "https://linkedin.com/in/airontorres",
    github: "https://github.com/torresairon44-hue",
    twitter: "https://twitter.com/airontorres",
    instagram: "https://instagram.com/airontorres",
  },
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const stats = [
  { value: "10+", label: "Projects Completed" },
  { value: "4", label: "Certifications" },
  { value: "3+", label: "Years Learning" },
  { value: "2nd", label: "UI/UX Competition" },
];

export const timeline = [
  {
    period: "2022 – Present",
    title: "BSIT Student",
    description:
      "Pursuing a Bachelor of Science in Information Technology at EARIST Manila. Focused on software engineering, web development, database management, and UI/UX design.",
  },
  {
    period: "2024 – 2025",
    title: "Academic Projects",
    description:
      "Built full-stack systems including cinema booking, barangay management, and subdivision reservation platforms using modern web technologies.",
  },
  {
    period: "2025 – 2026",
    title: "Capstone & OJT",
    description:
      "Developing HappyHomes capstone project while seeking OJT opportunities in web development, software projects, and UI/UX work.",
  },
];

export const certificates = [
  {
    title: "ServiceNow",
    issuer: "ServiceNow",
    year: "2026",
    imageSrc: "/images/ServiceNow.jpg",
    type: "Certification",
  },
  {
    title: "Security & Privacy",
    issuer: "Online Course",
    year: "2026",
    imageSrc: "/images/SecurityPrivacy.jpg",
    type: "Certification",
  },
  {
    title: "Project Management",
    issuer: "Online Course",
    year: "2026",
    imageSrc: "/images/ProjectManagement.jpg",
    type: "Certification",
  },
  {
    title: "Generative AI",
    issuer: "Online Course",
    year: "2026",
    imageSrc: "/images/GenerativeAI.jpg",
    type: "Certification",
  },
  {
    title: "UI/UX Certificate",
    issuer: "EARIST Manila",
    year: "2025",
    imageSrc: "/images/uicert.png",
    type: "Award",
  },
  {
    title: "Technical Certificate",
    issuer: "EARIST Manila",
    year: "2025",
    imageSrc: "/images/technical.png",
    type: "Award",
  },
  {
    title: "Technical Certificate II",
    issuer: "EARIST Manila",
    year: "2025",
    imageSrc: "/images/technical1.png",
    type: "Award",
  },
];

export const techStack = [
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "MongoDB",
  "HTML5",
  "CSS3",
  "Tailwind CSS",
  "Bootstrap",
  "Git",
  "Python",
  "Figma",
  "Canva",
  "VS Code",
  "Linux",
  "Vercel",
];

export const services = [
  "Web Development",
  "UI/UX Design",
  "Frontend Development",
  "Full-stack Applications",
  "Database Management",
  "Responsive Design",
];

export interface Project {
  title: string;
  description: string;
  imageSrc: string;
  tag?: string;
  year: string;
  role: string;
  liveUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    title: "HappyHomes",
    description:
      "Subdivision management and reservation system. Property listings, booking management, and admin dashboard for community operations.",
    imageSrc: "/images/happyhomes-1.png",
    tag: "Capstone Project",
    year: "2025–2026",
    role: "Full-stack Developer",
  },
  {
    title: "Cinema System",
    description:
      "Cinema reservation and booking system with admin dashboard. Seat selection, showtime scheduling, and real-time availability.",
    imageSrc: "/images/cinema-1.png",
    year: "2024–2025",
    role: "Developer",
  },
  {
    title: "Barangay System",
    description:
      "Records, certificate, and services management for barangay operations. Document requests and resident records.",
    imageSrc: "/images/barangay-1.png",
    year: "2025–2026",
    role: "Developer",
  },
  {
    title: "AgriAssist",
    description:
      "Agriculture assistant for monitoring and supporting Filipino farmers. Crop tracking and resource management.",
    imageSrc: "/images/android-1.png",
    tag: "UI/UX + Web",
    year: "2023–2024",
    role: "Developer / Designer",
  },
  {
    title: "UI/UX Design",
    description:
      "UI/UX design projects and prototypes created in Figma. Covers user research, wireframing, and high-fidelity mockups for web and mobile applications.",
    imageSrc: "/images/uiux-1.png",
    tag: "UI/UX",
    year: "2023–2025",
    role: "UI/UX Designer",
  },
];

export const features = [
  { title: "Responsive", description: "Mobile-first designs that work on any device" },
  { title: "Accessible", description: "WCAG-compliant interfaces for all users" },
  { title: "Performant", description: "Optimized loading and smooth interactions" },
  { title: "Modern Stack", description: "Built with the latest frameworks and tools" },
];

export const skills = [
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "MongoDB",
  "HTML5",
  "CSS3",
  "Bootstrap",
  "Git",
  "Python",
  "Figma",
  "Canva",
  "Tailwind CSS",
  "UI/UX Design",
];

export const aboutContent = {
  headline:
    "I am an aspiring Software & Web Developer and UI/UX Enthusiast based in Manila.",
  description:
    "I am a motivated BSIT student at EARIST Manila seeking an On-the-Job Training (OJT) opportunity. I have foundational knowledge in software development, web technologies, and UI/UX design, combined with strong documentation, research, and creative design skills. I'm a self-driven learner with hands-on academic project experience, a strong work ethic, and adaptability. Currently exploring React, Next.js, and modern web development practices.",
};

export const achievements = [
  "2nd Place – UI/UX Design Competition",
  "Designed UI and Website Layouts for Academic Projects",
  "Created Multimedia & Short Film School Outputs",
  "Self-studied Programming Beyond Coursework",
];

export const certifications = [
  "ServiceNow",
  "Security & Privacy",
  "Project Management",
  "Generative AI",
];
