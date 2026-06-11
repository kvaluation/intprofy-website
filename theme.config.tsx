import React from 'react'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import Image from 'next/image'

const SITE_URL = 'https://www.intprofy.co.jp'
const DEFAULT_DESCRIPTION =
  '株式会社知的利益（Intprofy）。知的財産と利益デザインに関する考察と実務。'

const config: DocsThemeConfig = {
  logo: <Image src="/intprofy_logo.png" alt="株式会社知的利益" width={52} height={24}/>,
  project: {
    link: 'https://github.com/kvaluation/intprofy-website',
  },
  docsRepositoryBase: 'https://github.com/kvaluation/intprofy-website',
  footer: {
    text: 'Copyright Intprofy Corp. ©',
  },
  // Nextra デフォルトの head（"Nextra: the next docs builder" の description や
  // @shuding_ の twitter タグ）を上書きして消す。description/OGP は useNextSeoProps 側で出す。
  head: (
    <>
      <meta httpEquiv="Content-Language" content="ja" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="icon" type="image/png" href="/intprofy_logo.png" />
    </>
  ),
   useNextSeoProps() {
    const { asPath } = useRouter()
    const { frontMatter } = useConfig()
    // クエリ・ハッシュを除いた正規URL（重複・正規ページ未選択の対策）
    const path = asPath.split(/[?#]/)[0]
    const canonical = `${SITE_URL}${path === '/' ? '' : path}`
    const description =
      (frontMatter as { description?: string }).description || DEFAULT_DESCRIPTION
    return {
      // %s は各ページのタイトルに置き換わる
      titleTemplate: '%s - 株式会社知的利益',
      canonical,
      description,
      openGraph: {
        type: 'website',
        url: canonical,
        description,
        siteName: '株式会社知的利益',
        images: [{ url: `${SITE_URL}/intprofy_logo.png` }],
      },
    }
  },
}

export default config
