import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const docsDir = join(process.cwd(), 'docs')

function pageTitle(file, fallback) {
  const m = readFileSync(file, 'utf8').match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : fallback
}

function isManualIndex(file) {
  return existsSync(file) && /manual:\s*true/.test(readFileSync(file, 'utf8'))
}

function listMarkdown(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith('.md') && e.name !== 'index.md')
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'))
    .map(e => ({
      file: join(dir, e.name),
      name: e.name,
      title: pageTitle(join(dir, e.name), e.name.replace(/\.md$/, '')),
    }))
}

function generateCategory(dir) {
  const categoryName = dir.name
  const dirPath = join(docsDir, categoryName)
  const indexPath = join(dirPath, 'index.md')
  if (isManualIndex(indexPath)) return
  const pages = listMarkdown(dirPath)
  const body = pages
    .map(p => `- [${p.title}](/${categoryName}/${p.name.replace(/\.md$/, '')})`)
    .join('\n')

  const content = `---
manual: false
---

# ${categoryName}

${body || '*記事はまだありません*'}

<sub>このページは自動生成されています。手動で編集しないでください。カスタマイズする場合は先頭に \`manual: true\` を追加してください。</sub>
`
  writeFileSync(indexPath, content, 'utf8')
}

readdirSync(docsDir, { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith('.'))
  .forEach(generateCategory)

console.log('generated category index pages')
