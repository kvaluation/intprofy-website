module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.intprofy.co.jp',
  generateRobotsTxt: true,
  exclude: ['/api/*', '/_next/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}