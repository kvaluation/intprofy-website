import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Image from 'next/image'

const config: DocsThemeConfig = {
  logo: <Image src="/intprofy_logo.png" alt="株式会社知的利益" width={52} height={24}/>,
  project: {
    link: 'https://github.com/kvaluation/intprofy-website',
  },
  docsRepositoryBase: 'https://github.com/kvaluation/intprofy-website',
  footer: {
    text: 'Copyright Intprofy Corp. ©',
  },
}

export default config
