import { useState, useEffect } from "react";
import {
  useSendEmailCode,
  useVerifyEmailCode,
} from "../../hooks/queries/useAuthQueries";
import { Layout } from "../../components/Layout";
import CommonInput from "../../components/CommonInput";
import Button from "../../components/Button";

// 관리자 회원가입 페이지
const RegisterPage = () => {
  {
    /* 이메일 관련 */
  }

  // 이메일: string
  const [email, setEmail] = useState("");

  const { mutate: sendCode, isPending } = useSendEmailCode();

  // 이메일 전송 API 요청 핸들러
  const handleSendCode = () => {
    if (!email) return alert("이메일을 입력해주세요.");

    // API 요청 실행
    sendCode(
      { email, purpose: "SIGNUP" },
      {
        onSuccess: (data) => {
          // 예: data.expiresInSeconds 사용
          alert("이메일로 인증 코드가 전송되었습니다.");
          setTimeLeft(data.expiresInSeconds);
          setIsTimerActive(true);
        },
      },
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  {
    /* 인증 코드 관련 */
  }

  // 인증코드: number
  const [authCode, setAuthCode] = useState("");

  // 인증이 최종적으로 완료되었는지에 대한 여부
  const [isVerified, setIsVerified] = useState(false);

  const { mutate: verifyCode, isPending: isVerifying } = useVerifyEmailCode();

  // 인증 코드 검증 API 요청 핸들러
  const handleVerifyCode = () => {
    if (!authCode) return alert("인증번호를 입력해주세요.");

    verifyCode(
      { email, code: authCode, purpose: "SIGNUP" }, // 이메일과 인증번호를 함께 백엔드로 전달
      {
        onSuccess: () => {
          alert("이메일 인증이 완료되었습니다.");
          setIsTimerActive(false); // 성공 시 타이머 정지
          setIsVerified(true); // 인증 완료 상태로 변경
        },
        onError: () => {
          alert("인증번호가 올바르지 않거나 만료되었습니다.");
        },
      },
    );
  };

  // 인증 유효시간: 현재 600초로 설정
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  // 타이머 useEffect
  useEffect(() => {
    if (!isTimerActive) return;
    if (timeLeft <= 0) {
      setIsTimerActive(false);
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isTimerActive, timeLeft]);

  return (
    <Layout>
      {/* 헤더 영역 - 헤더 컴포넌트 제작 후 대체 예정 */}
      <div className="w-full h-28 text-center">헤더 영역</div>
      {/* 회원가입 영역 - 이름, 이메일, 비밀번호, 비밀번호 확인, 관리자 코드 */}
      <div className="flex flex-col items-center w-full gap-8 px-8">
        {/* 이름(단체명) 영역 */}
        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="inline text-[0.875rem] font-bold leading-none">
              이름(단체명)
            </p>
            <p className="inline text-primary">*</p>
          </div>
          <p className="text-neutral-3 text-[0.75rem] font-normal leading-none">
            공식 명칭을 사용해주세요. ex)리턴즈(X), 00학생회(O)
          </p>
          <CommonInput placeholder="한국대 학생회"></CommonInput>
        </div>
        {/* 이메일 영역 */}
        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="inline text-[0.875rem] font-bold leading-none">
              이메일
            </p>
            <p className="inline text-primary leading-none">*</p>
          </div>
          {/* 이메일 입력 영역 */}
          <div className="flex justify-between">
            <CommonInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="retrivr@gmail.com"
              disabled={isVerified} // 인증 성공 시 이메일 변경 불가
            ></CommonInput>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSendCode}
              disabled={isPending || isVerified} // 인증 완료 시 버튼 비활성화
            >
              {isPending ? "전송 중 ..." : "인증번호 전송"}
            </Button>
          </div>
          {/* 인증 번호 확인 영역 */}
          <div className="flex justify-between relative">
            <CommonInput
              placeholder="인증번호 입력"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              disabled={!isTimerActive || isVerified} // 타이머가 끝났거나 인증 완료 시 입력 불가
            />
            {/* 남은 시간 표시 */}
            <span
              className="absolute 
            top-4.5 right-30 ml-2 w-14 text-right text-primary text-14px leading-none"
            >
              {isTimerActive && timeLeft > 0 ? formatTime(timeLeft) : ""}
            </span>
            {/* 인증 코드 확인 버튼 */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleVerifyCode}
              disabled={!isTimerActive || isVerifying || isVerified} // 타이머가 끝났거나 인증 중이거나 인증 완료 시 버튼 비활성화
            >
              {isVerifying ? "확인 중..." : "인증번호 확인"}
            </Button>
          </div>
        </div>
        {/* 비밀번호 영역 */}
        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="inline text-[0.875rem] font-bold leading-none">
              비밀번호
            </p>
            <p className="inline text-primary leading-none">*</p>
          </div>
          <CommonInput
            type="password"
            placeholder="비밀번호 입력"
          ></CommonInput>
        </div>
        {/* 비밀번호 확인 영역 */}
        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="inline text-[0.875rem] font-bold leading-none">
              비밀번호 확인
            </p>
            <p className="inline text-primary leading-none">*</p>
          </div>
          <CommonInput
            type="password"
            placeholder="비밀번호 재입력"
          ></CommonInput>
        </div>
        {/* 관리자 코드 영역*/}
        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="inline text-[0.875rem] font-bold leading-none">
              관리자 코드
            </p>
            <p className="inline text-primary leading-none">*</p>
          </div>
          <p className="text-neutral-3 text-[0.75rem] font-normal leading-none">
            물품 관리 등 중요할 때 쓰이는 코드로, 숫자만 입력 가능해요.
          </p>
          <CommonInput
            placeholder="010101"
            inputMode="numeric"
            pattern="[0-9]*"
          ></CommonInput>
        </div>
      </div>
      <div className="w-full flex flex-col items-center mt-auto mb-10">
        <Button variant="primary" size="lg">
          Retrivr 시작하기
        </Button>
      </div>
    </Layout>
  );
};

export default RegisterPage;
