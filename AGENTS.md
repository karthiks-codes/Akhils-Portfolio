# Akhil Portfolio - Codex Build Instructions

## Mission

Build a complete, production-ready personal developer portfolio for **Akhil Karthik Boddupalli** in this repository. The result must feel like a premium, carefully art-directed product: dark, restrained, technically credible, recruiter-friendly, and distinctly personal.

This file is the primary build prompt. Before changing or generating application code, read `docs/PORTFOLIO_CONTEXT.md` completely and inspect every file under `public/assets/`. Treat the context document as the source of truth for identity, copy, project scope, classifications, statuses, credentials, contact details, visual direction, and no-invention rules.

Do not ask again for assets or information that already exists in this repository. Missing project screenshots, demos, URLs, papers, or implementation evidence must not block the initial build. Omit unavailable controls/resources cleanly and keep the data model ready for them later.

## Working Mode

1. Inspect the repository and preserve all supplied files.
2. If the React application has not been initialized, create it in this repository root without deleting `AGENTS.md`, `docs/`, or `public/assets/`.
3. Make an implementation plan, then execute it to completion.
4. Use current stable, mutually compatible dependency versions and commit the lockfile.
5. Do not invent project outcomes, metrics, employment, credentials, links, screenshots, or implemented TripShield features.
6. Ask the user only for choices or credentials that materially block an external action. The local build, tests, and production-ready integrations must work without live cloud credentials.
7. Do not create or deploy paid cloud resources without explicit user authorization.

## Required Stack

- Next.js App Router with React and TypeScript.
- `pnpm` for package management.
- Tailwind CSS for the design system and responsive styling.
- Motion for React, imported from `motion/react`, for purposeful micro-interactions, layout transitions, and scroll reveals.
- Radix UI primitives only where accessible behavior is useful, such as dialogs, tooltips, tabs, and dropdowns. Restyle every primitive; do not ship a generic component-library appearance.
- `cmdk` for the approved command-palette Easter egg.
- Lucide React for interface icons. Do not use emoji as interface icons.
- Zod for environment and request validation.
- React Hook Form where client-side form state materially improves usability.
- Resend for contact and project-suggestion email delivery.
- Official MongoDB Node.js driver with MongoDB Atlas for server-side submission storage.
- Cloudflare Turnstile plus server-side rate limiting/honeypot protection for public forms.
- Cloudflare R2 through the S3-compatible API for optional production asset storage.
- Vercel as the recommended Next.js hosting and rendering platform.
- Vitest and React Testing Library for unit/component tests.
- Playwright, including accessibility checks, for critical end-to-end flows.

Avoid adding a CMS, authentication system, state-management framework, 3D engine, charting library, or animation library beyond Motion unless the implemented experience demonstrates a concrete need.

## Content and Storage Architecture

Keep portfolio content in typed local data modules or MDX so the public pages render even when MongoDB or external services are unavailable. Do not put basic identity, education, skills, projects, certifications, or navigation content in MongoDB.

Use MongoDB only for dynamic submissions:

- `contact_submissions`
- `project_suggestions`

Each record must have a generated ID, validated fields, `createdAt`, delivery status, and only the minimum metadata required for abuse prevention and troubleshooting. Do not store raw secrets. Do not store raw visitor IP addresses; if an abuse-control identifier is needed, derive a server-side one-way hash with a secret salt. Do not configure automatic deletion/TTL until a retention policy is explicitly selected.

The website must remain fully browseable if `MONGODB_URI` is absent. Development must never pretend a submission succeeded when delivery/storage is not configured; return and display a clear configuration-safe error.

## Asset Strategy

`public/assets/` is the canonical local source during development and the guaranteed fallback in production.

- Use `next/image` for raster images where appropriate.
- Preserve the supplied PDFs exactly; never rewrite credential proofs.
- Use the real supplied portrait. Do not generate or substitute a person.
- Do not fabricate project screenshots.
- Missing project media should produce a strong typography-led/CSS-led card, not a fake screenshot or broken placeholder.
- Create a typed asset manifest so components do not scatter literal paths.
- Add an optional, idempotent R2 upload/sync script that preserves the relative object keys under `assets/`.
- Resolve asset URLs through one helper: local `/assets/...` by default and `${NEXT_PUBLIC_ASSET_BASE_URL}/assets/...` when a production CDN/R2 base URL is configured.
- Keep R2 credentials server-only. Never expose access keys through `NEXT_PUBLIC_*` variables.

## Visual Direction

The visual identity is **Dark Developer x Apple**.

Required qualities:

- near-black, graphite, charcoal, dark gray, off-white, and muted gray surfaces;
- one restrained cool accent selected and documented in design tokens;
- excellent spacing, editorial hierarchy, crisp borders, deliberate typography, and premium cropping;
- a modern developer-workspace character without imitating a terminal or security dashboard;
- refined depth through contrast, subtle gradients, soft shadows, noise or grid texture only when extremely restrained;
- responsive layouts that feel designed independently for mobile, tablet, and desktop;
- custom focus states and excellent keyboard navigation.

Explicitly avoid:

- cyberpunk, hacker, cybersecurity-dashboard, gaming, or terminal-cosplay aesthetics;
- neon overload, loud gradients, excessive glow, glassmorphism templates, particles, or unnecessary 3D;
- skill percentage bars, star ratings, or fabricated proficiency meters;
- a generic uniform card grid for every section;
- copying the reference site's branding, code, visual theme, personal data, or assets.

Use `https://www.satvik.live/` only as an information-architecture/depth reference as specified in the source context. The implemented visual identity must be original.

## Animation Direction

Animation must clarify hierarchy and interaction, not decorate every element.

