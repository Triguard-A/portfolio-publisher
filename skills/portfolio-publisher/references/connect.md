# Connecting a portfolio (`setup`)

Goal: end with a local, buildable copy of the user's portfolio source and a profile at `~/.claude/portfolio-publisher/profile.json` that records how the portfolio is built. The shape is in `templates/profile.example.json`.

A website URL alone can't be edited. Publishing means changing the **source** that the site is built from, then letting the host redeploy it. Setup's job is to get from whatever the user gives you to that source.

## 1. Ask for the portfolio

If the user didn't give one, ask for **any one** of:
- the live portfolio URL (custom domain or `*.vercel.app`, `*.netlify.app`, `*.github.io`, `*.pages.dev`)
- the Vercel project link (`vercel.com/<team>/<project>`)
- the GitHub (or GitLab, Bitbucket) repository URL
- a local folder path

Also ask whether they already have the code on this computer. If they do, that's the fastest route.

## 2. Identify the platform from a URL

Fetch the page (WebFetch, or `curl -sI` for headers plus `curl -sL` for HTML). Then classify it.

**Hosts, from response headers:** `x-vercel-id` or `server: Vercel` means Vercel. `server: Netlify` or `x-nf-request-id` means Netlify. `server: GitHub.com` means GitHub Pages. `cf-ray` with `*.pages.dev` means Cloudflare Pages.

**Frameworks, from the HTML:**

| Signal | Framework |
| --- | --- |
| `/_next/`, `__NEXT_DATA__`, `next-route-announcer` | Next.js |
| `/_astro/`, `astro-island` | Astro |
| `/_nuxt/`, `__NUXT__` | Nuxt |
| `data-sveltekit`, `/_app/immutable/` | SvelteKit |
| `___gatsby` | Gatsby |
| `/assets/index-<hash>.js` and `<div id="root">` | Vite (React, Vue, etc.) |
| `/_remix/`, `__remixContext` | Remix / React Router |
| `<meta name="generator">` naming Hugo, Jekyll, Eleventy or Docusaurus | that static generator |

**No-code builders**: `generator` meta or asset hosts for Framer (`framerusercontent.com`), Webflow (`webflow`), Wix, Squarespace, WordPress.com, Notion-based (Super, Potion), Carrd, Cargo, Readymag, Behance or Dribbble. These have no source repo to edit. Tell the user this plainly and offer **export mode**: each `add` produces a ready-to-paste case-study pack instead of code changes (see "Export mode" below). Set `"mode": "export"` in the profile.

## 3. Find the source repository

Try these in order, and stop at the first that works:
1. **The user already has it locally**: use that path. If they aren't sure, check folders they name with `git -C <dir> remote -v`.
2. **Vercel**: if Vercel MCP tools are connected, list projects and match the domain or project name, then read the project's git link (repo and production branch). Otherwise, if the `vercel` CLI is installed and logged in, use `vercel project ls` / `vercel inspect <url>`. A `.vercel/project.json` in a local folder also identifies the project.
3. **Netlify**: `netlify sites:list` (if the CLI is installed and logged in) shows the linked repo.
4. **GitHub**: `gh repo list <owner> --json name,homepageUrl,url` and match `homepageUrl` to the site, or look for a repo link in the site's footer or source.
5. **Ask the user** for the repo URL.

If the repo is private and `git clone` fails for lack of access, ask the user to sign in with `gh auth login` or their usual git credentials themselves. Never ask for a token in chat.

## 4. Get a local copy

Ask where to put it (suggest `~/Documents/<repo-name>`), then `git clone <repo> <path>` (or `gh repo clone`). Record the production branch (from Vercel/Netlify settings, or the repo's default branch).

Install dependencies with the lockfile's package manager (`package-lock.json` → npm, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` → bun). Ask first if the install will be large or slow.

## 5. Inspect the architecture

Follow `references/frameworks.md`. Record everything in the profile, especially:
- `dataModel`: where projects live, their exact field names, one example slug
- `route` and `pageMode`: a dynamic route vs one file per project
- `images`: folder, naming pattern, formats, widths, image component
- `listing`: the files that render project cards, and whether they read from data
- `seo`, `sitemap`, `featured`, `categories`
- `checks`: the commands to validate (from `package.json` scripts)
- `dev`: the command and port

Run the build once now and record the result (`baseline`). Then any later failure can be compared against what was already broken before you touched anything.

## 6. Owner details

Ask only for what the site doesn't already show: the name to use in SEO titles (often it's already in the site config), and their usual role wording (e.g. "Product Designer"). Never collect anything else personal.

## 7. Save and confirm

Write `~/.claude/portfolio-publisher/profile.json` (create the folder). Show the user a short summary (site, repo, local path, framework, where projects go, route, checks) and ask them to confirm. Re-running `setup` updates the profile. To manage several portfolios, keep one profile per site under `profiles/<name>.json` and record which one is the `default` in `profile.json`.

## Export mode (no-code portfolios)

For Framer, Webflow, Squarespace, Wix, WordPress.com, Notion sites and similar, `add` writes a pack to `profile.exportDir/<slug>/`:
- `case-study.md`: every section, in the order the user's existing case studies use, with headings matching their CMS fields if known
- `fields.json`: the same content as key/value pairs for pasting into CMS collection fields
- `images/`: optimized images (the builder's preferred sizes; WebP or PNG) and `images/alt-text.md`
- `seo.md`: page title, meta description, slug, Open Graph image

Then give short, accurate steps for that builder (e.g. "Framer → CMS → Projects → New item, paste each field"). Don't claim the project is live; the user publishes it.
