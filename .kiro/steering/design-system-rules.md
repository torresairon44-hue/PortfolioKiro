---
inclusion: auto
---

# Kiroverse Developer Portfolio — Design System Rules

## Overview

This document defines the design system extracted from the "Kiroverse Developer Portfolio (Airon)" Figma file. All implementations must follow these tokens, patterns, and rules to ensure visual parity with the design.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4

---

## 1. Design Tokens

### Colors

```typescript
// Design Token Colors
const colors = {
  // Neutrals
  neutral: {
    black: "#0A0A0A",       // Primary background, button text
    darkGray: "#484848",    // Borders, dividers
    offwhite: "#C7C7C7",    // Body text, secondary text
    white: "#FFFFFF",       // Headings, primary text
  },
  // Surfaces
  surface: {
    dark: "#1A1A1A",        // Cards, form inputs background
    darker: "#222222",      // Icon button backgrounds
  },
  // Accent
  accent: {
    purple: "#C3B1FF",      // Primary CTA buttons, links
  },
};
```

### Typography

| Token Name       | Font Family  | Weight     | Size  | Line Height | Letter Spacing | Usage                |
|-----------------|-------------|-----------|-------|-------------|----------------|----------------------|
| `heading/one`   | Bebas Neue  | 400       | 101px | 0.9         | 0              | Hero heading         |
| `heading/two`   | Bebas Neue  | 400       | 76px  | 1.0         | 0              | Section headings     |
| `heading/three` | Manrope     | 500 (Med) | 32px  | 1.4         | 0              | Project titles       |
| `heading/five`  | Manrope     | 600 (Semi)| 16px  | 1.5         | 0              | Labels, sub-headings |
| `body/medium`   | Manrope     | 400       | 18px  | 1.5         | 0              | Body text            |
| `body/small`    | Manrope     | 500 (Med) | 16px  | 1.6         | 0              | Metadata, footer     |
| `misc/button`   | Manrope     | 700 (Bold)| 16px  | 1.0         | 0              | Button labels        |
| `misc/link`     | Manrope     | 700 (Bold)| 16px  | 1.5         | 0              | Text links           |
| `misc/pill`     | Manrope     | 700 (Bold)| 16px  | 1.0         | 0              | Skill chips          |
| `misc/tag`      | Manrope     | 500 (Med) | 14px  | 1.5         | 0              | Card tags            |
| `nav/logo`      | Bebas Neue  | 400       | 32px  | 1.5         | -0.32px        | Logo / brand name    |
| `nav/link`      | Inter       | 500 (Med) | 16px  | 1.5         | -0.48px        | Navigation links     |

### Spacing Scale

| Token | Value | Usage                                         |
|-------|-------|-----------------------------------------------|
| `xs`  | 4px   | Underline gaps, micro spacing                 |
| `sm`  | 8px   | Text gaps, form label-to-input gaps           |
| `md`  | 12px  | Button icon spacing, input padding-y          |
| `lg`  | 16px  | Content gaps, input padding-x, card tag pad   |
| `xl`  | 24px  | Nav spacing, section gaps, social icons gap   |
| `2xl` | 32px  | Project info gap, skills description gap      |
| `3xl` | 40px  | Hero content gaps, form group gaps            |
| `4xl` | 48px  | Project card-to-content gap                   |
| `5xl` | 60px  | Nav horizontal padding                        |
| `6xl` | 80px  | Section vertical padding                      |
| `7xl` | 108px | Page horizontal margin (desktop)              |

### Border Radius

| Token  | Value | Usage                                    |
|--------|-------|------------------------------------------|
| `sm`   | 4px   | Form inputs                              |
| `md`   | 12px  | Project cards, card images               |
| `full` | 100px | Buttons, pills, tags, icon buttons       |

### Shadows / Elevation

The design uses a flat, minimal aesthetic — no drop shadows. Depth is created through:
- Background color contrast (surface-dark on neutral-black)
- Border treatment (1px border with dark-gray)
- Layering via z-index for overlapping elements

---

## 2. Reusable Component Definitions

### Navbar

- Full width, height 96px
- Horizontal padding: 60px
- Vertical padding: 24px
- Flex row, justify-between, items-center
- Logo: Bebas Neue 32px, offwhite, tracking-tight
- Nav links: Inter Medium 16px, offwhite, gap-32, tracking-tight
- Links: Home, Projects, About, Contact

### Hero Section

