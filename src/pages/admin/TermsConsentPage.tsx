import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { Layout } from "../../components/Layout";
import Button from "../../components/Button";
import CustomCheckBox from "../../components/CustomCheckbox";

const GA_CONSENT_STORAGE_KEY = "ga4ConsentGranted";
const CLIENT_TERMS_REDIRECT_STORAGE_KEY = "clientTermsRedirectPayload";
const CLIENT_RENTAL_SUBMIT_STATE_STORAGE_KEY = "clientRentalSubmitState";

type TermsRouteState = {
  userType?: "admin" | "client";
  nextPath?: string;
  nextState?: unknown;
};

const enableGA4Collection = () => {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (typeof gtag !== "function") return;

  gtag("consent", "update", {
    analytics_storage: "granted",
  });
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

  const effectiveState = routeState ?? storedClientState;

  {
    /* 상태변수 */
  }

  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const hasGrantedAnalyticsRef = useRef(false);
  const userType = effectiveState?.userType ?? "admin";

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
    navigate("/register");
  };

  // 필수 약관 동의가 완료되는 순간부터 GA4 수집을 허용
  // - gtag consent update 호출
  // - 로컬스토리지 플래그 저장(추후 초기화 로직에서 재사용 가능)
  useEffect(() => {
    if (!isAllRequiredChecked || hasGrantedAnalyticsRef.current) return;

    enableGA4Collection();
    localStorage.setItem(GA_CONSENT_STORAGE_KEY, "true");
    hasGrantedAnalyticsRef.current = true;
  }, [isAllRequiredChecked]);

  return (
    <Layout>
      {/* 헤더 영역 - 페이지 제목 + 뒤로가기 */}
      <Header pageName="이용 약관 동의" backTo="/login" />

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
          <div className="h-30 w-full overflow-y-auto rounded-[12px] border border-neutral-gray-4/50 bg-neutral-gray-6 p-4 text-12px text-neutral-gray-3 leading-[140%] [scrollbar-width:thin] [scrollbar-color:#d9d9d9_transparent] [&::-webkit-scrollbar]:w-px [&::-webkit-scrollbar-track]:my-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:border-none [&::-webkit-scrollbar-thumb]:min-h-[20px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d9d9d9]">
            <p className="pb-3">
              {" "}
              본 이용약관(이하 "약관")은 [리트리버]가 제공하는 학생회 물품 대여
              서비스(이하 "서비스") 이용과 관련하여 학생회와 이용자 간의 권리,
              의무 및 책임 사항을 규정합니다.
            </p>

            <p>
              이용자는 물품 대여 시 반납 기한을 준수해야 하며, 본인 과실로 인한
              파손 및 분실 시 배상 책임이 발생할 수 있습니다. 학생회비 미납자 및
              휴학생은 서비스 이용이 제한될 수 있음을 알려드립니다.
            </p>
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
          <div className="h-30 w-full overflow-y-auto rounded-[12px] border border-neutral-gray-4/50 bg-neutral-gray-6 p-4 text-12px text-neutral-gray-3 leading-[140%] [scrollbar-width:thin] [scrollbar-color:#d9d9d9_transparent] [&::-webkit-scrollbar]:w-px [&::-webkit-scrollbar-track]:my-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:border-none [&::-webkit-scrollbar-thumb]:min-h-[20px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d9d9d9]">
            <div className="pb-3">
              <p className="font-bold ">1. 수집하는 개인정보</p>
              <p>
                [리트리버]는 원활한 대여 관리를 위해 최소한의 개인정보를
                수집합니다. 이용자는 회원가입 또는 대여 신청 시 성명, 학번,
                학과, 연락처 정보를 제공하게 됩니다.
              </p>
            </div>
            <div className="pb-3">
              <p className="font-bold ">2. 수집 및 이용 목적</p>
              <p>
                수집된 정보는 대여 자격 확인, 물품 반납 안내, 연체자 관리 등
                서비스 운영 목적 이외의 용도로는 사용되지 않습니다.
              </p>
            </div>
            <div>
              <p className="font-bold ">3. 보유 및 이용 기간</p>
              <p>
                개인정보는 원칙적으로 수집 목적이 달성된 후 지체 없이 파기하나,
                운영 기록 보관을 위해 최대 6개월간 보관됩니다.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 하단 CTA 영역 - 필수 약관 동의 완료 시 활성화 */}
      <div className="mt-auto mb-12 flex flex-col w-full items-center gap-5">
        {/* 모두 동의 체크 영역 */}
        <div className="w-84.5 flex gap-2.5 px-4 py-3.5 bg-neutral-gray-5 border border-neutral-gray-4/50 rounded-[12px]">
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
