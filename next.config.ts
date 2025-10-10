import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript 빌드 에러 무시
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint 빌드 에러 무시
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Vercel 배포 최적화
  output: "standalone",

  // 이미지 최적화
  images: {
    unoptimized: true,
  },

  // 웹팩 설정
  webpack: (config, { isServer }) => {
    // 외부 라이브러리 처리
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // SQLite 관련 설정
    config.externals = config.externals || [];
    config.externals.push({
      "better-sqlite3": "commonjs better-sqlite3",
      bcrypt: "commonjs bcrypt",
    });

    return config;
  },
};

export default nextConfig;