- Two-column layout on desktop (text left, image right)
- Left column max-width: 544px
- Heading: Bebas Neue 101px, white, line-height 0.9
- Subheading: Manrope 18px, offwhite, line-height 1.5
- Gap between heading group and actions: 40px
- Actions: flex, gap-16
  - Primary CTA button + icon buttons (LinkedIn, GitHub)
- Profile image: 525×700px, rounded-md (12px)

### Button Variants

**Primary (CTA with icon):**
- Background: accent-purple (#C3B1FF)
- Text: neutral-black, Manrope Bold 16px, uppercase
- Padding: pl-24 pr-6 py-20
- Border-radius: full (100px)
- Height: 54px
- Contains circle arrow icon (42px) on right

**Secondary (Submit):**
- Background: accent-purple (#C3B1FF)
- Text: neutral-black, Manrope Bold 16px, uppercase
- Padding: px-40 py-20
- Border-radius: full (100px)
- Height: 54px

**Icon Button:**
- Background: surface-darker (#222222)
- Size: 54×54px
- Border-radius: full
- Icon: 26×26px, centered

### Project Card

- Flex row, gap-48, items-center
- Image area: 600×600px, bg surface-dark, rounded-md, overflow-hidden
  - Inner image: rounded-md, border-2 border-black
  - Tag badge: absolute top-16 left-16, bg neutral-black, rounded-full, px-16 py-8
  - Tag text: Manrope Medium 14px, white
- Content area: flex-1, flex-col, gap-48
  - Title: Manrope Medium 32px, white
  - Description: Manrope 18px, offwhite, gap-16 below title
  - Metadata section: gap-32 from description
    - "Project Info" label: Manrope SemiBold 16px, white, uppercase
    - Rows: border-t border-dark-gray, py-16, flex justify-between
    - Row label: Manrope Medium 16px, white
    - Row value: Manrope Medium 16px, offwhite
  - Links: gap-24, accent-purple, Manrope Bold 16px, uppercase, underlined

### Skill Chip

- Border: 1px solid dark-gray (#484848)
- Text: white, Manrope Bold 16px, uppercase
- Padding: px-40 py-20
- Border-radius: full (100px)
- Container: flex-wrap with gap-16

### Contact Form

- Two-column layout, gap-24, py-80
- Left column:
  - Heading: Bebas Neue 76px, white
  - Email: "Say hello at" (offwhite) + email (white, underlined)
  - Social icons: flex, gap-24, 32px icons
  - Copyright: Manrope Medium 16px, offwhite (at bottom)
- Right column — Form:
  - Fields stacked with gap-24
  - Each field: label + input with gap-8
  - Label: Manrope Medium 16px, offwhite
  - Input: bg surface-dark (#1A1A1A), rounded-sm (4px), px-16 py-12
  - Input text: Manrope 18px, white
  - Message field: same style but taller (multi-line)
  - Submit button: primary secondary variant

### Footer

- Integrated into Contact section left column
- Copyright: "© 2026 Your Name"
- Positioned at bottom of left column via justify-between

---

## 3. Layout Rules

### Page Container
- Max width: 1440px
- Content horizontal padding: 108px (desktop)
- Background: neutral-black (#0A0A0A)
- Full-page dark theme

### Section Dividers
- 1px horizontal line spanning full page width
- Separates: Hero | Projects | About | Contact

### Grid Patterns
- **Projects:** 600px fixed image + flex-1 content, gap-48
- **Skills/Experience/Contact:** Two equal columns (flex-1 + flex-1), gap-24
- **Hero:** Left text (544px max) + right image, overlapping header area
- **About (home):** Left heading + right content columns

### Section Spacing
- Vertical padding: 80px top and bottom per section
- Project-to-project gap: 120px (720px offset between 600px cards)
- Content-to-header gap: 80px within sections

---

## 4. Responsive Rules

### Breakpoints (mobile-first)

| Breakpoint | Width  | Layout Changes                          |
|-----------|--------|------------------------------------------|
| default   | <640px | Single column, stacked, reduced padding  |
| `sm`      | 640px  | Minor spacing adjustments                |
| `md`      | 768px  | Two-column for contact, tablet nav       |
| `lg`      | 1024px | Full two-column layouts, horizontal nav  |
| `xl`      | 1280px | Full content width                       |
| `2xl`     | 1440px | Max container width reached              |

### Mobile Adaptations

```
Mobile (default):
- Single column for all sections
- Hero heading: ~48px
- Section headings: ~40px
- Horizontal padding: 24px
- Project cards: stacked (image top, content below)
- Navigation: hamburger/mobile menu
- Contact form: full width
- Skill chips: flex-wrap, full width

Tablet (md: 768px):
- Two-column for contact section
- Horizontal padding: 48px
- Project cards: may begin side-by-side

Desktop (lg: 1024px+):
- Full two-column layouts
- Hero with side image
- Horizontal padding: 108px
- Horizontal navigation links
```

### Responsive Typography

```
heading-1: 48px → 72px (md) → 101px (lg)
heading-2: 40px → 56px (md) → 76px (lg)
heading-3: 24px → 28px (md) → 32px (lg)
body-md:   16px → 18px (md+)
```

---

## 5. Accessibility Rules

- IMPORTANT: All interactive elements must have visible focus states (accent-purple outline, 2px offset)
- IMPORTANT: Color contrast meets WCAG AA — offwhite (#C7C7C7) on black (#0A0A0A) = 12.6:1
- Use semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- All images require descriptive `alt` text; decorative images use `alt=""`
- Form inputs must have associated `<label>` elements (not just placeholders)
- Navigation uses `<nav>` with `aria-label="Main navigation"`
- Use `aria-current="page"` for active nav link
- Social links include `aria-label` (e.g., "LinkedIn profile")
- Skip-to-content link for keyboard navigation
- Ensure keyboard accessibility for all interactive elements
- Use `prefers-reduced-motion` to disable/reduce animations
- Form validation errors use `aria-describedby`
- Project cards use `<article>` with heading hierarchy

---

## 6. Implementation Rules

### Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts, metadata
│   ├── page.tsx            # Home page composition
│   ├── about/page.tsx      # About page
│   └── globals.css         # Tailwind CSS 4 theme + base styles
├── components/
│   ├── ui/                 # Atomic/reusable components
│   │   ├── Button.tsx
│   │   ├── IconButton.tsx
│   │   ├── SkillChip.tsx
│   │   ├── TextLink.tsx
│   │   └── FormInput.tsx
│   ├── sections/           # Page-level sections
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── Footer.tsx
│   └── icons/              # SVG icon components
├── lib/
│   └── constants.ts        # Site data/content
└── styles/
    └── fonts.ts            # Next.js font configuration
```

### Tailwind CSS 4 Theme (globals.css)

```css
@import "tailwindcss";

@theme {
  --color-neutral-black: #0A0A0A;
  --color-neutral-dark-gray: #484848;
  --color-neutral-offwhite: #C7C7C7;
  --color-neutral-white: #FFFFFF;
  --color-surface-dark: #1A1A1A;
  --color-surface-darker: #222222;
  --color-accent-purple: #C3B1FF;

  --font-display: "Bebas Neue", sans-serif;
  --font-body: "Manrope", sans-serif;
  --font-nav: "Inter", sans-serif;

  --radius-sm: 4px;
  --radius-md: 12px;
  --radius-full: 100px;
}
```

### Font Setup

```typescript
// src/styles/fonts.ts
import { Bebas_Neue, Manrope, Inter } from "next/font/google";

export const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-nav",
});
```

### Code Conventions

- IMPORTANT: Never hardcode color hex values — always use Tailwind design tokens
- IMPORTANT: All components accept a `className` prop for composition
- Use TypeScript interfaces for all component props
- Prefer `const` arrow function components
- Use Next.js `<Image>` for all images (with width/height or fill)
- Use Next.js `<Link>` for internal navigation
- Separate content data from components into `lib/constants.ts`
- Use `clsx` or `cn()` utility for conditional class merging
- Server components by default; `"use client"` only when interactivity needed
- Form components use `"use client"` with React 19 form actions where possible

### Naming Conventions

- Components: PascalCase (e.g., `ProjectCard.tsx`)
- Props interfaces: `ComponentNameProps` (e.g., `ProjectCardProps`)
- CSS token classes: kebab-case (e.g., `text-neutral-offwhite`)
- Files: PascalCase for components, camelCase for utilities

### Performance

- Use `next/image` with proper dimensions and `priority` for hero image
- Lazy load below-fold images with `loading="lazy"`
- Keep sections as server components where possible
- Minimize client JavaScript — only forms and interactive nav need client
- Use `next/font` for zero-layout-shift font loading

### Animation Guidelines

- Subtle CSS transitions only (200–300ms ease)
- Hover effects: color transitions, slight scale (1.02), underline reveals
- Respect `prefers-reduced-motion: reduce`
- No heavy JS animation libraries needed for this design
