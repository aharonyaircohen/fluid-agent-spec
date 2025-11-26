# Minimal Digital-Fluid Interface v2 – Gold Accent Design System

## Role

You are a senior frontend engineer working in a **Next.js + Payload CMS** monorepo, using **TypeScript** and **TailwindCSS**. Your task is to **implement and wire the updated "Minimal Digital-Fluid Interface v2" design system with gold accents** across the app shell and content surfaces.

The implementation must respect the constraints and palette rules below. You already have a basic v1 palette (ocean/aqua/violet/neutral-d) defined somewhere in the project; here you will formalize it into CSS variables, extend it with gold accents, and enforce usage across components and post content.

## Tech context

* Framework: Next.js (App Router)
* Styling: TailwindCSS + CSS Modules / component-level CSS files
* CMS: Payload (content delivered as JSON / rich text rendered in React)
* Design intent: **Minimal Digital-Fluid Interface** – dark, ocean-based, fluid gradients, sharp geometry, high contrast.

## High-level visual principles

1. Deep, layered atmosphere built from ocean gradients and digital-style surfaces.
2. Fluid motion cues with **restrained** animations – no flashy, distracting effects.
3. High-contrast text on dark surfaces for clarity and reading comfort.
4. Geometric, grid-based structure with generous spacing – calm but sharp.
5. **Color roles:**

   * Aqua/violet: actions, interactive states, info accents.
   * Gold: meaning-based accents and fine highlights only.

## Color system – CSS variables

Define all palette entries as CSS custom properties under `:root` in `globals.css`. **No component CSS may use hex literals; only these variables.**

### Variable families

Use these exact variable names (you may add more shades if needed, but keep the naming pattern):

* Ocean (dark bases, backgrounds, deep panels)

  * `--ocean-900`
  * `--ocean-800`
  * `--ocean-700`
  * `--ocean-600`
  * `--ocean-500`

* Aqua (actions, primary highlights, focus states)

  * `--aqua-400`
  * `--aqua-300`
  * `--aqua-200`

* Violet (geometric / informational micro-accents)

  * `--violet-400`
  * `--violet-300`

* Neutral-D (dark neutrals for text, borders, subtle surfaces)

  * `--neutral-d-50`
  * `--neutral-d-100`
  * `--neutral-d-200`
  * `--neutral-d-400`
  * `--neutral-d-600`
  * `--neutral-d-700`
  * `--neutral-d-800`
  * `--neutral-d-900`

* Gold – warm meaning accents (NEW)

  * `--gold-500` – base rich gold (implementation uses `#E8B46A`)
  * `--gold-400` – lighter gold (implementation uses `#F2C98B`)
  * `--gold-300` – soft highlight gold (implementation uses `#FFDFAE`)

* Surfaces / special

  * `--surface-glow-1`
  * `--surface-glow-2`
  * `--surface-border-soft`

### :root implementation (example)

In `globals.css`, under `:root`, define all palette variables **once**, with hex values only there:

```css
:root {
  /* Ocean */
  --ocean-900: #020617; /* example; reuse/adjust from v1 */
  --ocean-800: #02091f;
  --ocean-700: #071427;
  --ocean-600: #0b1b33;
  --ocean-500: #102544;

  /* Aqua */
  --aqua-400: #22d3ee;
  --aqua-300: #38e8ff;
  --aqua-200: #a5f3ff;

  /* Violet */
  --violet-400: #a855f7;
  --violet-300: #c4a0ff;

  /* Neutral-D */
  --neutral-d-50: #f9fafb;
  --neutral-d-100: #e5e7eb;
  --neutral-d-200: #cbd5f5;
  --neutral-d-400: #9ca3af;
  --neutral-d-600: #4b5563;
  --neutral-d-700: #374151;
  --neutral-d-800: #1f2933;
  --neutral-d-900: #020617;

  /* Gold accents */
  --gold-500: #E8B46A;
  --gold-400: #F2C98B;
  --gold-300: #FFDFAE;

  /* Surfaces / glows */
  --surface-glow-1: color-mix(in srgb, var(--aqua-300) 12%, transparent);
  --surface-glow-2: color-mix(in srgb, var(--violet-300) 8%, transparent);
  --surface-border-soft: color-mix(in srgb, var(--neutral-d-700) 60%, transparent);
}
```

