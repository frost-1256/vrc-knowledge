import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'VRC Knowledge',
  description: 'VRChat 関連の知見をまとめる個人メモ',
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'cat01', link: '/cat01/test01' },
      { text: 'cat02', link: '/cat02/test02' },
    ],
    sidebar: [
      {
        text: 'cat01',
        items: [
          { text: 'test01', link: '/cat01/test01' },
        ],
      },
      {
        text: 'cat02',
        items: [
          { text: 'test02', link: '/cat02/test02' },
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