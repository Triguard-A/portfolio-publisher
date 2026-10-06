// Finds `sharp` without adding it to the user's portfolio: first the current
// project's node_modules, then ~/.claude/portfolio-publisher/node_modules.
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export async function loadSharp() {
  const home = path.join(os.homedir(), '.claude', 'portfolio-publisher')
  for (const dir of [process.cwd(), home]) {
    try {
      const resolved = createRequire(path.join(dir, 'noop.js')).resolve('sharp')
      const mod = await import(pathToFileURL(resolved).href)
      return mod.default ?? mod
    } catch {
      // try the next location
    }
  }
  console.error(`sharp is not installed. Install it once for this skill with:\n  npm install --prefix "${home}" sharp`)
  process.exit(2)
}
