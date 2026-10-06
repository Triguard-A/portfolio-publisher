---
name: portfolio-publisher
description: Publish a design or project to the user's own portfolio website as a full case study (card, project page, optimized images, SEO), adapting to however their portfolio is built. Sources can be the current Claude Code project, a Claude artifact or Claude Design link or export, a Figma file or frame link, a live URL, or a folder of exported images. Use when the user runs /portfolio-publisher (setup, add, update, list, preview, validate), or asks to connect their portfolio (by URL, Vercel link or repo) or to add, publish, update or list a project in their portfolio.
argument-hint: "[setup | add | update | list | preview | validate] [source: path, Figma URL, artifact URL, live URL]"
---

# Portfolio Publisher

Turns a design into a case study on the user's **existing** portfolio site, in that site's own architecture and design system. It never builds a separate portfolio and never restyles the user's site.

Files in this skill's folder (the folder containing this SKILL.md):

| File | Read it when |
| --- | --- |
| `references/connect.md` | Running `setup`, or the profile is missing or stale |
| `references/frameworks.md` | Inspecting the portfolio or deciding where a project goes |
| `references/sources.md` | Getting content and images from Figma, Claude artifacts, Claude Design, live URLs or image folders |
| `references/writing.md` | Writing the case-study copy |
| `templates/project.json` | The neutral field list every project is written from |
| `scripts/*.mjs` | Image work (see "Scripts" below) |

## The profile

Each user's settings live in `~/.claude/portfolio-publisher/profile.json` (Windows: `%USERPROFILE%\.claude\portfolio-publisher\profile.json`). That folder sits outside the plugin, so updates never overwrite it. Read it first on every command.

- No profile → run **setup** first, then continue with the command the user asked for.
- A profile path that no longer exists, or a framework that no longer matches → tell the user, re-run the relevant part of setup, and update the profile.

Never store tokens, passwords or API keys in the profile.

## Commands

Parse the first argument. No argument means `add`. Anything after the command is the **source** (see `references/sources.md`); with no source, the source is the current working directory.

- **`setup`**: connect a portfolio. Follow `references/connect.md`.
- **`add [source]`**: the **Add procedure** below.
- **`update [slug]`**: find the project (ask if ambiguous), ask what to change if not said (images, description, status, tools, links, design language, case-study text, features, outcome, featured), change only those fields of that one project, then **Validate**. Replace images under the same filenames so paths stay stable; delete old images only with permission.
- **`list`**: list projects from the portfolio's data source as a table (title, slug, category, status, featured, route). Read only.
- **`preview [source]`**: Add steps 1–6 (read only), then show the proposed content, the file changes (with paths), the images (source → destination) and any open questions. Write nothing.
- **`validate`**: the **Validate** step for every project, plus link checks. Report; fix only with permission.

## Add procedure

### 1. Check state
Run `git status` and `git branch --show-current` in the portfolio repo (`profile.localPath`), and in the source if it's a repo. Note uncommitted work. Never stash, reset, overwrite or commit anything. If the portfolio has uncommitted changes in files you will edit, tell the user first. If `profile.remote` is set, `git fetch` and say if the local branch is behind; pull only with permission.

### 2. Re-check the portfolio
Confirm the architecture recorded in the profile still holds (quick look at the data file, the project route and an existing project). If it changed, update the profile and say so.

### 3. Gather the source
Follow `references/sources.md` for the source type. Collect evidence: text (README, docs, PRD, Figma descriptions and annotations, artifact copy), structure (screens, routes, frames), the visual system (fonts, colour tokens, spacing, components), history (git log, Figma page names, version notes) and links (deploy URL, repo, Figma prototype).

### 4. Duplicate check
Compare against every existing project by slug, title (case-insensitive), repo name, live URL and Figma file key. If any match, stop and ask:
1. Update the existing project
2. Replace it (confirm before overwriting content or images)
3. Create a separate entry (needs a new slug)

Placeholder or "coming soon" entries: when adding a real project, ask whether to replace the placeholder; never remove it silently.

### 5. Title and slug
Title from the source (README heading, app title, Figma file or page name), in human form. Slug: lowercase kebab-case, ASCII, unique, e.g. "Bank Operations Digitization Platform" → `bank-operations-digitization-platform`. Follow the portfolio's existing slug and ordering conventions (some portfolios number projects, some sort by date).

### 6. Visuals (never fabricate)
Use real images of the actual design only: existing mockups and screenshots in the source, Figma frame exports, or captures of the running app, artifact or live URL. Details per source are in `references/sources.md`.

