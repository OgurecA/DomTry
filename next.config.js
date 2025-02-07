/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BIK_AUTH: process.env.BIK_AUTH,
    RAT_AUTH: process.env.RAT_AUTH,
    DRAGON_AUTH: process.env.DRAGON_AUTH,
  },
};

module.exports = nextConfig;
