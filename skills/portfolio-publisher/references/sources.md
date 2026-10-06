# Getting content and images from each source

Identify the source from the argument:

| Argument | Source type |
| --- | --- |
| nothing, or a local folder | Local project (Claude Code project, any repo or design folder) |
| `figma.com/design/…`, `/file/…`, `/proto/…`, `/board/…` | Figma |
| `claude.ai/artifact/…`, `claude.ai/public/artifacts/…`, `claude.site/…` | Claude artifact |
| a Claude Design link or exported Claude Design folder/zip | Claude Design |
| any other `https://` URL | Live site or prototype |
| a folder of PNG/JPG/PDF files | Image exports from any tool |

A project can have several sources (e.g. a Claude Code repo plus its Figma file). Use them all, and keep track of which fact came from where.

## Local project (Claude Code projects and any repo)

- **Text**: README, `docs/`, PRD/brief files, `CLAUDE.md`, design notes, `marketing/` copy, page titles and headings in the code.
- **Facts**: `package.json` (name, dependencies → tools, `homepage`), routes/pages (→ real features), `git log --oneline` and the first-commit date (→ year, timeline, iterations), `git remote -v` (→ repo link; confirm it's public before linking), deploy config (`.vercel/project.json`, `vercel.json`, `netlify.toml`) (→ live URL).
- **Design system**: CSS custom properties, the Tailwind config/theme, font imports, component folder names.
- **Images**: look in `screenshots/`, `mockups/`, `marketing/`, `design/`, `docs/`, `assets/`, `images/`, `public/`, README images and `og:image`. Skip icons, logos, favicons, stock photos and anything under ~600px wide.
- **No images?** Run the app (use the dev server preview tools if available, otherwise the project's dev command) and capture screens with `scripts/capture.mjs`. Choose screens that show the product working, not a login wall. For screens behind sign-in, use the app's demo or test mode or seed data. Never enter real credentials.

## Figma

Prefer the **Figma MCP server** if it's connected:
1. `get_metadata` on the file or node to list pages and top-level frames. Pick the final screens. Skip pages named like "Archive", "Old", "Exploration" or "WIP" unless you're using them for the process section.
2. `get_screenshot` to look at frames and choose; `get_design_context` for structure and text; `get_variable_defs` for colour, type and spacing tokens (→ design-language section). Read comments and annotations for design rationale if available.
3. **Exporting images to files**: use an MCP export or download tool if the server offers one (e.g. `download_assets`). Otherwise use the Figma REST API with a personal access token the user has set themselves as the environment variable `FIGMA_TOKEN`:
   ```bash
   curl -s -H "X-Figma-Token: $FIGMA_TOKEN" "https://api.figma.com/v1/images/<fileKey>?ids=<nodeId1>,<nodeId2>&format=png&scale=2"
   ```
   It returns temporary image URLs; download each with `curl -L -o`. Node IDs in URLs use `-` (e.g. `12-34`); the API wants `:` (`12:34`).
   If neither is available, ask the user to export the frames (select frames → Export → PNG 2x) into a folder, and continue from that folder.
4. **Links**: a prototype link (`figma.com/proto/…`) can be the "View prototype" link, but only if the user confirms the file is shared publicly. Never publish a Figma link without asking.

Figma tells you what the design looks like, not what it does. Describe features as **designed** ("designed a checkout flow with…"), not as shipped, unless there's a build too.

## Claude artifact

1. If the Artifact tool is available, read the artifact (`action: "read"`) to get its HTML. Otherwise ask the user to download it from claude.ai (the artifact's download/copy option) and give you the file. For a published link, `capture.mjs` can screenshot it directly.
2. Save the HTML to a scratch folder, serve it locally (e.g. `npx --yes serve <dir>` or `python -m http.server`) and capture it with `capture.mjs` at desktop and, if responsive, mobile sizes (`--width 390 --height 844 --scale 3`). For interactive artifacts, capture the meaningful states. Use the browser preview tools to click through if you can; otherwise capture what loads.
3. Content comes from the artifact's own text and the conversation context the user gives you. Artifacts often have no README, so ask the user one or two questions about purpose and audience if it isn't evident.
4. Only list the artifact link as "Live demo" if it's published and the user agrees.

## Claude Design

Claude Design projects can be handed off as code or exported (HTML or zip). Prefer an export or a handoff into a local folder. Treat that folder as a **Local project**, or as a **Claude artifact** if it's a single HTML file. If the user only has a share link, capture it with `capture.mjs` (or the browser tools if it needs sign-in, which the user does themselves), and get the content by asking the user and reading what's on screen.

## Live site or prototype

Capture it with `capture.mjs` (several pages and sizes). Read its text, `<title>` and meta description, and `og:image` for content. Only describe what you can see. Ask the user for the context (problem, role, process) that a live site can't show.

## Image folder

Use the images as they are. Read file names for screen names and order. Ask the user for the story, or combine with another source above.

## Framing and optimizing

- `scripts/mockup.mjs` frames a screenshot in a neutral browser window on a solid colour (the project's primary colour works well) for the hero and card. Only frame real screenshots, and don't frame images that are already mockups.
- `scripts/optimize-images.mjs` writes the formats and widths the portfolio already uses (recorded in the profile).
- Every image gets alt text describing what's on screen ("Checkout step 2 with a saved card selected and the order summary on the right"), not "screenshot of app".
