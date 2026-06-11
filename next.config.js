const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra({
  // 旧URL（サイト改装前）→ 現行URL への 301 リダイレクト。
  // GSC の「見つかりませんでした（404）」を解消し、旧リンクの評価を引き継ぐ。
  async redirects() {
    return [
      // documentation → framework へ改称
      { source: '/documentation', destination: '/framework', permanent: true },
      { source: '/documentation/definition', destination: '/framework/definition', permanent: true },
      { source: '/documentation/exchange', destination: '/framework/exchange', permanent: true },
      // about → KenjiSuzuki へ改称
      { source: '/about', destination: '/KenjiSuzuki', permanent: true },
      // 旧ブログのスラッグ改称・削除
      { source: '/blogs/blog20250105', destination: '/blogs/blog20251201', permanent: true },
      { source: '/blogs/blog20250106', destination: '/blogs', permanent: true },
      // Nextra テンプレートの残骸ページ
      { source: '/advanced', destination: '/', permanent: true },
      { source: '/advanced/satori', destination: '/', permanent: true },
      { source: '/another', destination: '/', permanent: true },
    ]
  },
})
