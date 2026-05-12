# CLAUDE.md — John Edeh Portfolio (Full-Stack)

This file is the source of truth for the Claude Code agent building this portfolio. Read it fully before writing a single line of code. Follow every instruction precisely. Do not ask clarifying questions — all decisions are made here and in ARCHITECTURE.md.

---

## WHO THIS IS FOR

**John Chinonso Edeh** — Full-Stack & DevOps Engineer, Lagos, Nigeria.
- Email: netojaycee@gmail.com
- GitHub: https://github.com/netojaycee
- LinkedIn: https://linkedin.com/in/jc-edeh
- Domain: johnedeh.dev

John builds and ships entire SaaS platforms AND manages the infrastructure they run on. The portfolio must sell both identities equally — not frontend-first, not DevOps-only.

---

## WHAT YOU ARE BUILDING

A full-stack portfolio website with:
1. A **public-facing portfolio** — hero, about, projects, skills, experience, contact
2. An **admin panel** at `/admin` — password-protected, allows John to manage all content (projects with multiple images, skills, experience entries)
3. A **PostgreSQL database** via Neon DB — all content is dynamic, nothing hardcoded in components
4. **Server Actions** for all mutations (create, update, delete, reorder)
5. **API route** only for Cloudinary upload signature (one exception — client-side upload requires it)

This is a production-grade full-stack application. It demonstrates John's engineering depth, not just design taste.

---

## TECH STACK

```
Framework:        Next.js 16 (App Router, React 19)
Language:         TypeScript (strict mode, no `any`)
Styling:          Tailwind CSS v4 (CSS-first config)
ORM:              Prisma 7
Database:         Neon DB (PostgreSQL, serverless)
Auth:             NextAuth.js v5 (credentials provider, single admin user)
Images:           Cloudinary (client-side upload widget, URL saved to DB)
Animations:       Framer Motion
Icons:            Lucide React
Fonts:            next/font/google — Syne, Lora, JetBrains Mono
Theme:            next-themes (dark default, no flash)
Carousel:         embla-carousel-react (project image gallery)
Markdown:         react-markdown (render case study text)
Package manager:  pnpm
Deployment:       Vercel
```

---

## CRITICAL VERSION NOTES

### Tailwind CSS v4
- NO `tailwind.config.ts` file — v4 is CSS-first
- `globals.css` starts with `@import "tailwindcss";`
- All design tokens go inside `@theme { }` block in globals.css
- Dark mode: use `@variant dark` in CSS or `dark:` prefix in JSX — configure via `@custom-variant dark (&:where(.dark, .dark *));` in globals.css
- No plugin config — utilities just work

### Prisma 7
- Packages: `prisma@latest @prisma/client@latest @prisma/adapter-neon@latest`
- Also install: `@neondatabase/serverless ws`
- Use driver adapter pattern in `lib/prisma.ts` (see ARCHITECTURE.md)
- `prisma generate` then `prisma db push` then `prisma db seed`

### Next.js 16 / React 19
- Server Actions: `"use server"` at top of file or top of function
- Use `useActionState` from `react` (NOT deprecated `useFormState`)
- Use `useFormStatus` from `react-dom` for pending states in submit buttons
- Server Components by default — `"use client"` only when needed (event handlers, hooks, browser APIs)
- Images: `next/image` always. Fonts: `next/font/google` always.

### NextAuth v5
- Package: `next-auth@beta`
- Config in `src/lib/auth.ts` — export `{ handlers, auth, signIn, signOut }`
- Route: `src/app/api/auth/[...nextauth]/route.ts` — export `{ GET, POST } = handlers`
- Session check in Server Components: `const session = await auth()`
- Credentials provider with bcrypt password hash stored in env

---

## PROJECT STRUCTURE

```
portfolio/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                        # Public home — all sections
│   │   ├── globals.css                     # Tailwind v4 @import + @theme tokens
│   │   ├── actions/
│   │   │   ├── project.actions.ts
│   │   │   ├── skill.actions.ts
│   │   │   └── experience.actions.ts
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   └── cloudinary/signature/route.ts
│   │   ├── admin/
│   │   │   ├── layout.tsx                  # Auth guard — redirect if no session
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx                    # Dashboard with stats
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx                # Projects list + reorder
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx           # Edit project
│   │   │   ├── skills/page.tsx
│   │   │   └── experience/page.tsx
│   │   └── projects/[slug]/page.tsx        # Public case study page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Experience.tsx
│   │   │   └── Contact.tsx
│   │   ├── ui/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ImageGallery.tsx            # embla-carousel-react
│   │   │   ├── CloudinaryUpload.tsx        # "use client" — Cloudinary widget
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   └── StatusBadge.tsx
│   │   └── admin/
│   │       ├── AdminSidebar.tsx
│   │       ├── ProjectForm.tsx
│   │       ├── ImageManager.tsx
│   │       ├── SkillsManager.tsx
│   │       └── ExperienceForm.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── cloudinary.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── .env.example
├── CLAUDE.md
├── ARCHITECTURE.md
├── package.json
└── next.config.ts
```

