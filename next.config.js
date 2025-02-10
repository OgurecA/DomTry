/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BIK_AUTH: process.env.BIK_AUTH,
    KRISA_AUTH: process.env.KRISA_AUTH,
    DRAGON_AUTH: process.env.DRAGON_AUTH,
  },
};

module.exports = nextConfig;
