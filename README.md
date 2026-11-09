# Swayamatics

Marketing site for **Swayamatics** — automation and technology agency.
AUTOMATE | INTEGRATE | TRANSFORM

Built with [Astro](https://astro.build) 7, React 19, and Tailwind CSS 4.

## Getting Started

```bash
pnpm install
pnpm dev
```

Site runs at `http://localhost:4321`.

```bash
pnpm build     # production build
pnpm preview   # preview the production build locally
pnpm check     # type-check
pnpm format    # prettier
```

## Project structure

- `src/pages/` — routes. `src/pages/services/[slug].astro` renders individual service pages from `src/data/services.ts`.
- `src/content/` — editable site copy (homepage, about, services, blog, legal pages) as Markdown/MDX, validated against schemas in `src/content.config.ts`.
- `src/config/` — site-wide settings: `config.json` (brand/meta/contact), `menu.json` (nav + footer links), `theme.json` (colors/fonts).
- `src/layouts/components/` — reusable Astro components.
- `public/images/` — static assets, including `integrations/` and `stack/` (third-party and tech-stack logos).

## Contact form

`src/pages/api/contact.ts` validates submissions, writes leads to **Airtable**, and sends notification + confirmation email via **Resend**. Required env vars are documented in `.env.example` — copy it to `.env` and fill in real credentials before the form will work end-to-end.

## Deployment

Configured for **Vercel** (`@astrojs/vercel` adapter, see `astro.config.mjs`). Cloudflare Workers (`wrangler.jsonc`) and Netlify (`netlify.toml`) configs are also present but unverified for this project.

## License

Proprietary — see `LICENSE`. Not for redistribution.
