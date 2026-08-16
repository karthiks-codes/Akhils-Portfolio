# Akhil Karthik Boddupalli — Portfolio

A production-ready personal developer portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS and Motion. Content is factual, locally typed and fully browseable without cloud services. MongoDB Atlas, Resend, Cloudflare Turnstile and Cloudflare R2 are optional production integrations; form submissions return a clear error until the delivery credentials are configured.

## Local setup

Requirements:

- Node.js 20.9 or newer
- pnpm 10.x (the repository pins `pnpm@10.34.5`)

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

No environment variable is required to browse or build the portfolio. Forms intentionally do not report success until their production security and email settings are present.

## Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical production origin. Defaults to local development. |
| `NEXT_PUBLIC_ASSET_BASE_URL` | Public | Optional CDN origin. Asset paths remain under `/assets/...`. |
| `RESEND_API_KEY` | Server | Sends the owner notification and visitor acknowledgment. |
| `CONTACT_FROM_EMAIL` | Server | Verified Resend sender. |
| `CONTACT_TO_EMAIL` | Server | Notification recipient. Defaults to Akhil's confirmed email. |
| `MONGODB_URI` | Server | Optional Atlas persistence for dynamic submissions. |
| `MONGODB_DB_NAME` | Server | MongoDB database name. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Cloudflare Turnstile widget key. |
| `TURNSTILE_SECRET_KEY` | Server | Server-side Turnstile verification. |
| `SUBMISSION_HASH_SALT` | Server | Secret HMAC salt used to derive the abuse-control identifier. |
| `R2_ACCOUNT_ID` | Local/server tooling | R2 S3-compatible endpoint account. |
| `R2_ACCESS_KEY_ID` | Local/server tooling | R2 sync access key. |
| `R2_SECRET_ACCESS_KEY` | Local/server tooling | R2 sync secret. |
| `R2_BUCKET_NAME` | Local/server tooling | Target R2 bucket. |
| `R2_PUBLIC_BASE_URL` | Local/server tooling | Optional documented public R2 origin. |

Never put secrets in `NEXT_PUBLIC_*` variables or commit `.env.local`.

## Content and assets

- Identity, education and social details: `src/content/site.ts`
- Seven approved projects: `src/content/projects.ts`
- Formal certifications and digital badges: `src/content/credentials.ts`
- Skills and tools: `src/content/skills.ts`
- Typed canonical assets: `src/lib/assets/manifest.ts`
- Source-of-truth handoff: `docs/PORTFOLIO_CONTEXT.md`

The local files under `public/assets/` are canonical and must remain available. Missing project screenshots and links are omitted instead of replaced with fake media or empty buttons.

To sync canonical assets to an authorized R2 bucket:

```bash
pnpm assets:sync
```

The script preserves the `assets/` object keys and compares SHA-256 metadata, so repeated runs only upload changed files. It never deletes bucket objects.

## Forms and storage

`POST /api/contact` and `POST /api/suggestions` apply:

- Zod validation and normalization
- strict length and request-size limits
- honeypot protection
- Cloudflare Turnstile server verification
- per-instance rate limiting and duplicate reservation
- one-way HMAC hashing of the request address; raw IP addresses are not stored
- safe provider errors with no leaked secrets

Contact and suggestion email use the same Resend pipeline. When MongoDB is configured, records are stored in `contact_submissions` or `project_suggestions` with pending/sent/failed delivery state. No TTL is configured because a retention policy has not been selected.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e:install
pnpm test:e2e
```

Vitest covers the exact content taxonomy, validation, asset URL resolution, provider-adapter success/failure behavior and the contact form. Playwright covers navigation, filters, command palette, provider-safe form failure, ongoing-project suggestions, accessibility and responsive visual captures.

## Deployment

Recommended production layout:

1. Import the repository into Vercel and set `NEXT_PUBLIC_SITE_URL` to the final public origin.
2. Configure Resend and a verified sender domain.
3. Add a Cloudflare Turnstile widget for the production hostname.
4. Optionally create MongoDB Atlas storage and set `MONGODB_URI`.
5. Optionally sync `public/assets/` to R2, expose it through a public/custom domain and set `NEXT_PUBLIC_ASSET_BASE_URL`.
6. Run all quality checks in CI before promoting the deployment.

This repository does not create or deploy provider resources automatically.

## Visual system

The documented accent token is a restrained cool steel blue (`#9cb7e7`) against near-black and graphite surfaces. The system uses editorial scale, crisp borders, subtle texture and purposeful Motion transitions. It supports WCAG AA-oriented contrast, visible focus, keyboard operation and `prefers-reduced-motion` without global smooth scrolling.
