# Adapting to the portfolio's architecture

Work out where projects live by reading the code, not by assuming. Start from a page you can see on the live site (an existing project) and trace it back: which route file renders it, where its text comes from, and where its images are.

## Inspection checklist

1. `package.json`: framework, scripts (`dev`, `build`, `lint`, `typecheck`, `test`), package manager, Node engine.
2. The routing: the folders below, or the router config for SPAs (`createBrowserRouter`, `<Routes>`).
3. **Where project content lives**: search for an existing project's title across the repo (`grep -rl "<title>" --exclude-dir=node_modules`). The file that holds it is the data source.
4. The project type or schema (TS type, Zod schema, `content.config.ts`, frontmatter of existing files).
5. The image pattern: folder, naming, formats and sizes of an existing project's images, and the component that renders them.
6. Listing and featured: how the home/work page picks and orders projects, and whether there's a `featured` flag or a fixed slot.
7. Categories and filters: whether they exist and where their values are defined.
8. SEO: how pages set titles and meta (helper, layout prop, `metadata` export) and whether there's a static `sitemap.xml` or a generated one.
9. Styling: Tailwind, CSS modules, plain CSS, CSS-in-JS. Note the classes and components an existing case study uses, so you can reuse them.
10. Deploy config: `vercel.json`, `netlify.toml`, `.github/workflows`, `_redirects`. Read it, don't change it.

## Common architectures

### Next.js (App Router)
- Route: `app/(…)/work/[slug]/page.tsx` or `app/projects/[slug]/page.tsx` with `generateStaticParams`.
- Data: often `data/projects.ts`, `content/projects/*.mdx` (with Contentlayer, Velite, `next-mdx-remote` or `@next/mdx`), or a CMS.
- SEO: `generateMetadata` in the route, reading from the same data. No extra work if it does.
- Images: `public/<dir>/` plus `next/image`. Static imports (`import hero from './hero.png'`) also work and give dimensions automatically; follow whichever the site uses.
- Sitemap: `app/sitemap.ts` is usually generated from data, so nothing to add.

### Next.js (Pages Router)
- Route: `pages/work/[slug].tsx` with `getStaticPaths`/`getStaticProps`; or one file per project in `pages/work/`.
- SEO: `next/head` or `next-seo` in the page or a layout.

### Astro
- Content collections: `src/content/<collection>/<slug>.md(x)` with a schema in `src/content.config.ts` (or `src/content/config.ts`). Add a new file whose frontmatter matches the schema exactly. Its fields are validated at build time.
- Route: `src/pages/work/[...slug].astro` using `getCollection`.
- Images: `src/assets/` with `<Image>` (optimized at build time; reference them relative to the content file, as existing entries do) or `public/`.

### Vite + React / Vue / Svelte SPA
- Data: commonly `src/data/projects.(ts|js|json)`, rendered by a `/work/:slug` route.
- SEO: a hook or helper (`useMeta`, `react-helmet-async`, `@unhead`), plus a static `public/sitemap.xml` to update by hand.
- SPA deep links need a host rewrite (`vercel.json` rewrites, Netlify `_redirects`). If one is missing, say so; don't add it without asking.

### Nuxt / SvelteKit / Remix / Gatsby
Same approach: find the dynamic project route and its data source. In Nuxt, `content/` is used with `@nuxt/content`. In SvelteKit, `src/routes/work/[slug]/+page.(ts|js)` loads data. In Gatsby, `gatsby-node` creates pages from markdown/MDX or a source plugin.

### Static site generators (Hugo, Jekyll, Eleventy)
A project is a markdown file with front matter in the content folder (`content/work/`, `_projects/`, `src/work/`). Copy the front-matter keys from an existing project exactly. Images usually go in `static/`, `assets/` or a page bundle beside the markdown.

### Plain HTML/CSS
One HTML file per project, plus a card in `index.html`. Duplicate the most complete existing project page, replace its content, and keep every class name. Add the card by copying an existing card. Update a `sitemap.xml` if present.

### Headless CMS (Sanity, Contentful, Payload, Strapi, Prismic, Notion API)
If projects come from a CMS, the code doesn't hold the content. Don't write to the CMS unless the user explicitly asks and has their CMS CLI or token configured in their environment. Otherwise, use **export mode** (see `connect.md`) with field names matching the CMS schema in the repo (e.g. Sanity `schemaTypes`).

## Mapping the neutral template to the portfolio

`templates/project.json` is the superset. For each field:
1. The portfolio has an equivalent → use its name and shape exactly (e.g. `summary` vs `description`, `year` as a number vs a string, `images` as strings vs objects).
2. The page would render it only with a template change → leave it out and mention it in the report as "available but not shown". Offer the change separately.
3. There's no equivalent → leave it out.

Match formatting exactly: quote style, trailing commas, ordering of keys, typographic apostrophes, how existing entries write dates and lists. The new entry should look like the same person wrote it.

## Validation commands

Use what the repo defines; never invent scripts. Typical order: `typecheck` (or `tsc --noEmit`) → `lint` → `test` → `build`. Static generators: `hugo`, `bundle exec jekyll build`, `npx @11ty/eleventy`. Report pre-existing failures (from the setup baseline) separately from new ones.
