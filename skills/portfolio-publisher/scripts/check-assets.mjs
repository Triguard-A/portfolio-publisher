// Finds local image paths referenced in the given files and reports any that
// don't exist. Root-relative paths ("/work/x.webp") are looked up in the
// portfolio's public/static folders; relative paths ("./hero.png") next to the
// file that references them. Responsive base paths are checked by prefix
// (e.g. "/work/app/hero" matches "hero-800.webp").
//
//   node check-assets.mjs <portfolioRoot> <file> [file ...]
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const [root, ...files] = process.argv.slice(2)
if (!root || !files.length) {
  console.error('Usage: node check-assets.mjs <portfolioRoot> <file> [file ...]')
  process.exit(1)
}

const publicDirs = ['public', 'static', 'assets', '.'].map((d) => path.resolve(root, d)).filter(existsSync)
const IMG = /\.(png|jpe?g|webp|avif|gif|svg)$/i
const pattern = /["'`(]((?:\.{1,2}\/|\/)[^"'`()\s]+?)["'`)]/g

const exists = (p) => {
  if (existsSync(p)) return true
  // A base path without extension (responsive sets): any sibling that starts with it.
  const dir = path.dirname(p)
  const base = path.basename(p)
  return existsSync(dir) && readdirSync(dir).some((f) => f.startsWith(base) && IMG.test(f))
}

let missing = 0
let checked = 0
for (const file of files) {
  const text = readFileSync(file, 'utf8')
  for (const [, ref] of text.matchAll(pattern)) {
    const looksLikeImage = IMG.test(ref) || /\/(work|projects|images|img|assets|media|case-studies)\//i.test(ref)
    if (!looksLikeImage || ref.startsWith('//')) continue
    const clean = ref.split(/[?#]/)[0]
    const candidates = clean.startsWith('/')
      ? publicDirs.map((d) => path.join(d, clean))
      : [path.resolve(path.dirname(file), clean)]
    // Skip code imports and routes that clearly aren't files.
    if (!IMG.test(clean) && !candidates.some((c) => existsSync(path.dirname(c)))) continue
    checked++
    if (!candidates.some(exists)) {
      missing++
      console.error(`missing  ${ref}  (in ${path.relative(root, file) || file})`)
    }
  }
}
console.log(`${checked} image references checked · ${missing} missing`)
process.exit(missing ? 1 : 0)