- Hero: 16:9 (or whatever ratio the portfolio's existing heroes use). Card image: the ratio the existing cards use.
- Gallery: 2–8 of the most informative screens, in a sensible order.
- Optionally frame a raw screenshot with `scripts/mockup.mjs` so it reads as case-study imagery. This adds a window frame and background only. It never changes the UI.
- If no visuals can be obtained, don't invent any. Ask the user for images (say exactly which: hero, card, 2–6 screens, with sizes), or publish as a draft/coming-soon entry if the portfolio supports one.

Never use AI image generation to create screenshots, mockups of screens that don't exist, or "improved" versions of the design.

### 7. Ask only what you can't determine
One short batch of questions (use AskUserQuestion), for example: category if genuinely ambiguous, whether to feature it, the user's role if there were collaborators, whether a private repo or Figma file may be linked, the year if nothing shows it. Don't ask what the files answer.

### 8. Write the content
Fill `templates/project.json` from the evidence, following `references/writing.md`. Then map it onto the portfolio's own data shape (`profile.dataModel`). Fields the portfolio doesn't have:
- If the portfolio renders optional sections from data, add the field only if the page will render it.
- Otherwise put the content into the portfolio's existing fields (for example decisions into a "process" or "body" field), or leave it out. Don't change page templates unless the user agrees (see 9).

Omit any section you can't support with evidence rather than padding it.

### 9. Write the files
Follow the recipe for the portfolio's architecture in `references/frameworks.md` and the conventions recorded in the profile:
- **Images**: optimize into the portfolio's image folder with `scripts/optimize-images.mjs`, using the portfolio's existing naming, formats and sizes. Use whatever image component the portfolio already uses (`next/image`, Astro `<Image>`, its own component) with descriptive alt text and real width/height.
- **Entry**: add the project in the portfolio's data source (data file, CMS-style markdown/MDX, content collection), copying the structure and formatting of an existing entry.
- **Page**: if the portfolio has a dynamic project route, no page code is needed. If each project is a hand-written page, create one by copying the structure of the most complete existing project page and swapping its content, nothing else.
- **Listing**: if the homepage or work page lists projects from data, nothing to do. If it's hard-coded, add a card by copying an existing card's markup.
- **Filtering and categories**: if they exist, register the project with existing categories. Don't create a filter UI or a new category unless none fits.
- **Featured**: default not featured. Feature only when asked. If the portfolio shows one featured project, ask before replacing it.
- **SEO**: use the portfolio's existing pattern (Next `metadata`/`generateMetadata`, Astro layout props, `<head>` tags, a meta helper). Title, description of 160 characters or fewer, Open Graph image (the hero), canonical if the site sets them. Add the route to a static sitemap if there is one.

**Design consistency:** new content must use the portfolio's existing components, typography, colours, spacing, buttons, cards and animations. The project's own identity shows only through its images, its accent colour (if the portfolio supports per-project accents) and its design-language section. If the user wants a new kind of section, ask first, and build it from existing classes, tokens and components.

**When the portfolio has no project structure** (for example a single hand-coded page with no project pages), stop and propose the smallest change that fits the existing code, such as a data file plus one dynamic route that reuses the site's layout and styles. Show the plan and get a yes before writing it.

### 10. Validate
In the portfolio:
1. Run `node <skill>/scripts/check-assets.mjs <portfolio> <files you changed>` to confirm every local image the new content references exists.
2. Run the portfolio's own checks if they exist, in this order: typecheck, lint, test, build (from `package.json` scripts; for non-Node sites, their build command).
3. Fix errors you introduced and rerun. Don't fix pre-existing warnings; mention them.
4. Run the dev server (with the browser preview tools if available) and open the new project page and the listing page. Check for console errors, broken images, horizontal overflow at 375px and readability at desktop width. Check keyboard focus reaches the project card and links. Take a screenshot as proof.

### 11. Report, then ask about publishing
Show the `git diff --stat`, then:

```
Portfolio updated.

Project:   <Title>
Route:     <route>
Source:    <Claude Code project | Figma file | Claude artifact | …>

Added:
✓ Project card
✓ Project page
✓ Images (<n>)
✓ Case-study content (<sections>)
✓ Tags / category
✓ SEO (title, description, OG image<, sitemap>)

Validation:
✓ Assets   ✓ Lint   ✓ Build   ✓ Browser check
```

Use ✗ with a reason for anything that failed or was skipped, and list missing images or open questions.

**Publishing is the user's call.** Nothing is committed, pushed or deployed until they say so. Then offer, in this order of preference:
1. **Branch + pull request.** Commit to a new branch and open a PR. On Vercel, Netlify or Cloudflare Pages this gives a preview URL to check before merging.
2. **Commit and push to the production branch.** This deploys immediately on git-connected hosts.
3. **Leave it local.**

Do only what they choose. Never force-push. Never change deployment settings, environment variables or domains. If the build would fail on the host (different Node version, missing env var), say so instead of pushing.

## Rules that always apply

- **Never invent**: features, metrics, users, clients, results, testimonials, screenshots, URLs, repos, dates, tools or collaborators. Every claim must trace to the source, the user, or something you observed. If in doubt, leave it out or ask.
- **Never** delete or rewrite other projects, or change unrelated code or the site's design, without permission.
- **Credentials**: never ask the user to paste tokens or passwords into chat. If a Figma or Vercel token is needed, the user sets it as an environment variable themselves (`references/sources.md`).
- **Private material**: if a source looks confidential (client names, internal URLs, real customer data in screenshots), point it out and ask before publishing. Offer to blur or crop real personal data in screenshots.
- **Accessibility**: descriptive alt text on every image, correct heading order, links with meaningful text, no information carried only by images or colour, reduced-motion respected by anything that animates.
- **Responsive**: no fixed widths that overflow, images sized with width/height or aspect-ratio, lazy-loaded below the fold.

## Scripts

All scripts are Node 18+ ES modules in `scripts/`. The image scripts need `sharp`. They look for it in the portfolio's `node_modules` first, then in `~/.claude/portfolio-publisher/node_modules`. If neither has it, ask the user, then run `npm install --prefix ~/.claude/portfolio-publisher sharp`. Don't add `sharp` to the portfolio's dependencies unless it's already there.

| Script | Purpose |
| --- | --- |
| `optimize-images.mjs --out <dir> --widths 800,1600 --format webp name=file …` | Resize and convert, and print each image's width/height for the data entry. `--widths` and `--format` should match the portfolio's convention. |
| `mockup.mjs <in.png> <out.png> [accent=#hex] [url=domain]` | Frame a real screenshot in a browser window on a solid background. |
| `capture.mjs <url> <out.png> [--width 1440 --height 900 --scale 2 --dark]` | Screenshot a URL with the installed Chrome, Edge or Chromium (headless). |
| `check-assets.mjs <portfolioRoot> <file> …` | Find local image paths referenced in the given files and report any that don't exist. |
