import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/ptc/:path*", // 프록시 경로
                // destination: "https://asre.cheilelec.com/api/:path*", // API 서버 URL
                // destination: "http://localhost:8000/:path*",
                // destination: "http://3.25.237.8:8000/:path*",
                destination: "http://13.54.93.233:8000/:path*",
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    webpack: (config) => {
        // SVG 파일 처리
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
        });

        // 폰트 파일 처리
        config.module.rules.push({
            test: /\.(woff|woff2|eot|ttf|otf)$/i, // 폰트 파일 확장자
            type: "asset/resource", // 파일을 로드하는 방법
            generator: {
                filename: "fonts/[name][hash][ext][query]", // 폰트 파일 경로 설정
            },
        });

        return config;
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/login",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
