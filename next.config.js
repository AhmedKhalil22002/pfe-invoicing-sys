const { i18n } = require('./next-i18next.config.js');
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  i18n,
  compiler: {
    styledComponents: true
  }
};

module.exports = nextConfig;
