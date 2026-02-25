import { useMutation } from "@tanstack/react-query";
import {
  sendEmailCode,
  verifyEmailCode,
  requestRegisteration,
  requestLogin,
} from "../../api/auth/auth.api";

//
// useMutation: TanstackQuery(ReactQuery)에서 서버 상태를 변경(POST, PUT, DELETE 등)을 다룰 때 쓰는 hook
// 데이터를 가져오는 GET 요청일 땐 useQuery 사용
// 데이터를 변경하는 POST/PUT/DELETE 요청일 땐 useMutation
//
//

//
// 1. 회원가입용 이메일 인증 코드 전송
//
export const useSendEmailCode = () => {
  return useMutation({
    mutationFn: sendEmailCode,
    onSuccess: () => {
      // 성공 시 백엔드에서 보내준 메시지를 활용 가능
      console.log("이메일 발송 성공:");

      // data.expiresInSeconds (600)을 활용해 여기서부터 타이머 시작 가능
    },
    onError: (error) => {
      console.error("이메일 발송 실패:", error);
      // 에러 처리 로직 (예: 이미 가입된 이메일입니다 등)
    },
  });
};

//
// 2. 회원가입용 이메일 인증 코드 검증
//
export const useVerifyEmailCode = () => {
  return useMutation({
    mutationFn: verifyEmailCode,
    onSuccess: () => {
      console.log("인증 성공");
    },
    onError: (error: any) => {
      console.log("인증 실패", error);
    },
  });
};

//
// 3. 회원가입 요청
//
export const useRequestRegisteration = () => {
  return useMutation({
    mutationFn: requestRegisteration,
    onSuccess: () => {
      console.log("회원 가입 요청 성공");
    },
    onError: (error: any) => {
      console.log("회원가입 요청 실패", error);
    },
  });
};

//
// 4. 로그인 요청
//
export const useLogin = () => {
  return useMutation({
    mutationFn: requestLogin,
    onSuccess: () => {
      console.log("로그인 요청 성공");
    },
    onError: (error: any) => {
      console.log("로그인 요청 실패", error);
    },
  });
};
