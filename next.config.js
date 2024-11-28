const { i18n } = require('./next-i18next.config.js');
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  i18n,
  redirects: () => [
    {
      source: '/settings/account',
      destination: '/settings/account/profile',
      permanent: true
    },
    {
      source: '/settings/system',
      destination: '/settings/system/activity',
      permanent: true
    },
    {
      source: '/settings/pdf',
      destination: '/settings/pdf/live',
      permanent: true
    }
  ]
};

module.exports = nextConfig;