- Use Motion for the hero reveal, navigation state, project filtering, shared card/detail transitions, restrained section entrances, and button/card feedback.
- Prefer opacity, transform, clip/mask, and layout animations that remain performant.
- Respect `prefers-reduced-motion` globally and provide reduced or removed alternatives.
- Pause nonessential motion when the page is not visible.
- Do not artificially delay loading. The approved initialization screen may appear only during genuine application/critical-asset initialization.
- Avoid scroll hijacking and avoid applying smooth scrolling globally.

## Information Architecture

Implement these routes:

- `/`
- `/projects`
- `/projects/[slug]` for all seven approved projects
- `/certifications`
- `/github`
- `/contact`
- a polished not-found route

Homepage section order:

1. Hero
2. About
3. Education
4. Certifications
5. Leadership
6. Technical Skills
7. Tools / Frameworks
8. Featured Projects
9. Works in Progress
10. View All Projects
11. GitHub preview
12. Contact
13. Footer

Use an Apple-like floating navigation bar. GitHub must not be in the main navigation; expose it through social links, projects, footer, preview, and the dedicated route.

## Exact Portfolio Rules

- Use exactly the seven projects listed in `docs/PORTFOLIO_CONTEXT.md`.
- Featured projects are exactly SmartSkin, Personalized News Recommendation System, and NeuroTrace.
- Works in progress are exactly TripShield, Job Automation, and Technical Portfolio Website.
- Use exactly these project filters: `All`, `AI / ML`, `Full Stack`, `Cloud & DevOps`, `Automation`, `Vibe Coding`, and `Research`.
- Do not add an `In Development` filter.
- Omit Professional Experience and Achievements sections from the website.
- Present Certifications and Digital Badges as visibly separate groups. Never label a badge as a certification.
- Leadership must list the two distinct Design-a-thon 2K25 roles: `Documentation Lead` and `Accommodation Coordinator`.
- Show the phone number publicly as confirmed in the context.
- Availability copy is exactly: `I'm open to opportunities.`
- Treat TripShield proposal material as proposed/planned unless the context explicitly proves implementation.
- Do not surface empty GitHub/demo/document buttons. Render only confirmed links.

## Project Experience

Project cards must feel dense and discoverable without becoming dashboards. Include status, approved categories, concise description, technology labels, and confirmed resource links. Filtering must be keyboard accessible and use animated layout transitions.

Each project detail page should support:

- summary and status;
- approved categories and technologies;
- problem/context and implementation information actually supported by evidence;
- architecture/pipeline when supplied;
- confirmed resources only;
- related projects;
- a project-specific suggestion form only when the project is ongoing.

Do not display fake metrics. For NeuroTrace, preserve the GNN-driven attention wording and result limitations in the source context.

## Forms, Email, and Security

Implement contact and ongoing-project suggestion forms as validated server-side endpoints or Server Actions.

Contact submission must:

- validate and normalize input with Zod;
- apply honeypot, Turnstile, length limits, and rate limiting;
- store the minimal record in MongoDB when configured;
- send Akhil a notification through Resend;
- send the approved acknowledgment email after successful delivery;
- expose no API keys or private connection strings to the browser;
- return safe, helpful errors without leaking provider details.

Suggestion submissions must exist only inside ongoing projects and include the canonical project slug/name in the validated server payload. They use the same secured delivery pipeline as contact messages.

Add a privacy-minded consent note near forms. Do not claim a privacy policy that does not exist.

## SEO, Accessibility, and Performance

- Implement route metadata, canonical URLs, Open Graph/Twitter metadata, JSON-LD Person/ProfilePage data, sitemap, and robots configuration.
- Use semantic landmarks and heading order.
- Ensure complete keyboard operation and visible focus.
- Meet WCAG AA contrast and support reduced motion.
- Optimize fonts, portrait loading, route bundles, and remote asset behavior.
- Avoid hydration-only content for primary portfolio information.
- Target strong Lighthouse performance, accessibility, best-practices, and SEO results; never hide defects to improve a score.

## Recommended Source Layout

```text
src/
  app/
  components/
    layout/
    sections/
    projects/
    credentials/
    forms/
    ui/
  content/
  data/
  lib/
    assets/
    email/
    mongodb/
    security/
    validation/
  styles/
  types/
scripts/
public/assets/
docs/
```

Prefer Server Components. Add `use client` only for real interaction or animation boundaries. Keep provider wrappers narrow.

## Environment and Deployment

Use `.env.example` as the environment contract. Validate server configuration without requiring every optional service during a normal static build.

The production recommendation is:

- Vercel for Next.js hosting, server rendering, route handlers, and preview deployments;
- Cloudflare R2 behind a public/custom asset domain for resume, credential proofs, badge images, and future project media;
- MongoDB Atlas for submission persistence;
- Resend for email delivery;
- Cloudflare Turnstile for bot protection.

Implement deployment-ready configuration but do not create provider accounts, buckets, databases, DNS records, or deployments unless the user explicitly authorizes those external actions and supplies/links the required accounts.

## Completion Requirements

The task is complete only when:

- all required routes and sections are implemented;
- supplied portrait, resume, certificates, badges, and proof PDFs are connected correctly;
- responsive behavior is manually checked at mobile, tablet, laptop, and wide desktop widths;
- keyboard navigation and reduced-motion behavior are verified;
- empty/missing project resources are handled elegantly;
- form success and failure paths are tested with provider adapters mocked where necessary;
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass;
- critical Playwright journeys pass;
- no placeholder tokens, fake links, invented facts, broken assets, console errors, or TypeScript errors remain;
- `README.md` documents local setup, environment variables, content editing, asset syncing, testing, and deployment;
- a final implementation summary lists completed work, commands run, remaining external setup, and any information still intentionally omitted.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
