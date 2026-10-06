# Writing the case study

## Voice
- **Match the portfolio.** Read one or two existing case studies first and copy their tone, person ("I" vs "we"), sentence length, punctuation (curly vs straight quotes, en dashes) and how they phrase roles and dates. A new entry should be indistinguishable in voice.
- With no existing case studies, write plainly: first person, short specific sentences, concrete nouns, no hype ("revolutionary", "seamless", "cutting-edge", "elevate").
- Lead with the outcome or the most interesting decision, not with setup.

## Sections (use only those with evidence)

| Section | What it says | Typical evidence |
| --- | --- | --- |
| Title + tagline | Name; one sentence on the promise | README heading, app title, hero copy |
| Short description | 1–2 sentences for the card: what it is, for whom | README intro |
| Overview | What it is, the user's role, the scope | README, docs, commit authorship |
| Problem | Who struggles with what, and why it matters | PRD, brief, README "why" |
| Solution | How the design answers the problem, 3–5 points | Features in code, key screens |
| Process / workflow | The steps actually taken, in order (adapt: e.g. Brief → Research → Flows → UI → Build → Test) | Docs, commit history, Figma pages |
| Key features | Real, observable capabilities | Routes, components, screens |
| Design language | Typography, colour (with hex), spacing, layout, components, iconography, interaction patterns | Tokens, CSS, Tailwind config, Figma variables |
| Design style | 1–2 labels that the visuals clearly support | The screens themselves |
| Design decisions | Choice → reason → effect, 2–5 items | Docs, comments, commit messages, Figma annotations |
| Challenges | What was hard and how it was handled | Docs, commit history, workarounds |
| Outcome | What exists now, with honest status | Deploy, build, the user |
| Links | Live, prototype, repo, case study | Only ones that exist and the user agrees to share |
| Meta | Role, tools, platform, timeline, year, status, tags, category | package.json, git dates, the user |

## Style labels
Choose from: Minimalist, Modern, Corporate, Editorial, Fintech, SaaS, Glassmorphism, Neumorphism, Brutalist, Clean dashboard, Premium, Playful, Experimental. Use at most two, and only if the screens clearly show it. Otherwise describe the style in plain words.

## Categories and tags
- Reuse the portfolio's existing categories and tags verbatim. Add a new one only when nothing fits, and say so.
- With no existing taxonomy, choose from: UI/UX Design, Web Design, Product Design, Dashboard, Branding, Graphic Design, Mobile App, Fintech, SaaS, AI, Data Visualization, Development, Experiments. Use 2–5 tags.

## Honesty
- Status reflects reality: Concept (design only), In Progress, Completed, Live (publicly deployed).
- No numbers you didn't measure. No "increased conversion by 30%" without a source. No invented users, clients, testimonials or awards.
- Concept work is labelled as concept. Figma-only work describes designed behaviour, not shipped behaviour.
- If the user worked with others, credit them in the role line, or ask how they want it phrased.

## SEO
- Title: `<Project>: <what it is>` (the site usually appends its own name; check the portfolio's helper so it isn't doubled). 60 characters or fewer is ideal.
- Description: 160 characters or fewer, plain sentence, what + for whom.
- OG image: the hero (1200px wide or more).
- Alt text: what's visible and why it matters; 125 characters or fewer where possible.
