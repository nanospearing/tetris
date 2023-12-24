/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
      },
    basePath: '/tetris',
}

module.exports = nextConfig
