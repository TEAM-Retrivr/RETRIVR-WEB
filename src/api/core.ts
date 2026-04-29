import axios from "axios";

export const apiClient = axios.create({
  // 모든 환경에서 상대 경로(/api)로 요청하고
  // 환경별 라우팅은 Vite proxy/Vercel rewrite가 담당합니다.
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});
// 로그인 성공 시 : 토큰을 매 요청마다 자동으로 헤더에 넣어주는 설정(인터셉터)
apiClient.interceptors.request.use(
  (config) => {
    const requestUrl = config.url ?? "";
    const isPublicApi =
      requestUrl.startsWith("/api/public/") ||
      requestUrl.includes("://") && requestUrl.includes("/api/public/");

    if (isPublicApi) {
      if (config.headers?.Authorization) {
        delete config.headers.Authorization;
      }
      return config;
    }

    const accessToken = localStorage.getItem("accessToken");
    // 리프레시 토큰이 지금 당장 쓰이지 않으므로 일단 주석 처리
    // const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
