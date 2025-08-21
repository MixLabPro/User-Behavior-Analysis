/** @type {import('next').NextConfig} */
const nextConfig = {
    // Next.js 14 默认启用 App Router，无需显式配置

    // ESLint 配置
    eslint: {
        // 在生产构建时忽略 ESLint 错误
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig