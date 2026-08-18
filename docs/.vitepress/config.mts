import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { DefaultTheme } from 'vitepress'

const docsDir = join(process.cwd(), 'docs')

function pageTitle(file: string, fallback: string): string {
  const m = readFileSync(file, 'utf8').match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : fallback
}

function listPages(dir: string): DefaultTheme.SidebarItem[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith('.md') && e.name !== 'index.md')
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'))
    .map(e => ({
      text: pageTitle(join(dir, e.name), e.name.replace(/\.md$/, '')),
      link: '/' + relative(docsDir, join(dir, e.name)).replace(/\.md$/, ''),
    }))
}

function listCategories(): (DefaultTheme.SidebarItem & { link: string })[] {
  return readdirSync(docsDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'))
    .map(dir => {
      const dirPath = join(docsDir, dir.name)
      const pages = listPages(dirPath)
      const indexPath = join(dirPath, 'index.md')
      const indexLink =
        '/' + relative(docsDir, indexPath).replace(/\.md$/, '').replace(/\/index$/, '/')
      return {
        text: dir.name,
        link: existsSync(indexPath) ? indexLink : pages[0]?.link ?? '/',
        items: pages,
      }
    })
    .filter(c => c.items.length > 0)
}

const topPages = listPages(docsDir)
const sidebar: DefaultTheme.SidebarItem[] = [
  ...(topPages.length > 0 ? [{ text: 'Top', items: topPages }] : []),
  ...listCategories(),
]

const nav: DefaultTheme.NavItem[] = sidebar.map(c => ({
  text: c.text,
  link: c.link ?? c.items[0].link,
}))

export default defineConfig({
  title: '俺的ぶいちゃ改変備忘録',
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
