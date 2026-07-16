import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // 현재 환경(development)의 .env 파일을 불러옵니다.
  const env = loadEnv(mode, process.cwd());

  // 개발 환경에서는 CORS 회피를 위해 프록시가 백엔드로 전달
  // (브라우저는 항상 /api 상대경로로만 요청)
  // 기본은 https로 통신 (백엔드가 https 제공하는 경우)
  // 필요 시 .env.production 등의 VITE_API_BASE_URL로 덮어쓰기 가능
  const proxyTarget = env.VITE_API_BASE_URL || "https://retrivr-server.kr";

  return {
    plugins: [react()],
    server: {
      proxy: {
        // '/api'로 시작하는 요청을 가로채서 백엔드 주소로 보냅니다.
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          configure: (proxy) => {
            // 백엔드 Origin 허용 목록에 localhost:5173이 없어서
            // (로그아웃 등 Origin 검증이 있는 엔드포인트에서 403 "Origin is not allowed" 발생)
            // 허용 목록에 포함된 localhost:3000으로 맞춰서 전달합니다.
            // TODO: 백엔드가 localhost:5173을 허용하면 이 우회를 제거
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("Origin", "http://localhost:3000");
            });
          },
        },
      },
    },
  };
});
