import { useMutation } from "@tanstack/react-query";
import { sendEmailCode, verifyEmailCode } from "../../api/auth/auth.api";

//
// 1. 회원가입용 이메일 인증 코드 전송
//
export const useSendEmailCode = () => {
  return useMutation({
    mutationFn: sendEmailCode,
    onSuccess: () => {
      // 성공 시 백엔드에서 보내준 메시지를 활용 가능
      // 예: alert(data.message) 또는 토스트(Toast) 알림 띄우기
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
