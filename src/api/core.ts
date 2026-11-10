import axios from "axios";
import { hasValidAdminSession, invalidateAdminSession } from "../utils/adminSession";

const isProtectedAdminApi = (url: string) => {
  const pathname = new URL(url, window.location.origin).pathname;
  return (
    pathname.startsWith("/api/admin/") &&
    pathname !== "/api/admin/v1/auth/login" &&
    pathname !== "/api/admin/v1/auth/signup"
  );
};

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

    if (isProtectedAdminApi(requestUrl) && !hasValidAdminSession()) {
      invalidateAdminSession();
      throw new axios.CanceledError("관리자 세션이 만료되었습니다.");
    }

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 공개 API나 로그인 실패는 각 화면에서 처리하고, 관리자 세션의 401만 정리한다.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      isProtectedAdminApi(error.config?.url ?? "")
    ) {
      const currentToken = localStorage.getItem("accessToken");
      // 이전 세션의 늦은 응답이 새 로그인 세션을 지우지 않도록 확인한다.
      if (
        currentToken &&
        error.config?.headers?.Authorization === `Bearer ${currentToken}`
      ) {
        invalidateAdminSession();
      }
    }
    return Promise.reject(error);
  },
);