---

## HOW DATA FLOWS

**Public site (read):**
Server Component → Prisma query → renders HTML → no loading states, no client fetch, fully SEO-indexed.

**Admin mutations (write):**
Form `action={serverAction}` → Server Action validates → Prisma writes → `revalidatePath()` → redirect or return result. Client uses `useActionState` for feedback.

**Image uploads:**
Client clicks upload → requests signature from `/api/cloudinary/signature` → Cloudinary widget uploads directly to Cloudinary → returns `secure_url` → hidden input captures URL → saved to DB via Server Action on form submit.

This keeps file uploads off the Next.js server while keeping auth and DB writes server-side.

---

## AESTHETIC DIRECTION

**Core identity:** Dark/light mode. Dark is default. The design feels like infrastructure tooling built by someone with real taste — not a generic "developer portfolio template."

**Dark mode palette (CSS variables in @theme):**
```css
--color-bg: #0a0a0f;
--color-surface: #111118;
--color-surface-2: #16161f;
--color-border: #1e1e2e;
--color-accent: #f97316;        /* electric orange */
--color-accent-hover: #fb923c;
--color-text: #e2e8f0;
--color-muted: #64748b;
--color-dim: #94a3b8;
```

**Light mode palette:**
```css
--color-bg: #fafaf8;
--color-surface: #ffffff;
--color-surface-2: #f4f4f0;
--color-border: #e5e5e0;
--color-text: #0f172a;
--color-muted: #64748b;
--color-dim: #475569;
/* accent stays orange in both modes */
```

**Typography:**
- `Syne` — headings and display text. Bold, geometric, memorable.
- `Lora` — body text. Editorial serif. Not generic.
- `JetBrains Mono` — stack badges, labels, code, terminal elements.

**Motion principles:**
- Page load: staggered fade-up for hero elements (0.1s delay increments)
- Scroll: sections fade-up when entering viewport (Framer Motion `whileInView`)
- Cards: `whileHover={{ y: -4 }}` with orange left border transition
- Terminal: typewriter effect using `useState` + `useEffect` interval
- Theme toggle: smooth colour transition via CSS `transition: background 0.3s, color 0.3s`

**Hero background:** Subtle dot-grid using CSS `radial-gradient` repeating pattern — dark mode only. Fades to solid at bottom.

**DO NOT:** Use Inter, Roboto, system fonts, purple gradients, white card grids, or any pattern that looks like a Vercel template or Tailwind UI component.

---

## SECTIONS SPEC

### Navbar
- `position: fixed`, `backdrop-blur-md`, border-bottom
- Logo: "JE" in orange + "John Edeh" in Syne
- Links: scroll to section IDs
- ThemeToggle: sun/moon icon, smooth swap
- Mobile: hamburger → slide-down or overlay menu
- Highlight active section on scroll with IntersectionObserver

### Hero
- `min-h-screen`, flex, two columns (desktop), stacked (mobile)
- Left: typewriter heading, tagline, sub-tagline, two CTA buttons
- Right: animated terminal window card
  - Dark card, monospace font, orange prompt `$`
  - Lines appear one by one with typing animation
  - Loops after completing sequence
- Background: dot-grid radial pattern (dark only)
- Typewriter cycles: "Full-Stack Engineer" | "DevOps Engineer" | "SaaS Builder" | "Infrastructure Engineer"

### About
- Two columns: story paragraph left, stat cards right
- Stats animate count-up on scroll into view
- Stats: 5+ Years · 6+ Projects · 1M+ Monthly Users · 4 Cloud Platforms

### Projects
- DB query: published projects ordered by `order` field, with images and stack
- Featured project → full-width hero card at top (shows hero image)
- Rest → 2-col grid (1-col mobile)
- Each card: hero image (first in images array), name, tagline, stack badges (first 5), status dot, two link buttons
- Hover: lift + accent left border

### Project Case Study `/projects/[slug]`
- Full project from DB with all images, stack, highlights, caseStudy text
- Top: ImageGallery (embla carousel, all images, dot pagination)
- Below: name, tagline, links, status badge
- Stack tags full list
- Highlights as styled list
- Case study text via `react-markdown` with custom typography styles
- Back to home button

### Skills
- DB: all categories with skills, ordered
- Each category: card with Lucide icon, title, description, skill chips
- Chip variants by level: `expert` = orange filled, `proficient` = blue outline, `familiar` = grey outline
- Staggered card reveal on scroll

### Experience
- DB: all experience entries ordered
- Vertical timeline with central line
- Each entry: animated dot, role, company+location, period, bullets
- Current role: pulsing green dot

