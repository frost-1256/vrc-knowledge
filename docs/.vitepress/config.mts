import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'VRC Knowledge',
  description: 'VRChat 関連の知見をまとめる個人メモ',
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Memo', link: '/memo/' },
    ],
    sidebar: [
      {
        text: 'Contents',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Memo', link: '/memo/' },
        ],
      },
    ],
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