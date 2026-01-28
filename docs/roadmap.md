# 🗺️ Project Roadmap: Subprocess Hub

> **The Pitch:** A catalog of subprocesses. That's it. No AI. No blockchain. Just a catalog.
> **The Goal:** Browse like Netflix. Drop it in. Done.
> **The Infrastructure:** Zero Backend. GitHub is the database.

---

## 🛠 Technical Architecture

### Core Stack (Latest Versions)
* **Repo:** Monorepo (pnpm workspaces + Turborepo 2.x)
* **Framework:** Astro 5.0+ (Static Site Generation)
* **Language:** TypeScript 5.x (Strict Mode)
* **Styling:** Tailwind CSS 3.4+ (or v4 if stable)
* **Linting/Formatting:** Biome (Unified tool replacing ESLint/Prettier)
* **BPMN Engine:** `bpmn-js` (mature library for interactive view) + `bpmn-to-image` (puppeteer wrapper for build-time thumbnails)
* **Interactivity:** GitHub Discussions API (via Giscus)
* **Search:** Pagefind (Static indexing)

### Non-Functional Requirements (NFRs)
1.  **Super Fast:** Zero JS on listing pages. Pre-rendered SVGs.
2.  **SEO:** Sitemap, JSON-LD Schema, OpenGraph images.
3.  **A11y:** Keyboard navigation, proper ARIA labels for diagrams.
4.  **i18n:** English (default), German (de), Spanish (es).

---

## 📦 Part 1: Foundation & Monorepo Setup

**Objective:** Establish a strict, centralized development environment.

### Phase 1.1: Workspace Initialization
- [ ] **Init:** Run `pnpm init` and `git init`.
- [ ] **Workspace Config:** Create `pnpm-workspace.yaml`:
  ```yaml
  packages:
    - "apps/*"
    - "packages/*"
  ```
- [ ] **Turborepo:** Install `turbo` globally and at root. Create `turbo.json`.
  - [ ] Define pipeline: `build`, `dev`, `check`, `lint`, `format`.
  - [ ] Configure output caching (e.g., `dist/**`, `.astro/**`).

### Phase 1.2: Root Tooling (The "Control Tower")
*Strategy: All devDependencies live in the root `package.json` (`pnpm add -w -D`). Apps only contain runtime deps.*

- [ ] **Install Global Deps:**
  `pnpm add -w -D typescript @biomejs/biome astro @astrojs/check`
- [ ] **Biome Config:** Create `biome.json` at root.
  - [ ] Enable `linter`, `formatter`, `organizeImports`.
  - [ ] Set strict rules (no `any`, no unused vars).
- [ ] **TypeScript Config:** Create `tsconfig.json` at root.
  - [ ] `strict: true`
  - [ ] `verbatimModuleSyntax: true`
  - [ ] `skipLibCheck: true`
- [ ] **Root Scripts:** Add these EXACT commands to root `package.json` to check everything from the top level:
  - [ ] `"dev"`: `turbo run dev`
  - [ ] `"build"`: `turbo run build`
  - [ ] `"lint"`: `turbo run lint`
  - [ ] `"format"`: `turbo run format`
  - [ ] `"check"`: `turbo run check` (Runs `astro check` + `tsc`)
  - [ ] `"validate"`: `pnpm run lint && pnpm run format && pnpm run check && pnpm run build`

---

## 🎨 Part 2: Layout & Discovery Experience

**Objective:** "Find the right recipe in seconds."

### Phase 2.1: Navigation Architecture
- [ ] **Command Palette (Cmd+K):**
  - [ ] Implement a global search modal (e.g., using `kbar` or custom dialog).
  - [ ] Index: Process Titles, Tags, IDs.
- [ ] **Faceted Sidebar:**
  - [ ] Permanent left sidebar on desktop (collapsible on mobile).
  - [ ] **Facets:**
    - *Category:* Finance, HR, Tech.
    - *Complexity:* Green (Simple), Yellow (Moderate), Red (Complex).
    - *Elements:* "Contains User Task", "Contains Service Task".
- [ ] **The "Netflix" Grid:**
  - [ ] Main view displays cards with **Static SVG Previews** (not loaded JS engines).
  - [ ] Hover effects play a small CSS animation or show metadata.

### Phase 2.2: Design System
- [ ] **Tailwind Config:**
  - [ ] Define semantic colors: `bg-canvas`, `text-primary`, `border-muted`.
  - [ ] Typography: `Inter` (UI) + `JetBrains Mono` (Code).
