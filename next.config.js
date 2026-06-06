/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // این یعنی اجازه بده از هر سایتی عکس لود بشه
      },
    ],
  },
};

module.exports = nextConfig;
