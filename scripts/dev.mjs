import { spawn, execFile } from 'node:child_process'
import { watch } from 'node:fs'
import { join } from 'node:path'

const docsDir = join(process.cwd(), 'docs')
const VITEPRESS_BIN = 'node_modules/vitepress/bin/vitepress.js'

let child = null
let restarting = false
let timer = null

function generateCategories() {
  return new Promise(resolve => {
    execFile(process.execPath, [join(process.cwd(), 'scripts/generate-categories.mjs')], e =>
      e ? console.error('generate-categories failed:', e) : null,
    ).on('exit', () => resolve())
  })
}

function spawnDev() {
  child = spawn(process.execPath, [VITEPRESS_BIN, 'dev', 'docs'], { stdio: 'inherit' })
  child.on('exit', code => {
    if (!restarting && code !== 0) {
      console.error(`vitepress exited with code ${code}; restarting in 1s...`)
      setTimeout(spawnDev, 1000)
    }
  })
}

function restart() {
  if (restarting || !child) return
  restarting = true
  console.log('\n[docs watch] structure changed, regenerating + restarting dev server...')
  const old = child
  child = null
  old.kill('SIGTERM')
  old.on('exit', () => {
    generateCategories().then(() => {
      spawnDev()
      restarting = false
    })
  })
}

generateCategories().then(spawnDev)

watch(docsDir, { recursive: true }, (event, filename) => {
  if (!filename || restarting) return
  if (filename.startsWith('.vitepress') || filename.startsWith('..')) return
  if (!filename.endsWith('.md') || filename.endsWith('index.md')) return
  if (event !== 'rename') return
  clearTimeout(timer)
  timer = setTimeout(restart, 500)
})

process.on('SIGINT', () => {
  child?.kill('SIGINT')
  process.exit(0)
})
process.on('SIGTERM', () => {
  child?.kill('SIGTERM')
  process.exit(0)
})