- [ ] **Dark Mode:** Default to Dark Mode (Developer focus). Support system toggle.

---

## ⚡ Part 3: The BPMN Engine (Performance Core)

**Objective:** Render instantly. Do not ship 5MB of JS to the listing page.

### Phase 3.1: The Build-Time Converter
- [ ] **Tooling:** Install `bpmn-to-image` (Puppeteer wrapper) as a dev dependency.
- [ ] **Script:** Create a pre-build script (or Astro Integration).
  - [ ] **Input:** Scan `src/content/subprocesses/**/*.bpmn`.
  - [ ] **Process:** Convert every `.bpmn` file to an optimized `.svg` containing the diagram.
  - [ ] **Output:** Save SVGs to `public/previews/` or alongside content.
- [ ] **Usage:** Listing cards strictly load the SVG via `<img>`. **Zero JS overhead.**

### Phase 3.2: The Interactive Viewer (Detail Page)
- [ ] **Library:** Install `bpmn-js` (The mature standard by Camunda).
- [ ] **Wrapper:** Create a React component `<BPMNViewer />`.
  - [ ] **Hydration:** Use `client:only="react"` (BPMN-js relies on `window` and cannot SSR).
  - [ ] **Features:** Enable Zoom, Pan, Drag canvas.
  - [ ] **Read-Only:** Use `MapsdViewer` module (lighter weight than the Modeler).

---

## 📚 Part 4: Data Layer & Content

**Objective:** Structured data for SEO and maintainability.

### Phase 4.1: Content Collections
- [ ] **Schema:** Define Zod schema in `src/content/config.ts`:
  ```ts
  z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    complexity: z.enum(['low', 'mid', 'high']),
    author: z.string(), // GitHub Username
    discussionId: z.number().optional(), // For Comments mapping
    published: z.date(),
  })
  ```
- [ ] **Files:** Structure: `src/content/subprocesses/[locale]/[slug]/index.mdx` + `process.bpmn`.

### Phase 4.2: Internationalization (i18n)
- [ ] **Config:** Update `astro.config.mjs`:
  - [ ] `defaultLocale: "en"`, `locales: ["en", "de", "es"]`.
  - [ ] Strategy: `routing: { prefixDefaultLocale: false }`.
- [ ] **UI Strings:** Create `src/i18n/ui.ts` for interface translations (Search, Download, Likes).

---

## 🔗 Part 5: Interactivity (GitHub as Backend)

**Objective:** Social features without a database.

### Phase 5.1: Giscus Integration
- [ ] **Setup:** Enable Discussions on the GitHub repo. Install Giscus App.
- [ ] **Component:** Create `<Comments />` wrapper.
  - [ ] **Mapping:** Map URL pathname to Discussion.
  - [ ] **Reactions:** Enable "Top" reactions (serves as "Likes").
  - [ ] **Theme:** Sync with current Dark/Light mode automatically.

### Phase 5.2: User Actions
- [ ] **Download:** Button to download raw `.bpmn` XML.
- [ ] **Copy:** Button to copy XML to clipboard.
- [ ] **Edit:** "Edit on GitHub" link pointing to the source file for PRs.

---

## 🔎 Part 6: Search & SEO

**Objective:** Be discoverable on Google and internally.

### Phase 6.1: Search Engine
- [ ] **Pagefind:** Install `pagefind` (Static search library).
- [ ] **Build Step:** Update build command: `astro build && pagefind --site dist`.
- [ ] **UI:** Integrate Pagefind's default UI or custom API into the Command Palette.

### Phase 6.2: SEO & Meta
- [ ] **Sitemap:** Configure `@astrojs/sitemap`.
- [ ] **Metadata:** Use `astro-seo` for title templates and canonical URLs.
- [ ] **OG Images:** Auto-generate social cards using the process title + BPMN SVG overlay.

---

## ✅ Day 1: Action Items Checklist

- [ ] **Repo:** Run `pnpm init` & setup `pnpm-workspace.yaml`.
- [ ] **Turbo:** Setup `turbo.json` pipeline with caching.
- [ ] **Scripts:** Add `validate`, `lint`, `format` scripts to root `package.json`.
- [ ] **App:** `npm create astro@latest apps/web`.
- [ ] **Quality:** Setup `biome.json` (strict) & `tsconfig.json`.
- [ ] **Content:** Add one dummy BPMN file to `src/content/`.
- [ ] **Viewer:** Create the `<BPMNViewer />` React component.
- [ ] **Preview:** Write the script to convert BPMN -> SVG.
