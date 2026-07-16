import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import Button from "../../components/Button";
import CustomCheckBox from "../../components/CustomCheckbox";
import { useAdminProfile } from "../../hooks/queries/useAuthQueries";
import type { WithdrawReasonCode } from "../../api/auth/auth.type";

const NOTICE_ITEMS = [
  {
    before: "계정 정보 및 이용 내역이 ",
    highlight: "모두 삭제",
    after: "됩니다.",
  },
  {
    before: "보유 중인 이용권 및 혜택은 ",
    highlight: "복구되지 않습니다.",
    after: "",
  },
  {
    before: "삭제된 정보는 재가입 후에도 ",
    highlight: "복원할 수 없습니다.",
    after: "",
  },
] as const;

const WITHDRAW_REASONS: { code: WithdrawReasonCode; label: string }[] = [
  { code: "ORG_CLOSED", label: "조직(동아리/기관/팀)이 해체되었어요" },
  {
    code: "NO_LONGER_OPERATING",
    label: "물품 대여 업무를 더 이상 운영하지 않아요",
  },
  { code: "MOVED_SERVICE", label: "다른 서비스로 이전했어요" },
  { code: "PRIVACY_CONCERN", label: "개인정보 및 보안이 걱정돼요" },
  { code: "INCONVENIENT", label: "서비스 사용이 불편했어요" },
  { code: "LACKING_FEATURES", label: "원하는 기능이 부족했어요" },
  { code: "INFREQUENT_USE", label: "자주 사용하지 않게 되었어요" },
  { code: "OTHER", label: "기타" },
];

type WithdrawStep = 1 | 2;

