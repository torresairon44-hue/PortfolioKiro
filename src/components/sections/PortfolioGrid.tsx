"use client";

import { HeroParallax, type ParallaxProduct } from "@/components/ui/hero-parallax";
import { siteConfig } from "@/lib/constants";

/**
 * Seeded pseudo-random number generator (mulberry32).
 * Using a date-based seed means the shuffle is consistent within a single day
 * (SSR and client produce the same order — no hydration mismatch) but changes
 * every day so the grid looks fresh on each visit.
 */
function seededRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  const rand = seededRandom(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Returns a daily seed based on YYYYMMDD so SSR and client always agree. */
function getDailySeed(): number {
  const now = new Date();
  return (
    now.getFullYear() * 10000 +
    (now.getMonth() + 1) * 100 +
    now.getDate()
  );
}

/**
 * 5 projects × 3 images = exactly 15 cards (5 per row × 3 rows).
 * Both the project column order and the image-per-row assignment are shuffled
 * with a daily seed so the grid looks different on each new day.
 */
const buildProducts = (): ParallaxProduct[] => {
  const github = siteConfig.socials.github;
  const seed = getDailySeed();

  const projectData = [
    {
      title: "HappyHomes",
      link: `${github}/happyhomes`,
      tag: "Capstone Project",
      subtitles: ["Overview", "UI", "Dashboard"],
      images: [
        "/images/happyhomes-1.png",
        "/images/happyhomes-2.png",
        "/images/happyhomes-3.png",
      ],
    },
    {
      title: "Cinema System",
      link: `${github}/cinema-system`,
      tag: undefined,
      subtitles: ["Overview", "Booking", "Seats"],
      images: [
        "/images/cinema-1.png",
        "/images/cinema-2.png",
        "/images/cinema-3.png",
      ],
    },
    {
      title: "Barangay System",
      link: `${github}/barangay-system`,
      tag: undefined,
      subtitles: ["Overview", "Records", "Services"],
      images: [
        "/images/barangay-1.png",
        "/images/barangay-2.png",
        "/images/barangay-3.png",
      ],
    },
    {
      title: "AgriAssist",
      link: `${github}/agriassist`,
      tag: "UI/UX + Web",
      subtitles: ["Overview", "Tracking", "Mobile"],
      images: [
        "/images/android-1.png",
        "/images/android-2.png",
        "/images/android-3.png",
      ],
    },
    {
      title: "UI/UX Design",
      link: `${github}/uiux-design`,
      tag: "UI/UX",
      subtitles: ["Overview", "Wireframes", "Mockups"],
      images: [
        "/images/uiux-1.png",
        "/images/uiux-2.png",
        "/images/uiux-3.png",
      ],
    },
  ];

  // Shuffle the project column order daily
  const shuffledProjects = shuffleWithSeed(projectData, seed);

  // For each project, also shuffle which image appears in which row
  const cards: ParallaxProduct[] = [];
  for (let round = 0; round < 3; round++) {
    for (const proj of shuffledProjects) {
      // Shuffle the images array with a per-project seed offset so each
      // project gets an independent shuffle
      const imgSeed = seed + proj.title.charCodeAt(0);
      const shuffledImages = shuffleWithSeed(proj.images, imgSeed);
      const img = shuffledImages[round];
      const subtitle = proj.subtitles[round];
      cards.push({
        title: round === 0 ? proj.title : `${proj.title} — ${subtitle}`,
        link: proj.link,
        thumbnail: img,
        tag: round === 0 ? proj.tag : undefined,
      });
    }
  }

  return cards; // exactly 15
};

const PortfolioGrid = () => {
  const products = buildProducts();
  return (
    <section id="projects" aria-labelledby="portfolio-heading" className="relative z-20 bg-[radial-gradient(circle_at_center,#1A160E_0%,#0A0A0A_70%)]">
      <HeroParallax
        products={products}
        header={
          <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-6 md:px-12 lg:px-[108px] w-full">
            <span className="font-body font-medium text-[14px] uppercase tracking-[2px] text-accent-gold block mb-4">
              Portfolio
            </span>
            <h2
              id="portfolio-heading"
              className="font-display text-[40px] md:text-[72px] leading-none text-neutral-white"
            >
              Featured <br /> Projects
            </h2>
            <p className="max-w-2xl font-body text-base md:text-xl mt-8 text-neutral-offwhite leading-relaxed">
              A selection of academic and personal projects built with modern web
              technologies. Each card links directly to its GitHub repository.
            </p>
          </div>
        }
      />

    </section>
  );
};

export default PortfolioGrid;
