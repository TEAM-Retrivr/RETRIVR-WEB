import { useMutation, useQuery } from "@tanstack/react-query";
import {
  sendEmailCode,
  verifyEmailCode,
  sendPhoneVerificationCode,
  verifyPhoneVerificationCode,
  requestRegisteration,
  requestLogin,
  requestLogout,
  requestWithdraw,
  requestLoadHome,
  requestAdminProfile,
  sendAdminEmailCode,
  verifyAdminEmailCode,
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
// 2-1. 휴대폰 인증 코드 발송
//
export const useSendPhoneVerificationCode = () => {
  return useMutation({
    mutationFn: sendPhoneVerificationCode,
    onSuccess: () => {
      console.log("휴대폰 인증 코드 발송 성공");
    },
    onError: (error: any) => {
      console.log("휴대폰 인증 코드 발송 실패", error);
    },
  });
};

//
// 2-2. 휴대폰 인증 코드 검증
//
export const useVerifyPhoneVerificationCode = () => {
  return useMutation({
    mutationFn: verifyPhoneVerificationCode,
    onSuccess: () => {
      console.log("휴대폰 인증 코드 검증 성공");
    },
    onError: (error: any) => {
      console.log("휴대폰 인증 코드 검증 실패", error);
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

//
// 5. 로그아웃 요청
//
export const useLogout = () => {
  return useMutation({
    mutationFn: requestLogout,
    onSuccess: () => {
      console.log("로그아웃 요청 성공");
    },
    onError: (error: any) => {
      console.log("로그아웃 요청 실패", error);
    },
  });
};

//
// 5-1. 회원 탈퇴 요청
//
export const useWithdraw = () => {
  return useMutation({
    mutationFn: requestWithdraw,
    onSuccess: () => {
      console.log("회원 탈퇴 요청 성공");
    },
    onError: (error: any) => {
      console.log("회원 탈퇴 요청 실패", error);
    },
  });
};

//
// 6. 홈 화면 출력 요청
//
export const useLoadHome = () => {
  return useQuery({
    queryKey: ["home"],
    queryFn: requestLoadHome,
    retry: false,
  });
};

//
// 7. 관리자 프로필 조회 요청
//
export const useAdminProfile = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["adminProfile"],
    queryFn: requestAdminProfile,
    retry: false,
    enabled: options?.enabled ?? true,
  });
};

//
// 7-1. 관리자 이메일 인증 코드 발송 요청
//
export const useSendAdminEmailCode = () => {
  return useMutation({
    mutationFn: sendAdminEmailCode,
    onSuccess: () => {
      console.log("관리자 이메일 인증 코드 발송 성공");
    },
    onError: (error) => {
      console.error("관리자 이메일 인증 코드 발송 실패:", error);
    },
  });
};

//
// 7-2. 관리자 이메일 인증 코드 검증 요청
//
export const useVerifyAdminEmailCode = () => {
  return useMutation({
    mutationFn: verifyAdminEmailCode,
    onSuccess: () => {
      console.log("관리자 이메일 인증 코드 검증 성공");
    },
    onError: (error) => {
      console.error("관리자 이메일 인증 코드 검증 실패:", error);
    },
  });
};
