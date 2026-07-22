import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import Button from "../../components/Button";
import CustomCheckBox from "../../components/CustomCheckbox";
import WithdrawExitConfirmModal from "../../components/modals/admin/account/WithdrawExitConfirmModal";
import WithdrawPasswordMismatchModal from "../../components/modals/admin/account/WithdrawPasswordMismatchModal";
import WithdrawCompleteModal from "../../components/modals/admin/account/WithdrawCompleteModal";
import {
  useAdminProfile,
  useWithdraw,
} from "../../hooks/queries/useAuthQueries";
import type {
  WithdrawErrorResponse,
  WithdrawReasonCode,
} from "../../api/auth/auth.type";
import { WITHDRAW_ERROR_CODE } from "../../api/auth/auth.type";
import { resetPaymentMethodsStore } from "../../store/paymentMethodsStore";

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
    code: "NO_LONGER_OPERATING_RENTAL",
    label: "물품 대여 업무를 더 이상 운영하지 않아요",
  },
  { code: "MOVED_TO_OTHER_SERVICE", label: "다른 서비스로 이전했어요" },
  { code: "PRIVACY_CONCERN", label: "개인정보 및 보안이 걱정돼요" },
  { code: "SERVICE_UNSATISFIED", label: "서비스 사용이 불편했어요" },
  { code: "MISSING_FEATURE", label: "원하는 기능이 부족했어요" },
  { code: "LOW_USAGE", label: "자주 사용하지 않게 되었어요" },
  { code: "OTHER", label: "기타" },
];

type WithdrawStep = 1 | 2;
type SlideDirection = "forward" | "back";

const clearAdminSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("orgId");
  resetPaymentMethodsStore();
};

const hasAccessToken = () =>
  typeof window !== "undefined" && Boolean(localStorage.getItem("accessToken"));

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
  const queryClient = useQueryClient();
  const [isWithdrawComplete, setIsWithdrawComplete] = useState(false);
  /** onError 등 비동기 콜백에서 최신 탈퇴 완료 여부를 읽기 위한 ref */
  const isWithdrawCompleteRef = useRef(false);
  // 세션이 없거나 탈퇴 완료 후에는 프로필 API를 호출하지 않는다
  const { data: profile } = useAdminProfile({
    enabled: hasAccessToken() && !isWithdrawComplete,
  });
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw();

  const [step, setStep] = useState<WithdrawStep>(1);
  const [slideDirection, setSlideDirection] =
    useState<SlideDirection>("forward");
  // 첫 진입 시에는 슬라이드 없이, 단계 전환부터만 애니메이션
  const hasSteppedRef = useRef(false);

  const goToStep = (next: WithdrawStep) => {
    hasSteppedRef.current = true;
    setSlideDirection(next > step ? "forward" : "back");
    setStep(next);
  };

  const [agreedToWarning, setAgreedToWarning] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<
    Set<WithdrawReasonCode>
  >(new Set());
  const [otherReason, setOtherReason] = useState("");

  const [password, setPassword] = useState("");
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isPasswordMismatchOpen, setIsPasswordMismatchOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const email = profile?.email ?? "";

  const canGoNext = useMemo(() => {
    if (!agreedToWarning || selectedReasons.size === 0) return false;
    if (selectedReasons.has("OTHER") && !otherReason.trim()) return false;
    return true;
  }, [agreedToWarning, selectedReasons, otherReason]);

  const canWithdraw =
    password.trim().length > 0 && !isWithdrawing && !isWithdrawComplete;

  /** 완료 모달 확인(또는 닫기) 시 세션 정리 후 로그인으로 이동 */
  const finishWithdraw = () => {
    clearAdminSession();
    void queryClient.cancelQueries();
    setIsCompleteModalOpen(false);
    navigate("/login", { replace: true });
    queueMicrotask(() => {
      queryClient.clear();
    });
  };

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

  const handleWithdraw = () => {
    if (isWithdrawCompleteRef.current) return;
    if (!password.trim()) {
      setIsPasswordMismatchOpen(true);
      return;
    }

    const reasonCodes = Array.from(selectedReasons);
    withdraw(
      {
        password: password.trim(),
        reasonCodes,
        ...(selectedReasons.has("OTHER") && otherReason.trim()
          ? { otherReason: otherReason.trim() }
          : {}),
        agreedToWarning,
      },
      {
        onSuccess: () => {
          // 세션은 유지한 채 완료 모달만 띄운다. clear는 확인 클릭 시 수행.
          isWithdrawCompleteRef.current = true;
          setIsWithdrawComplete(true);
          setIsCompleteModalOpen(true);
        },
        onError: (error) => {
          if (isWithdrawCompleteRef.current) return;
          if (axios.isAxiosError(error)) {
            const data = error.response?.data as
              | WithdrawErrorResponse
              | undefined;
            if (data?.code === WITHDRAW_ERROR_CODE.PASSWORD_MISMATCH) {
              setIsPasswordMismatchOpen(true);
              return;
            }
            if (data?.message) {
              alert(data.message);
              return;
            }
          }
          alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

  return (
    <Layout>
      <Header
        name="계정관리"
        pageName="탈퇴하기"
        onBackClick={() => {
          if (isWithdrawComplete) {
            finishWithdraw();
            return;
          }
          if (step === 2) {
            goToStep(1);
            setPassword("");
            return;
          }
          setIsExitModalOpen(true);
        }}
      />

      <div className="flex w-full flex-1 flex-col items-center overflow-x-hidden px-8 pb-8 font-[Pretendard] text-neutral-gray-1">
        <div className="mt-7">
          <StepIndicator step={step} />
        </div>

        <div
          key={step}
          className={`flex w-full flex-1 flex-col items-center ${
            !hasSteppedRef.current
              ? ""
              : slideDirection === "forward"
                ? "animate-slide-in-from-right"
                : "animate-slide-in-from-left"
          }`}
        >
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
                  <span className="text-primary"> *</span>
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
                  onClick={() => goToStep(2)}
                >
                  <span className="flex items-center gap-1.5">다음으로</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* 비밀번호 재확인 — 입력값을 탈퇴 요청 바디로 전달 */}
              <div className="mt-8 flex w-full max-w-[338px] flex-col gap-2.5">
                <p className="flex items-center text-14px font-bold">
                  비밀번호 재확인
                  <span className="text-primary"> *</span>
                </p>

                <div className="flex h-12 items-center rounded-xl bg-[#F8F9F9] px-3.5 text-14px font-semibold text-neutral-gray-3">
                  {email || "이메일 불러오는 중…"}
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="h-12 w-full rounded-xl bg-[#F8F9F9] px-3.5 text-14px font-normal text-neutral-gray-1 outline-none placeholder:text-neutral-gray-3"
                />
              </div>

              <div className="mt-auto w-full max-w-[338px] pt-20">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-12.5 max-w-none rounded-[23px] shadow-[0_0_16px_rgba(181,244,255,0.5)] disabled:shadow-none"
                  disabled={!canWithdraw}
                  onClick={handleWithdraw}
                >
                  {isWithdrawing ? "탈퇴 중..." : "탈퇴하기"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <WithdrawExitConfirmModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirmExit={() => {
          setIsExitModalOpen(false);
          navigate("/account");
        }}
      />
      <WithdrawPasswordMismatchModal
        isOpen={isPasswordMismatchOpen}
        onClose={() => setIsPasswordMismatchOpen(false)}
      />
      <WithdrawCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={finishWithdraw}
        onConfirm={finishWithdraw}
      />
    </Layout>
  );
};

export default WithdrawPage;
