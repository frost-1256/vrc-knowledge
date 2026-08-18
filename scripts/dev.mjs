import { spawn, execFile } from 'node:child_process'
import { watch, statSync, utimesSync } from 'node:fs'
import { join } from 'node:path'

const docsDir = join(process.cwd(), 'docs')
const configPath = join(docsDir, '.vitepress', 'config.mts')
const VITEPRESS_BIN = 'node_modules/vitepress/bin/vitepress.js'

let timer = null

function generateCategories() {
  execFile(process.execPath, [join(process.cwd(), 'scripts/generate-categories.mjs')], e => {
    if (e) console.error('[docs watch] generate-categories failed:', e.message)
  })
}

function isCategoryChange(filename) {
  if (!filename || filename.startsWith('.vitepress') || filename.startsWith('..')) return false
  const base = filename.split('/').pop()
  if (base.includes('.')) return false
  try {
    return statSync(join(docsDir, filename)).isDirectory()
  } catch {
    return true
  }
}

function touchConfig() {
  const now = new Date()
  try {
    utimesSync(configPath, now, now)
    console.log('[docs watch] category structure changed, restarting dev server...')
  } catch (e) {
    console.error('[docs watch] could not touch config:', e.message)
  }
}

generateCategories()
spawn(process.execPath, [VITEPRESS_BIN, 'dev', 'docs'], { stdio: 'inherit' })

watch(docsDir, { recursive: true }, (event, filename) => {
  if (event !== 'rename' || !isCategoryChange(filename)) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    generateCategories()
    setTimeout(touchConfig, 300)
  }, 500)
})
