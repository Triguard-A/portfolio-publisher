// Resizes and converts images into the portfolio's own convention, and prints
// the dimensions to put in the project entry. Run from the portfolio root.
//
//   node optimize-images.mjs --out public/work/my-app [--widths 800,1600] [--format webp]
//        [--naming "{name}-{width}.{ext}"] [--quality 82] name=path/to/file.png ...
//
// --widths 0 keeps the original width (one file per image).
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { loadSharp } from './load-sharp.mjs'

const opts = { widths: '800,1600', format: 'webp', naming: '{name}-{width}.{ext}', quality: '82' }
const pairs = []
const argv = process.argv.slice(2)
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a.startsWith('--')) opts[a.slice(2)] = argv[++i]
  else pairs.push(a)
}
if (!opts.out || !pairs.length) {
  console.error('Usage: node optimize-images.mjs --out <dir> [--widths 800,1600] [--format webp|avif|jpeg|png] [--naming "{name}-{width}.{ext}"] name=file ...')
  process.exit(1)
}

const sharp = await loadSharp()
const widths = opts.widths.split(',').map(Number)
const format = opts.format === 'jpg' ? 'jpeg' : opts.format
const ext = format === 'jpeg' ? 'jpg' : format
const quality = Number(opts.quality)
await mkdir(opts.out, { recursive: true })

const result = {}
for (const pair of pairs) {
  const i = pair.indexOf('=')
  if (i < 1) throw new Error(`Expected name=file, got "${pair}"`)
  const name = pair.slice(0, i)
  const src = path.resolve(pair.slice(i + 1))
  const meta = await sharp(src).metadata()
  result[name] = { source: src, originalWidth: meta.width, originalHeight: meta.height, files: [] }
  for (const w of widths) {
    const width = w || meta.width
    if (width > meta.width) console.warn(`warn: ${name} is ${meta.width}px wide; the ${width}w file will be upscaled`)
    const file = opts.naming.replace('{name}', name).replace('{width}', String(width)).replace('{ext}', ext)
    const out = path.join(opts.out, file)
    await sharp(src).rotate().resize({ width }).toFormat(format, { quality }).toFile(out)
    result[name].files.push({ path: out.split(path.sep).join('/'), width, height: Math.round((meta.height / meta.width) * width) })
  }
}
console.log(JSON.stringify(result, null, 2))