### Contact
- Static — no DB
- Headline + subtext
- Three buttons: Email (copy to clipboard + toast), LinkedIn, GitHub
- Minimal, clean

---

## ADMIN PANEL SPEC

### Login `/admin/login`
- Simple centered card form
- Email + password fields
- `signIn('credentials', { email, password, redirectTo: '/admin' })`
- Error message on failed login

### Dashboard `/admin`
- 4 stat cards: Total Projects, Published, Skills, Experience entries
- Quick nav links to each section

### Projects List `/admin/projects`
- Table: thumbnail, name, status badge, published toggle, edit/delete
- Published toggle calls `togglePublished` Server Action inline
- Delete: confirm dialog before calling `deleteProject`
- Drag-to-reorder rows (use `@dnd-kit/core` + `@dnd-kit/sortable`)
- "New Project" button top right

### Project Form `/admin/projects/new` and `/admin/projects/[id]`
Fields (all in one form, submitted via Server Action):
- Name → auto-slugifies (editable)
- Tagline (short, one line)
- Description (2–3 sentences, textarea)
- Live URL, GitHub URL (optional)
- Status: select — live / in-development / private
- Category: select — saas / marketplace / ecommerce / management / devops
- Featured: checkbox
- Published: checkbox
- Stack items: dynamic list — each item has `name` text + `category` select (frontend/backend/devops/database/infra). Add/remove rows.
- Highlights: dynamic list of text inputs. Add/remove rows.
- Case study: large textarea (markdown). Label says "Supports markdown."
- Images: `ImageManager` component — upload via Cloudinary, shows uploaded images as thumbnails, drag to reorder, click to delete. First image = hero image.

### Skills `/admin/skills`
- Accordion list of categories
- Each category: edit name/icon/description, delete category, add/remove skills
- Each skill: name + level select (expert/proficient/familiar) + delete
- Add new category button at bottom
- All changes via Server Actions with optimistic UI where possible

### Experience `/admin/experience`
- List of entries (ordered)
- Each entry: inline expand to edit form or navigate to edit page
- Fields: role, company, location, period, current (boolean checkbox), bullets (dynamic list), tags (dynamic list)
- Drag-to-reorder

---

## SERVER ACTIONS PATTERN

```typescript
// src/app/actions/project.actions.ts
"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Guard every mutation
async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function createProject(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  try {
    // parse formData, write to DB
    revalidatePath("/");
    revalidatePath("/admin/projects");
    redirect("/admin/projects");
  } catch (e) {
    return { success: false, error: "Failed to create project" };
  }
}
```

---

## ENVIRONMENT VARIABLES

Create `.env.example` (no real values):

```env
# Neon DB
DATABASE_URL=postgresql://...

# NextAuth v5
BETTER_AUTH_SECRET=
AUTH_URL=http://localhost:3000

# Admin user (single user — store hash, not plain password)
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

## COMMANDS

```bash
pnpm install
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed
pnpm dev
pnpm build
pnpm tsc --noEmit
```

---

## AGENT RULES

1. **Build the entire application** — public site, admin panel, DB schema, seed, Server Actions. Do not stop mid-way or ask for confirmation between sections.
2. **No `any` in TypeScript** — strict mode throughout. Derive types from Prisma where possible using `Prisma.ProjectGetPayload<{...}>`.
3. **Tailwind v4 CSS-first** — no tailwind.config.ts. Tokens in `globals.css` @theme block.
4. **Prisma 7 with Neon adapter** — use `@prisma/adapter-neon`. See lib/prisma.ts pattern in ARCHITECTURE.md.
5. **Server Actions for all mutations** — never `fetch('/api/...')` for CRUD operations.
6. **Seed file populates everything** — `prisma/seed.ts` inserts all of John's projects, skills, experience from ARCHITECTURE.md. Running `pnpm prisma db seed` must give a complete, populated site.
7. **Mobile-first responsive** — every component works at 375px. No horizontal scroll anywhere.
8. **No hardcoded content in components** — all user-visible strings come from DB (seeded) or static copy defined in ARCHITECTURE.md only.
9. **Dark mode default, no flash** — `defaultTheme="dark"` + `suppressHydrationWarning` on `<html>`.
10. **Framer Motion everywhere** — scroll reveals, hover states, staggered grids, hero animations.
11. **embla-carousel-react** for image gallery on project case study pages.
12. **@dnd-kit** for drag-to-reorder in admin panel (projects list, image manager, skills).
13. **Run `pnpm build` at end** — fix all type errors before stopping. Zero build warnings is the goal.
14. **Create `.env.example`** only. Never create `.env.local` or `.env` with real values.
15. **Admin auth guard** — every `/admin/*` route (except `/admin/login`) must check session server-side and redirect to `/admin/login` if absent.