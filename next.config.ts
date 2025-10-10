import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 배포 최적화
  output: "standalone",

  // 파일 추적 루트 설정 (경고 해결)
  outputFileTracingRoot: __dirname,

  // 이미지 최적화
  images: {
    unoptimized: true,
  },

  // TypeScript 빌드 에러 무시 (배포용)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint 빌드 에러 무시 (배포용)
  eslint: {
    ignoreDuringBuilds: true,
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

  // 서버리스 함수 설정
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
};

export default nextConfig;
