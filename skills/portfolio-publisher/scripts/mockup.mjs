// Frames a real screenshot in a neutral browser window on a solid background,
// so raw captures read as case-study imagery. The screenshot itself is placed
// unchanged.
//
//   node mockup.mjs <screenshot.png> <out.png> [accent=#1f2937] [url=example.com] [size=3200x1800]
import path from 'node:path'
import { loadSharp } from './load-sharp.mjs'

const [input, output, ...rest] = process.argv.slice(2)
if (!input || !output) {
  console.error('Usage: node mockup.mjs <screenshot.png> <out.png> [accent=#hex] [url=domain] [size=WxH]')
  process.exit(1)
}
const opt = Object.fromEntries(rest.map((o) => [o.slice(0, o.indexOf('=')), o.slice(o.indexOf('=') + 1)]))
const accent = /^#[0-9a-f]{3,8}$/i.test(opt.accent ?? '') ? opt.accent : '#1f2937'
const url = (opt.url ?? '').replace(/[<>&"']/g, '')
const [W, H] = (opt.size ?? '3200x1800').split('x').map(Number)

const sharp = await loadSharp()
const PAD = Math.round(W / 16)
const BAR = Math.round(W / 50)
const R = Math.round(W / 145)

const shot = sharp(path.resolve(input))
const { width: sw, height: sh } = await shot.metadata()
const scale = Math.min((W - PAD * 2) / sw, (H - PAD * 2 - BAR) / sh)
const w = Math.round(sw * scale)
const h = Math.round(sh * scale)
const x = Math.round((W - w) / 2)
const y = Math.round((H - h - BAR) / 2)
const dot = (cx, fill) => `<circle cx="${x + cx}" cy="${y + BAR / 2}" r="${BAR / 6.4}" fill="${fill}"/>`

const frame = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="${accent}"/>
  <rect x="${x}" y="${y + R}" width="${w}" height="${h + BAR}" rx="${R}" fill="#000" opacity="0.18"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h + BAR}" rx="${R}" fill="#f4f4f5"/>
  ${dot(BAR * 0.62, '#ef4444')}${dot(BAR * 1.12, '#f59e0b')}${dot(BAR * 1.62, '#22c55e')}
  ${
    url
      ? `<rect x="${x + w / 2 - W / 10.6}" y="${y + BAR * 0.22}" width="${W / 5.3}" height="${BAR * 0.56}" rx="${BAR * 0.28}" fill="#e4e4e7"/>
  <text x="${x + w / 2}" y="${y + BAR * 0.61}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="${BAR * 0.31}" fill="#52525b" text-anchor="middle">${url}</text>`
      : ''
  }
</svg>`

const body = await shot.resize(w, h).png().toBuffer()
const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect y="${-R * 2}" width="${w}" height="${h + R * 2}" rx="${R}" fill="#fff"/></svg>`)
const rounded = await sharp(body).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()

await sharp(Buffer.from(frame))
  .composite([{ input: rounded, left: x, top: y + BAR }])
  .png()
  .toFile(path.resolve(output))
console.log('wrote', output)
