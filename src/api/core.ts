import axios from "axios";

export const apiClient = axios.create({
  // 프록시를 타야 하므로 baseURL을 비워두기
  // 배포 이후에 확인 필요
  baseURL:
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_BASE_URL
      : "",
  headers: {
    "Content-Type": "application/json",
  },
});
// 로그인 성공 시 : 토큰을 매 요청마다 자동으로 헤더에 넣어주는 설정(인터셉터)
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
