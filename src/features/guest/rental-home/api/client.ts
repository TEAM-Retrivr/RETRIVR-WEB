import axios from "axios";

// Renewal 전용. 운영 페이지의 인터셉터/저장된 로그인 토큰을 공유하지 않는다.
// 상대 경로는 기존 Vite proxy / Vercel rewrite를 사용한다.
export const rentalHomeClient = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});
