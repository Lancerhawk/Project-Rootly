/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
            },
            {
                source: '/auth/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
