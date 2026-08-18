import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { DefaultTheme } from 'vitepress'

const docsDir = join(process.cwd(), 'docs')

function pageTitle(file: string, fallback: string): string {
  const m = readFileSync(file, 'utf8').match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : fallback
}

function listPages(dir: string, includeIndex = false): DefaultTheme.SidebarItem[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter(
      e => e.isFile() && e.name.endsWith('.md') && (includeIndex || e.name !== 'index.md'),
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'))
    .map(e => {
      const isIndex = e.name === 'index.md'
      const link =
        '/' + relative(docsDir, join(dir, e.name)).replace(/\.md$/, '') + (isIndex ? '/' : '')
      return {
        text: pageTitle(join(dir, e.name), e.name.replace(/\.md$/, '')),
        link,
      }
    })
}

function listCategories(): DefaultTheme.SidebarItem[] {
  return readdirSync(docsDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'))
    .map(dir => ({
      text: dir.name,
      items: listPages(join(docsDir, dir.name), true),
    }))
    .filter(c => c.items.length > 0)
}

const topPages = listPages(docsDir)
const sidebar: DefaultTheme.SidebarItem[] = [
  ...(topPages.length > 0 ? [{ text: 'Top', items: topPages }] : []),
  ...listCategories(),
]

const nav: DefaultTheme.NavItem[] = sidebar.map(c => ({
  text: c.text,
  link: c.items[0].link,
}))

export default defineConfig({
  title: 'VRC Knowledge',
  description: 'VRChat 関連の知見をまとめる個人メモ',
  lastUpdated: true,

  themeConfig: {
    nav,
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/frost-1256/vrc-knowledge' },
    ],
    editLink: {
      pattern: 'https://github.com/frost-1256/vrc-knowledge/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    search: {
      provider: 'local',
    },
  },
})