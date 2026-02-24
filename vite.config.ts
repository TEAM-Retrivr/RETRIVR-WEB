import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // 현재 환경(development)의 .env 파일을 불러옵니다.
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        // '/api'로 시작하는 요청을 가로채서 백엔드 주소로 보냅니다.
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          configure: (proxy) => {
            // 403 방지: 브라우저가 보낸 Origin(localhost:5173)이 백엔드에서 거부될 수 있어
            // 프록시 단에서 타깃 origin으로 맞춰서 전달합니다.
            proxy.on("proxyReq", (proxyReq) => {
              const baseUrl = env.VITE_API_BASE_URL || "http://localhost:8080";
              const targetUrl = new URL(baseUrl);
              proxyReq.setHeader("Origin", targetUrl.origin);
            });
          },
        },
      },
    },
  };
});
