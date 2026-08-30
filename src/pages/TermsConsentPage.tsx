import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Layout } from "../components/Layout";
import Button from "../components/Button";
import CustomCheckBox from "../components/CustomCheckbox";
import {
  grantAnalyticsConsent,
  setTermsConsent,
  trackPageView,
  type AnalyticsUserType,
} from "../lib/analytics";
import {
  ADMIN_PRIVACY_CONTENT,
  ADMIN_TERMS_CONTENT,
  CLIENT_PRIVACY_CONTENT,
  CLIENT_TERMS_CONTENT,
} from "../constants/legalContent";

const CLIENT_TERMS_REDIRECT_STORAGE_KEY = "clientTermsRedirectPayload";
const CLIENT_RENTAL_SUBMIT_STATE_STORAGE_KEY = "clientRentalSubmitState";

type TermsRouteState = {
  userType?: "admin" | "client";
  nextPath?: string;
  nextState?: unknown;
};

const PAGE_DESTINATION_BY_USER_TYPE: Record<"admin" | "client", string> = {
  admin: "/login",
  client: "/",
};

const TERMS_CONTENT_BY_USER_TYPE: Record<"admin" | "client", string> = {
  admin: ADMIN_TERMS_CONTENT,
  client: CLIENT_TERMS_CONTENT,
};

const PRIVACY_CONTENT_BY_USER_TYPE: Record<"admin" | "client", string> = {
  admin: ADMIN_PRIVACY_CONTENT,
  client: CLIENT_PRIVACY_CONTENT,
};

const TermsConsentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as TermsRouteState | null;

  const storedClientState = useMemo(() => {
    const raw = sessionStorage.getItem(CLIENT_TERMS_REDIRECT_STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as TermsRouteState;
    } catch {
      return null;
    }
  }, []);

  const effectiveState =
    routeState ??
    (storedClientState?.userType === "client" ? storedClientState : null);
  {
    /* 상태변수 */
  }

  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const userType: AnalyticsUserType = effectiveState?.userType ?? "admin";
  const termsContent = TERMS_CONTENT_BY_USER_TYPE[userType];
  const privacyContent = PRIVACY_CONTENT_BY_USER_TYPE[userType];

  {
    /* 파생 상태 */
  }

  const isAllRequiredChecked = useMemo(
    () => isTermsChecked && isPrivacyChecked,
    [isTermsChecked, isPrivacyChecked],
  );
  const buttonDefaultText =
    userType === "client" ? "동의 후 대여하기" : "동의 후 Retrivr 시작하기";
  const buttonActiveText =
    userType === "client" ? "대여 시작하기" : "관리자 회원가입하기";

  {
    /* 이벤트 핸들러 */
  }

  // "모두 동의합니다." 체크박스 핸들러
  // - true면 필수 약관 2개를 모두 체크
  // - false면 필수 약관 2개를 모두 해제
  const handleAllCheckedChange = (checked: boolean) => {
    setIsTermsChecked(checked);
    setIsPrivacyChecked(checked);
  };

  // 약관 동의 완료 후 진입 목적(관리자/대여자)에 맞는 다음 화면으로 이동
  const handleNextStep = () => {
    if (!isAllRequiredChecked) return;

    setTermsConsent(userType);
    grantAnalyticsConsent(userType);
    trackPageView(`${location.pathname}${location.search}`);

    if (userType === "client") {
      if (effectiveState?.nextState) {
        sessionStorage.setItem(
          CLIENT_RENTAL_SUBMIT_STATE_STORAGE_KEY,
          JSON.stringify(effectiveState.nextState),
        );
      }
      navigate(
        effectiveState?.nextPath ?? "/client-rental-information-submit",
        {
          state: effectiveState?.nextState,
        },
      );
      sessionStorage.removeItem(CLIENT_TERMS_REDIRECT_STORAGE_KEY);
      return;
    }
    navigate(effectiveState?.nextPath ?? "/login", {
      state: effectiveState?.nextState,
    });
  };

  return (
    <Layout>
      {/* 헤더 영역 - 페이지 제목 + 뒤로가기 */}
      <Header
        pageName="이용 약관 동의"
        backTo={PAGE_DESTINATION_BY_USER_TYPE[userType]}
      />

      {/* 본문 영역 - 필수 약관 동의 2개 + 모두 동의 체크 */}
      <div className="flex w-full flex-col gap-7.5 px-8 pt-10 font-[Pretendard]">
        <p className="text-24px text-neutral-gray-1 font-bold">
          이용 약관 동의
        </p>
        {/* 이용약관 동의 영역 (필수) */}
        <section className="flex flex-col pt-1 gap-2">
          <div className="flex items-center gap-1">
            <CustomCheckBox
              checked={isTermsChecked}
              onCheckedChange={setIsTermsChecked}
            />
            <p className="text-14px font-bold text-neutral-gray-1">
              이용약관{" "}
              <span className="text-primary font-normal leading-[140%]">
                (필수)
              </span>
            </p>
          </div>
          {/* 이용약관 내용 박스 - 내부 스크롤 가능 */}
          <div className="h-30 w-full overflow-y-auto rounded-[12px] border border-neutral-gray-4/50 bg-neutral-gray-5 p-4 text-12px text-neutral-gray-3 leading-[140%] [scrollbar-width:thin] [scrollbar-color:#d9d9d9_transparent] [&::-webkit-scrollbar]:w-px [&::-webkit-scrollbar-track]:my-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:border-none [&::-webkit-scrollbar-thumb]:min-h-[20px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d9d9d9]">
            <p className="whitespace-pre-wrap">{termsContent}</p>
          </div>
        </section>

        {/* 개인정보 처리방침 동의 영역 (필수) */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <CustomCheckBox
              checked={isPrivacyChecked}
              onCheckedChange={setIsPrivacyChecked}
            />
            <p className="text-14px font-bold text-neutral-gray-1">
              개인정보 처리방침{" "}
              <span className="text-primary font-normal leading-[140%]">
                (필수)
              </span>
            </p>
          </div>
          {/* 개인정보 처리방침 내용 박스 - 내부 스크롤 가능 */}
          <div className="h-30 w-full overflow-y-auto rounded-[12px] border border-neutral-gray-4/50 bg-neutral-gray-5 p-4 text-12px text-neutral-gray-3 leading-[140%] [scrollbar-width:thin] [scrollbar-color:#d9d9d9_transparent] [&::-webkit-scrollbar]:w-px [&::-webkit-scrollbar-track]:my-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:border-none [&::-webkit-scrollbar-thumb]:min-h-[20px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d9d9d9]">
            <p className="whitespace-pre-wrap">{privacyContent}</p>
          </div>
        </section>
      </div>

      {/* 하단 CTA 영역 - 필수 약관 동의 완료 시 활성화 */}
      <div className="mt-auto mb-12 flex flex-col w-full items-center gap-5">
        {/* 모두 동의 체크 영역 */}
        <div
          className={`w-84.5 flex gap-2.5 px-4 py-3.5 border border-neutral-gray-4/50 rounded-[12px] ${
            isAllRequiredChecked ? "bg-secondary-4" : "bg-neutral-gray-5"
          }`}
        >
          <CustomCheckBox
            checked={isAllRequiredChecked}
            onCheckedChange={handleAllCheckedChange}
          />
          <p className="text-14px font-bold text-neutral-gray-1">
            모두 동의합니다.
          </p>
        </div>
        <Button
          variant={isAllRequiredChecked ? "primary" : "gray"}
          size="lg"
          disabled={!isAllRequiredChecked}
          className="transition-colors duration-300 ease-in-out"
          onClick={handleNextStep}
        >
          {isAllRequiredChecked ? buttonActiveText : buttonDefaultText}
        </Button>
      </div>
    </Layout>
  );
};

export default TermsConsentPage;
