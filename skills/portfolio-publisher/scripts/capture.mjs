// Screenshots a URL with the locally installed Chrome, Edge or Chromium in
// headless mode. No npm dependencies.
//
//   node capture.mjs <url> <out.png> [--width 1440] [--height 900] [--scale 2] [--wait 8000] [--dark]
//
// Set CHROME_PATH to use a specific browser binary.
import { execFileSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const argv = process.argv.slice(2)
const [url, out] = argv.filter((a, i) => !a.startsWith('--') && !argv[i - 1]?.match(/^--(width|height|scale|wait)$/))
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`)
  return i === -1 ? def : argv[i + 1]
}
if (!url || !out || !/^(https?|file):\/\//.test(url)) {
  console.error('Usage: node capture.mjs <http(s) or file:// url> <out.png> [--width 1440] [--height 900] [--scale 2] [--wait 8000] [--dark]')
  process.exit(1)
}

const candidates = {
  win32: [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(os.homedir(), 'AppData/Local/Google/Chrome/Application/chrome.exe'),
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ],
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  ],
  linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge', '/snap/bin/chromium'],
}
const browser = process.env.CHROME_PATH || (candidates[process.platform] ?? candidates.linux).find(existsSync)
if (!browser) {
  console.error('No Chrome, Edge or Chromium found. Install one, or set CHROME_PATH to its executable.')
  process.exit(2)
}

const target = path.resolve(out)
const args = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${path.join(os.tmpdir(), 'pp-capture-profile')}`,
  `--force-device-scale-factor=${flag('scale', '2')}`,
  `--window-size=${flag('width', '1440')},${flag('height', '900')}`,
  `--virtual-time-budget=${flag('wait', '8000')}`,
  `--screenshot=${target}`,
]
if (argv.includes('--dark')) args.push('--force-dark-mode', '--blink-settings=preferredColorScheme=0')
else args.push('--blink-settings=preferredColorScheme=1')
args.push(url)

try {
  execFileSync(browser, args, { stdio: 'ignore', timeout: 90_000 })
} catch (e) {
  // Chrome sometimes exits non-zero after writing the file; check the result below.
  if (!existsSync(target)) throw e
}
if (!existsSync(target) || statSync(target).size === 0) {
  console.error('Capture failed: no screenshot written.')
  process.exit(3)
}
console.log('wrote', target)