**Important:**

* Only `:root` is allowed to contain hex literals.
* All other CSS files must reference these variables via `var(--token-name)`.

## Typography system

### Fonts

* Hebrew + body: `Heebo`, fallback `system-ui`, `-apple-system`, `sans-serif`.
* Digital / English headings: `Space Grotesk`, fallback `system-ui`, `sans-serif`.

Define font variables in `:root` and apply them globally:

```css
:root {
  --font-body: "Heebo", system-ui, -apple-system, sans-serif;
  --font-heading: "Space Grotesk", system-ui, -apple-system, sans-serif;
}

html,
body {
  font-family: var(--font-body);
  color: var(--neutral-d-100);
  background: radial-gradient(circle at top left, var(--ocean-700), var(--ocean-900));
}
```

### Heading rules (global and post content)

**Hard requirement:** All headings (global and inside post content, `h1–h6`) must use the gold accent color `var(--gold-300)`.

Implement this in `globals.css` using element selectors and a `.post-content` scope:

```css
h1,
h2,
h3,
h4,
h5,
h6,
.post-content h1,
.post-content h2,
.post-content h3,
.post-content h4,
.post-content h5,
.post-content h6 {
  font-family: var(--font-heading);
  color: var(--gold-300);
}
```

For sizes and weights, use Tailwind via `@apply` inside a `@layer base` block or component CSS modules:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 { @apply text-4xl md:text-5xl font-semibold tracking-tight; }
  h2 { @apply text-3xl md:text-4xl font-semibold; }
  h3 { @apply text-2xl font-semibold; }
}

.body-text {
  @apply text-base leading-relaxed;
  color: var(--neutral-d-200);
}

.micro-label {
  @apply text-xs uppercase tracking-wide;
  color: var(--gold-300);
}
```

Component-level CSS files must use these font and color rules.

## Layout structure

Create a consistent shell and section layout using a combination of Tailwind utilities via `@apply` and palette variables. **Every component that implements styling must use its own CSS file.**

### Shell

* `.app-shell`

  * Full-viewport background using palette-based gradient.
  * Centers main content container.

* `.page-container`

  * Max width: `1120px`.
  * Horizontal padding.
  * Vertical spacing between sections: `2.5–4rem`.

Example in `AppShell.css`:

```css
.app-shell {
  min-height: 100vh;
  background-image: radial-gradient(circle at top left, var(--ocean-700), var(--ocean-900));
  color: var(--neutral-d-100);
}

.page-container {
  @apply mx-auto px-4 sm:px-6 lg:px-8;
  max-width: 1120px;
}

.section-block {
  @apply py-10 md:py-14;
  border-bottom: 1px solid color-mix(in srgb, var(--neutral-d-800) 70%, transparent);
}
```

## Header and footer

### Header

File: `Header.css`

* Dark translucent background.
* Bottom border using `var(--surface-border-soft)`.

```css
.header-root {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(16px);
  background: color-mix(in srgb, var(--ocean-900) 80%, transparent);
  border-bottom: 1px solid var(--surface-border-soft);
}
```

### Footer

File: `Footer.css`

* Top divider uses gold accent at low opacity.
* Version tag uses `var(--gold-300)` with reduced opacity.

```css
.footer-root {
  border-top: 1px solid color-mix(in srgb, var(--gold-300) 20%, transparent);
  background: linear-gradient(to top, color-mix(in srgb, var(--ocean-900) 90%, transparent), var(--ocean-800));
}

.footer-version {
  @apply text-xs;
  color: color-mix(in srgb, var(--gold-300) 80%, transparent);
}
```

## Section patterns

### Hero section

File: `HeroSection.css`

Requirements:

* Background: gradient surface using palette variables.
* Vertical gold accent line on desktop.
* Optional micro-label in top-right using `var(--gold-300)`.
* Layout: 1 column (mobile), 2 columns (desktop).

```css
.hero-root {
  background: radial-gradient(circle at top left, var(--surface-glow-1), var(--ocean-900));
  border-radius: 1.5rem;
  border: 1px solid var(--surface-border-soft);
  position: relative;
}

