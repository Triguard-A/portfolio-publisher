# Portfolio Publisher for Claude Code

Turn the designs you make with **Claude** (Claude Code projects, Claude artifacts, Claude Design) or **Figma** into polished case studies on **your own portfolio site**, with one command.

```
Make a design  →  /portfolio-publisher add  →  Claude reads the project, writes the case study,
prepares real screenshots, adds the card and project page, checks the build  →  you review and publish
```

It works with the portfolio you already have. It reads how your site is built (Next.js, Astro, Vite/React, Nuxt, SvelteKit, Gatsby, Hugo, Jekyll, Eleventy or plain HTML) and adds projects the same way your existing ones are added, using your components, styles and voice. It never restyles your site.

## What you need

- **Claude Code** (terminal, desktop app Code tab, or IDE extension). Skills run in Claude Code, not in regular claude.ai chats.
- Your portfolio's **source code** in a git repo (GitHub, GitLab, Bitbucket). If you deploy to Vercel, Netlify, Cloudflare Pages or GitHub Pages from that repo, publishing is just a push.
- **Node.js 18+**, and Chrome, Edge or Chromium (for capturing screenshots).
- Optional: the **Figma MCP server** (for Figma sources) and the **Vercel MCP server** (to find your repo from a Vercel link).

Built with Framer, Webflow, Squarespace, Wix or Notion? Direct publishing isn't possible without source code, so the skill switches to **export mode** instead. It produces a ready-to-paste case-study pack (copy, CMS fields, optimized images, alt text, SEO).

## Install

In Claude Code:

```
/plugin marketplace add Triguard-A/portfolio-publisher
/plugin install portfolio-publisher@portfolio-publisher
```

Restart Claude Code (or start a new session) after installing.

**Manual install (no plugin system):** copy `skills/portfolio-publisher` into `~/.claude/skills/` (Windows: `%USERPROFILE%\.claude\skills\`).

## Connect your portfolio (once)

```
/portfolio-publisher setup
```

Give it any one of:
- your portfolio URL (e.g. `https://yourname.com` or `https://yourname.vercel.app`)
- your Vercel project link (`https://vercel.com/<team>/<project>`)
- your GitHub repo URL
- the folder path, if the code is already on your computer

Claude finds the source repo, clones it if needed (asking where), works out how projects are stored, runs a baseline build, and saves the result to `~/.claude/portfolio-publisher/profile.json`. Your settings live there, outside the plugin, so updates never overwrite them.

## Publish a design

Run it from inside the project you made, or pass a link:

```
/portfolio-publisher add                                   # the current Claude Code project
/portfolio-publisher add https://www.figma.com/design/…    # a Figma file or frame
/portfolio-publisher add https://claude.ai/artifact/…      # a Claude artifact
/portfolio-publisher add ./exports/my-brand-identity       # a folder of exported images
/portfolio-publisher add https://my-app.vercel.app         # a live site or prototype
```

| Command | What it does |
| --- | --- |
| `setup` | Connect (or reconnect) your portfolio |
| `add [source]` | Add a project as a full case study |
| `preview [source]` | Show exactly what would be added, without writing anything |
| `update [slug]` | Change screenshots, text, links, status, featured, etc. of one project |
| `list` | List the projects on your portfolio |
| `validate` | Check every project for missing images, broken links, missing metadata, duplicate slugs and build errors |

If a slash command name conflicts with another skill, use the full name `/portfolio-publisher:portfolio-publisher`.

## What a case study includes

Only the sections the project has real evidence for: hero mockup, title, tagline, category, year, status, role, tools, platform, overview, problem, solution, process, key features, design language (typography, colours, spacing, components), design style, design decisions, challenges, screenshot gallery, outcome, and links (live, prototype, repo). Each page also gets an SEO title, a meta description, an Open Graph image, alt text and a sitemap entry, when your site uses those.

## Safety by design

- **Nothing is invented.** No made-up features, metrics, clients, screenshots or links. Every claim comes from your files, your design or you. If something's unclear, it asks.
- **Real visuals only.** It uses your mockups, Figma exports or screenshots of the actual design. No AI-generated screens.
- **Your site stays yours.** It doesn't change other projects, unrelated code, your design system or your deployment settings.
- **You decide when it goes live.** Nothing is committed, pushed or deployed until you say so. The default suggestion is a branch and pull request, so you get a preview deployment first.
- **No secrets in chat.** If Figma's API is needed, you set `FIGMA_TOKEN` as an environment variable yourself.

## What's inside

```
.claude-plugin/          plugin + marketplace manifests
skills/portfolio-publisher/
  SKILL.md               the workflow Claude follows
  references/            connect, frameworks, sources, writing guides
  templates/             neutral project fields, example profile
  scripts/               capture.mjs, mockup.mjs, optimize-images.mjs, check-assets.mjs
```

The image scripts use [`sharp`](https://sharp.pixelplumbing.com). If your portfolio doesn't already have it, Claude will ask before installing it once to `~/.claude/portfolio-publisher`.

## Licence

MIT
