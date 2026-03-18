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
            // 403 방지: 브라우저가 보낸 Origin(localhost:5173)이 백엔드에서 거부될 수 있어
            // 프록시 단에서 타깃 origin으로 맞춰서 전달합니다.
            proxy.on("proxyReq", (proxyReq) => {
              const baseUrl = proxyTarget;
              const targetUrl = new URL(baseUrl);
              proxyReq.setHeader("Origin", targetUrl.origin);
            });
          },
        },
      },
    },
  };
});