.hero-content {
  @apply grid gap-8;
}

@media (min-width: 768px) {
  .hero-content {
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  }
}

.hero-gold-line {
  position: absolute;
  right: 0;
  top: 1.5rem;
  bottom: 1.5rem;
  width: 1px;
  background: linear-gradient(to bottom,
    color-mix(in srgb, var(--gold-300) 15%, transparent),
    color-mix(in srgb, var(--gold-500) 25%, transparent)
  );
}

.hero-micro-label {
  @apply text-xs uppercase tracking-wide;
  color: var(--gold-300);
}
```

### Vision cards

File: `VisionSection.css`

* Cards: `bg-ocean-800/60`, soft border.
* Icon geometry uses gold accent.
* Bullet markers use translucent gold.

```css
.vision-card {
  background: color-mix(in srgb, var(--ocean-800) 60%, transparent);
  border-radius: 1rem;
  border: 1px solid var(--surface-border-soft);
}

.vision-icon {
  color: var(--gold-400);
}

.vision-bullet-marker {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--gold-400) 40%, transparent);
}
```

## Content elements (posts, markdown, rich text)

You must ensure that **links, blockquotes, tables, code blocks, images, dividers, and list text content all use palette variables**. This includes content rendered from Payload.

Create a scoped class `.post-content` (or similar) and style raw HTML elements inside it in `globals.css` or in a dedicated `PostContent.css` that the post detail page imports.

### Links

```css
.post-content a {
  color: var(--aqua-300);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--aqua-300) 40%, transparent);
}

.post-content a:hover {
  color: var(--aqua-200);
  border-bottom-color: var(--aqua-200);
}
```

### Blockquotes

```css
.post-content blockquote {
  border-left: 2px solid color-mix(in srgb, var(--gold-300) 50%, transparent);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: var(--neutral-d-100);
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--surface-glow-2) 40%, transparent),
    transparent
  );
}
```

### Tables

```css
.post-content table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--surface-border-soft);
  background: color-mix(in srgb, var(--ocean-900) 80%, var(--ocean-800));
}

.post-content th,
.post-content td {
  border: 1px solid var(--surface-border-soft);
  padding: 0.5rem 0.75rem;
  color: var(--neutral-d-100);
}

.post-content th {
  background: color-mix(in srgb, var(--ocean-700) 70%, transparent);
  color: var(--gold-300);
}
```

### Code blocks

```css
.post-content pre {
  background: radial-gradient(circle at top left, var(--surface-glow-1), var(--ocean-900));
  border-radius: 0.75rem;
  border: 1px solid var(--surface-border-soft);
  padding: 1rem 1.25rem;
  color: var(--aqua-200);
}

.post-content code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
```

### Images

```css
.post-content img {
  display: block;
  max-width: 100%;
  border-radius: 1rem;
  border: 1px solid var(--surface-border-soft);
  background: radial-gradient(circle at center, var(--surface-glow-2), transparent);
}
```

### Lists and dividers

```css
.post-content ul,
.post-content ol {
  padding-left: 1.5rem;
  color: var(--neutral-d-100);
}

.post-content li::marker {
  color: var(--gold-300);
}

.post-content hr {
  border: 0;
  border-top: 1px solid color-mix(in srgb, var(--gold-300) 20%, transparent);
  margin: 2rem 0;
}
```

## Component-specific CSS rule

**Requirement:** Every component that implements styling must have its own CSS file. Example: `PostDetailPage.tsx` must import `PostDetailPage.css`.

In each CSS file:

* Use Tailwind via `@apply` for spacing, layout, and typography.
* Use palette variables via `var(--token)` for colors, borders, backgrounds, and glows.
* Do **not** include any hex literals.

```css
.post-detail-root {
  @apply max-w-3xl mx-auto py-12 md:py-16;
}

