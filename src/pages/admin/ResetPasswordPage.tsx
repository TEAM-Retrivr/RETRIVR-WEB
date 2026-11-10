import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import CommonInput from "../../components/CommonInput";
import Button from "../../components/Button";
import {
  useSendEmailCode,
  useVerifyEmailCode,
} from "../../hooks/queries/useAuthQueries";
import { isPasswordValid } from "../../utils/passwordValidation";
import { useState, useEffect } from "react";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasRequestedCode, setHasRequestedCode] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { mutate: sendEmailCode } = useSendEmailCode();
  const { mutate: verifyEmailCode } = useVerifyEmailCode();
  const isPasswordMatched =
    password.length > 0 && password === passwordConfirmation;
  const canSubmit =
    isVerified && isPasswordValid(password) && isPasswordMatched;

  // 이메일 코드 전송
  const handleSendCode = () => {
    if (!email.trim()) return alert("이메일을 입력해주세요.");
    setIsPending(true);
    sendEmailCode(
      { email },
      {
        onSuccess: () => {
          setIsPending(false);
          setHasRequestedCode(true);
          setIsTimerActive(true);
          setTimeLeft(180); // 3분
        },
        onError: () => {
          setIsPending(false);
        },
      },
    );
  };

  // 이메일 코드 검증
  const handleVerifyCode = () => {
    if (!authCode.trim()) return alert("인증번호를 입력해주세요.");
    setIsVerifying(true);
    verifyEmailCode(
      { email, authCode },
      {
        onSuccess: () => {
          setIsVerifying(false);
          setIsVerified(true);
          setIsTimerActive(false);
        },
        onError: () => {
          setIsVerifying(false);
        },
      },
    );
  };

  // 타이머 효과
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearTimeout(timer);
  }, [isTimerActive, timeLeft]);

  return (
    <Layout>
      <Header pageName="이메일 / 비밀번호 찾기" backTo="/login" />
      <div className="flex flex-col w-full h-screen items-center px-8">
        {/* 이메일 영역 */}
        <div className="flex flex-col w-full gap-2">
          <div className="pt-11 pb-4">
            <p className="inline text-20px text-neutral-gray-1 font-normal font-semibold leading-[140%]">
              이메일을 입력해주세요
            </p>
          </div>
          {/* 이메일 입력 영역 */}
          <div className="flex justify-between gap-1">
            <CommonInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="retrivr@gmail.com"
              disabled={isVerified} // 인증 성공 시 이메일 변경 불가
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendCode}
              disabled={
                email.trim() === "" || isPending || isVerified || isTimerActive
              } // 이메일 미입력 or 인증 완료 or 인증 코드 유효시간 남았을 때 버튼 비활성화
            >
              {isPending
                ? "전송 중 ..."
                : hasRequestedCode
                  ? "재전송"
                  : "인증번호 전송"}
            </Button>
          </div>
          {/* 인증 번호 확인 영역 */}
          <div className="flex justify-between relative pt-0.5 gap-1">
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
              {isTimerActive && timeLeft > 0 && timeLeft}
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
          {/* 비밀번호 재입력 영역 */}
          <div className="pt-19.5 text-neutral-gray-1">
            <p className="inline text-20px font-semibold leading-[140%]">
              비밀번호를 재설정 해주세요
            </p>
            <p className="pt-2 text-neutral-gray-3 text-12px font-normal leading-[130%]">
              영문자(대문자/소문자), 숫자, 특수문자를 포함한 8자 이상으로
              설정해주세요. 특수문자는 !@#$%^&*만 사용할 수 있어요.
            </p>
            <div className="flex flex-col w-full gap-6 pt-4">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-0.5">
                  <p className="inline text-14px font-bold leading-none pl-0.5">
                    비밀번호
                  </p>
                  <p className="inline text-primary">*</p>
                </div>
                <CommonInput
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호 입력"
                />
                {password.length > 0 && !isPasswordValid(password) ? (
                  <p className="text-12px text-secondary-2 pl-0.5">
                    영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요.
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-0.5">
                  <p className="inline text-14px font-bold leading-none pl-0.5">
                    비밀번호 확인
                  </p>
                  <p className="inline text-primary">*</p>
                </div>
                <CommonInput
                  type="password"
                  value={passwordConfirmation}
                  onChange={(event) =>
                    setPasswordConfirmation(event.target.value)
                  }
                  placeholder="비밀번호 재입력"
                />
                {passwordConfirmation.length > 0 && !isPasswordMatched ? (
                  <p className="text-12px text-secondary-2 pl-0.5">
                    비밀번호가 일치하지 않아요.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {/* 제출 버튼  */}
        <div className="w-full mt-auto mb-12">
          <Button size="lg" disabled={!canSubmit}>
            확인
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;
