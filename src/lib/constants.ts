export const siteConfig = {
  name: "Ronald Airon S. Torres",
  shortName: "Airon Torres",
  logo: "AIRON TORRES",
  subtitle: "Software & Web Developer",
  discipline: "FULL-STACK DEVELOPMENT",
  // Split to prevent bot scraping — reassembled at runtime in components
  email: ["torresairon44", "gmail.com"].join("@"),
  phone: ["+63", "930", "009", "2838"].join(" "),
  location: "Manila, Philippines",
  copyright: "© 2026 Ronald Airon S. Torres",
  socials: {
    linkedin: "https://www.linkedin.com/in/airon-torres-6639813a9?originalSubdomain=ph",
    github: "https://github.com/torresairon44-hue",
    twitter: "https://twitter.com/airontorres",
    instagram: "https://www.instagram.com/aiixx.jpg",
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
  {
    title: "Web Development",
    subtitle: "Turning traditional workflows into modern digital solutions.",
    description: "I began my journey mastering the core fundamentals of HTML5, CSS3, and JavaScript, but quickly realized the immense potential of modern web frameworks. Driven by the vision of transforming traditional business processes into sleek digital platforms, I expanded my technical toolkit to include React, Vite, Node.js, and Django, enabling me to build efficient, scalable web applications."
  },
  {
    title: "UI/UX Design",
    subtitle: "Where creativity meets functional, user-centric interfaces.",
    description: "Blending a developer’s logic with a passion for creative visuals allows me to design interfaces that are both beautiful and highly intuitive. My creative approach earned me 2nd place in a campus UI/UX Design Competition, a mindset I consistently bring to life in complex interactive platforms, such as my Cinema Management System."
  },
  {
    title: "Frontend Development",
    subtitle: "Crafting rich, interactive interfaces and seamless digital experiences.",
    description: "Frontend development is where I love to bring static ideas to life. During my internship at OpenCI, I took on the high-impact responsibility of redesigning the user interface for their AI chatbot platform. I specialize in bridging the gap between sophisticated software logic and a clean, pixel-perfect user experience."
  },
  {
    title: "Full-stack Applications",
    subtitle: "End-to-end development from database architecture to AI integration.",
    description: "While my core passion thrives on the frontend, I possess versatile, cross-functional capabilities across the entire software stack. I have experience building backends, working with APIs, and integrating Large Language Models (LLMs). Additionally, I incorporate Quality Assurance (QA) and security best practices to ensure applications are reliable and secure."
  },
  {
    title: "Database Management",
    subtitle: "Managing data environments with modern, flexible architectures.",
    description: "A robust application requires a solid data foundation. I have practical experience working across a variety of relational database systems and environments—including MySQL, SQLite, and pgAdmin4—while managing workflows via Docker. I also leverage modern backend-as-a-service platforms like Supabase to build rapid, efficient, and convenient data architectures."
  },
  {
    title: "Responsive Design",
    subtitle: "Creating fluid, highly engaging, and interactive web experiences.",
    description: "Responsive design is more than just making a website fit a mobile screen; it’s about crafting an immersive experience. I am actively diving deep into advanced motion and layout techniques, exploring interactive trends like scroll reveals and scroll hijacking. My goal is to master modern CSS and animation principles to build websites that feel alive on any device."
  }
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

// ── Globe data ─────────────────────────────────────────────────────────────
// Coordinates (lat, lng) mapped to each tech in the techStack array.
// Used by GlobeDemo to place markers on the 3D globe.
export const techLocations: [number, number][] = [
  [37.7595, -122.4367],  // San Francisco — JavaScript / React heartland
  [40.7128, -74.006],    // New York
  [35.6762, 139.6503],   // Tokyo
  [51.5074, -0.1278],    // London
  [-33.8688, 151.2093],  // Sydney
  [-33.9249, 18.4241],   // Cape Town
  [25.2048, 55.2708],    // Dubai
  [48.8566, 2.3522],     // Paris
  [-23.5505, -46.6333],  // São Paulo
  [52.52, 13.405],       // Berlin
  [19.076, 72.8777],     // Mumbai
  [1.3521, 103.8198],    // Singapore
  [34.0522, -118.2437],  // Los Angeles
  [55.7558, 37.6173],    // Moscow
  [14.5995, 120.9842],   // Manila
  [41.9028, 12.4964],    // Rome
];

// Arcs drawn between globe markers to show technology connections.
export const globeArcs = [
  {
    id: "javascript-react",
    from: [37.7595, -122.4367] as [number, number],
    to: [35.6762, 139.6503] as [number, number],
    label: "JavaScript → Next.js",
  },
  {
    id: "react-typescript",
    from: [40.7128, -74.006] as [number, number],
    to: [51.5074, -0.1278] as [number, number],
    label: "React → TypeScript",
  },
];

// ── Contact form ───────────────────────────────────────────────────────────
// Visme-hosted contact form embed URL.
// Change this value here if you switch form providers — no component edits needed.
export const contactFormUrl = "https://forms.visme.co/fv/p9nm70vw-q007qvd";

// ── External API endpoints ─────────────────────────────────────────────────
// Centralised here so switching API providers requires only one change.
export const GITHUB_CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";

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