const StepIndicator = ({ step }: { step: WithdrawStep }) => {
  const circle = (n: WithdrawStep) => {
    const active = step === n;
    return (
      <div
        className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-10px font-bold ${
          active
            ? "bg-primary text-neutral-white"
            : "bg-[#E8EEF3] text-[#CDD6DE]"
        }`}
      >
        {n}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center gap-1.5">
      {circle(1)}
      <img
        src="/icons/right-arrow2.svg"
        alt=""
        className="h-2.5 w-1.5 opacity-40"
      />
      {circle(2)}
    </div>
  );
};

const WithdrawPage = () => {
  const navigate = useNavigate();
  const { data: profile } = useAdminProfile();
  const [step, setStep] = useState<WithdrawStep>(1);

  const [agreedToWarning, setAgreedToWarning] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<
    Set<WithdrawReasonCode>
  >(new Set());
  const [otherReason, setOtherReason] = useState("");

  const [password, setPassword] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const email = profile?.email ?? "";

  const canGoNext = useMemo(() => {
    if (!agreedToWarning || selectedReasons.size === 0) return false;
    if (selectedReasons.has("OTHER") && !otherReason.trim()) return false;
    return true;
  }, [agreedToWarning, selectedReasons, otherReason]);

  const toggleReason = (code: WithdrawReasonCode) => {
    setSelectedReasons((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
        if (code === "OTHER") setOtherReason("");
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const handleVerifyPassword = () => {
    // UI 단계: 비밀번호 입력값이 있으면 확인 완료로 표시 (API 연동은 후속)
    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    setIsPasswordVerified(true);
  };

  const handleWithdraw = () => {
    if (!isPasswordVerified) {
      alert("비밀번호를 먼저 확인해주세요.");
      return;
    }
    // UI 단계: 탈퇴 API 호출은 후속 작업
    alert("탈퇴하기 UI까지 연결되었습니다. (API 연동 예정)");
  };

  return (
    <Layout>
      <Header
        name="계정관리"
        pageName="탈퇴하기"
        onBackClick={() => {
          if (step === 2) {
            setStep(1);
            setIsPasswordVerified(false);
            setPassword("");
            return;
          }
          navigate("/account");
        }}
      />

      <div className="flex w-full flex-1 flex-col items-center px-8 pb-8 font-[Pretendard] text-neutral-gray-1">
        <div className="mt-7">
          <StepIndicator step={step} />
        </div>

        <div className="mt-6 flex w-full max-w-[338px] flex-col items-center">
          <h1 className="text-center text-16px font-bold text-secondary-1">
            Retrivr 회원 탈퇴
          </h1>

          {step === 1 ? (
            <p className="mt-2 text-center text-12px font-normal leading-[130%] text-neutral-gray-3">
              탈퇴하시면 회원정보가 모두 삭제되고 복구하실 수 없습니다
            </p>
          ) : (
            <p className="mt-2 text-center text-12px font-normal leading-[130%] text-neutral-gray-3">
              본인 확인을 위해 비밀번호를 다시 한 번 확인합니다.
              <br />
              본인확인 후 최종 회원탈퇴가 가능합니다.
            </p>
          )}
        </div>

        {step === 1 ? (
          <>
            {/* 탈퇴 유의사항 */}
            <div className="relative mt-6 w-full max-w-[338px] rounded-2xl bg-[#F8F9F9] px-6 py-5 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]">
              <p className="text-center text-14px font-bold leading-5">
                탈퇴 유의사항
              </p>
              <ul className="mt-3.5 flex flex-col gap-1.5">
                {NOTICE_ITEMS.map((item) => (
                  <li
                    key={item.highlight}
                    className="text-12px font-medium leading-[130%]"
                  >
                    ∙ {item.before}
                    <span className="font-bold">{item.highlight}</span>
                    {item.after}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="mt-4 flex w-full max-w-[338px] cursor-pointer items-center gap-1.5 text-left"
              onClick={() => setAgreedToWarning((prev) => !prev)}
            >
              {/* label로 감싸면 hidden input과 onClick이 이중 토글되어 체크가 안 보임 */}
              <CustomCheckBox checked={agreedToWarning} />
              <span className="text-12px font-bold leading-none">
                유의사항을 모두 확인하였으며, 이에 동의합니다.
                <span className="text-14px text-primary"> *</span>
              </span>
            </button>

            <div className="mt-4 w-full max-w-[338px] border-t border-neutral-gray-4/40" />

            {/* 탈퇴 사유 */}
            <div className="mt-4 w-full max-w-[338px] px-2.5">
              <p className="flex items-center text-14px font-bold leading-5">
                탈퇴 사유
                <span className="text-primary">*</span>
              </p>
              <p className="mt-0.5 text-11px font-normal leading-[130%] text-black/40">
                중복 선택이 가능합니다.
              </p>
            </div>

            <div className="mt-3 w-full max-w-[338px] rounded-2xl bg-neutral-white px-6 py-6 shadow-[0_0_16px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col gap-2.5">
                {WITHDRAW_REASONS.map((reason) => {
                  const checked = selectedReasons.has(reason.code);
                  const isOther = reason.code === "OTHER";
                  return (
                    <div key={reason.code} className="flex flex-col gap-2">
                      <button
                        type="button"
                        className="flex items-center gap-3 text-left cursor-pointer"
                        onClick={() => toggleReason(reason.code)}
                      >
                        <CustomCheckBox checked={checked} />
                        <span className="text-12px font-medium">
                          {reason.label}
                        </span>
                      </button>
                      {isOther && checked && (
                        <input
                          type="text"
                          value={otherReason}
                          onChange={(e) => setOtherReason(e.target.value)}
                          placeholder="기타 탈퇴사유를 입력해주세요"
                          className="w-full border-b border-neutral-gray-4 bg-transparent px-1 py-1.5 text-12px font-normal text-neutral-gray-1 outline-none placeholder:text-neutral-gray-3"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 w-full max-w-[338px]">
              <Button
                variant="primary"
                size="lg"
                className="h-12.5 max-w-none rounded-[23px] shadow-[0_0_16px_rgba(181,244,255,0.5)] disabled:shadow-none"
                disabled={!canGoNext}
                onClick={() => setStep(2)}
              >
                <span className="flex items-center gap-1.5">
                  다음으로
                  <img
                    src="/icons/client/left-arrow-white.svg"
                    alt=""
                    className="h-3 w-1.5 rotate-180"
                  />
                </span>
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* 비밀번호 재확인 */}
            <div className="mt-8 flex w-full max-w-[338px] flex-col gap-2.5">
              <p className="flex items-center text-14px font-bold">
                비밀번호 재확인
                <span className="text-primary">*</span>
              </p>

              <div className="flex h-12 items-center rounded-xl bg-[#F8F9F9] px-3.5 text-14px font-semibold text-neutral-gray-3">
                {email || "이메일 불러오는 중…"}
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsPasswordVerified(false);
                  }}
                  placeholder="비밀번호 입력"
                  className="h-12 w-[234px] shrink-0 rounded-xl bg-[#F8F9F9] px-3.5 text-14px font-normal text-neutral-gray-1 outline-none placeholder:text-neutral-gray-3"
                />
                <button
                  type="button"
                  onClick={handleVerifyPassword}
                  className="flex h-11.5 w-25 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-primary text-14px font-semibold text-neutral-white hover:bg-secondary-2"
                >
                  확인
                </button>
              </div>

              {isPasswordVerified && (
                <div className="flex items-center gap-1 text-12px font-normal leading-[140%] text-primary">
                  <CustomCheckBox checked disabled />
                  <span>비밀번호가 확인되었어요!</span>
                </div>
              )}
            </div>

            <div className="mt-auto w-full max-w-[338px] pt-20">
              <Button
                variant="primary"
                size="lg"
                className="h-12.5 max-w-none rounded-[23px] shadow-[0_0_16px_rgba(181,244,255,0.5)] disabled:shadow-none"
                disabled={!isPasswordVerified}
                onClick={handleWithdraw}
              >
                탈퇴하기
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default WithdrawPage;
