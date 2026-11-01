import { useEffect } from "react";
import TextField from "../../../../common/components/form/TextField";
import {
  useRentalVerification,
  type RentalVerificationCredentials,
  type VerificationMethod,
} from "../../hooks/useRentalVerification";
import {
  Wrapper,
  VerificationButton,
  CodeReveal,
  RevealClip,
  CodeContent,
  Feedback,
} from "./ContactVerificationField.styles";

type ContactVerificationFieldProps = {
  method: VerificationMethod;
  onVerified?: (credentials: RentalVerificationCredentials) => void;
  onVerificationChange?: (
    credentials: RentalVerificationCredentials | null,
  ) => void;
};

const ContactVerificationField = ({
  method,
  onVerified,
  onVerificationChange,
}: ContactVerificationFieldProps) => {
  const verification = useRentalVerification(method, onVerified);
  const isPhone = method === "phone";

  useEffect(() => {
    onVerificationChange?.(verification.credentials);
    return () => onVerificationChange?.(null);
  }, [verification.credentials, onVerificationChange]);

  return (
    <Wrapper>
      <TextField
        label={isPhone ? "연락처" : "이메일"}
        name={isPhone ? "phoneNumber" : "email"}
        hint={isPhone ? "숫자만 적어주세요" : undefined}
        type={isPhone ? "tel" : "email"}
        inputMode={isPhone ? "numeric" : "email"}
        autoComplete={isPhone ? "tel-national" : "email"}
        placeholder={isPhone ? "01012345678" : "retrivr@gmail.com"}
        required
        value={verification.contact}
        disabled={verification.isBusy}
        readOnly={verification.isVerified}
        onChange={(event) => verification.changeContact(event.target.value)}
        trailingAction={
          <VerificationButton
            type="button"
            $variant={verification.hasSentCode ? "outline" : "solid"}
            disabled={!verification.canSend}
            onClick={() => void verification.sendCode()}
          >
            {verification.isSending
              ? "전송 중"
              : verification.hasSentCode
                ? "재전송"
                : "인증번호 전송"}
          </VerificationButton>
        }
      />
      <CodeReveal
        $open={verification.hasSentCode}
        aria-hidden={!verification.hasSentCode}
        inert={!verification.hasSentCode}
      >
        <RevealClip>
          <CodeContent $open={verification.hasSentCode}>
            <TextField
              label="인증번호"
              hideLabel
              name={`${method}VerificationCode`}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="인증번호 6자리"
              pattern="[0-9]{6}"
              maxLength={6}
              value={verification.code}
              disabled={!verification.hasSentCode || verification.isBusy}
              readOnly={verification.isVerified}
              onChange={(event) => verification.changeCode(event.target.value)}
              trailingAction={
                <VerificationButton
                  type="button"
                  $variant="solid"
                  disabled={!verification.canVerify}
                  onClick={() => void verification.verifyCode()}
                >
                  {verification.isVerified
                    ? "인증 완료"
                    : verification.isVerifying
                      ? "확인 중"
                      : "인증번호 확인"}
                </VerificationButton>
              }
            />
          </CodeContent>
        </RevealClip>
      </CodeReveal>
      {verification.error && (
        <Feedback role="alert" $error>
          {verification.error}
        </Feedback>
      )}
      {verification.isVerified && (
        <Feedback role="status">인증이 완료되었습니다.</Feedback>
      )}
    </Wrapper>
  );
};

export default ContactVerificationField;