.post-detail-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--surface-border-soft);
  padding-bottom: 1.25rem;
}

.post-detail-title {
  @apply text-3xl md:text-4xl font-semibold tracking-tight;
  color: var(--gold-300);
}

.post-detail-meta {
  @apply text-sm;
  color: var(--neutral-d-400);
}

.post-detail-body {
  margin-top: 2rem;
}
```

## Animations and interactions

### General rules

* Hover glow uses aqua tones.
* Entrance animations: `fade-in-up` for sections.
* Gradient motion: `fluid-gradient` only on large hero/panel surfaces.
* **Gold accents must never animate** – they stay still, serving as anchors for meaning.

In `globals.css` or `Animations.css`:

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
}

@keyframes fluid-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.fluid-gradient-bg {
  background: linear-gradient(120deg,
    color-mix(in srgb, var(--ocean-800) 70%, var(--surface-glow-1)),
    color-mix(in srgb, var(--ocean-900) 80%, var(--surface-glow-2))
  );
  background-size: 200% 200%;
  animation: fluid-gradient 18s ease-in-out infinite;
}

.hover-glow-aqua:hover {
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--aqua-300) 60%, transparent),
              0 18px 45px color-mix(in srgb, var(--aqua-400) 35%, transparent);
}
```

## Accessibility

* Maintain high contrast: light neutrals on ocean backgrounds.
* Gold accents are for headings, labels, and micro-elements – **not** for long body text.
* Focus indicators must stay in the aqua family for clarity.

Example:

```css
:focus-visible {
  outline: 2px solid var(--aqua-300);
  outline-offset: 3px;
}
```

## Hard constraints (must)

You must follow these strictly:

1. **All colors must come from the design-system palette variables in `:root`:**

   * `--ocean-*`, `--aqua-*`, `--violet-*`, `--gold-*`, `--neutral-d-*`, `--surface-glow-*`.
   * No hard-coded color literals (hex, rgb, hsl) in any component CSS.

2. **All headings (global and post content `h1–h6`) use the gold accent `var(--gold-300)`, including nested elements.**

3. **Every component that implements styling must have its implementation in its own CSS file.**

   * Example: `PostDetailPage.tsx` → `PostDetailPage.css`.

4. **Custom gradients and surfaces must reference the palette variables** (and `color-mix` with them) for backgrounds, glows, and panels. No standalone literal colors.

5. **All links, blockquotes, tables, code blocks, images, dividers, and list text content must use palette variables for color, borders, and backgrounds, even in posts.**

6. **App/root backgrounds and section blocks must use palette-based gradients.**

   * No plain hex background colors; always built from palette variables.

7. **Palette variables live only in `:root` (in `globals.css`) and must be used in all component CSS via `var(--token)`.**

   * No redefining these variables per component.

## Implementation checklist

1. Add the full palette to `:root` in `globals.css` (including gold and surface vars).
2. Set global `html, body` background and base typography using palette variables.
3. Implement heading rules (`h1–h6` and `.post-content h1–h6`) with `var(--gold-300)` and Tailwind size via `@apply`.
4. Create `AppShell.css`, `Header.css`, `Footer.css`, `HeroSection.css`, `VisionSection.css`, etc., and wire them into their respective components.
5. Implement `.post-content` styles for links, blockquotes, tables, code, images, lists, and dividers using only palette variables.
6. Add animation keyframes for `fade-in-up` and `fluid-gradient` and utility classes to use them.
7. Enforce aqua-based focus styles (`:focus-visible`).
8. Scan the codebase to remove any remaining hex literals from component CSS and migrate them to palette variables.

## Deliverable

A fully wired design system where:

* The app shell, sections, and content surfaces all use the ocean/aqua/violet palette with subtle gold accents.
* All colors and gradients are built from the `:root` palette variables.
* Headings consistently use gold accents.
* Component styling is encapsulated per file and uses Tailwind for structure + CSS variables for visual skin.
* Post content (from Payload) renders with the same visual language as the core UI.
