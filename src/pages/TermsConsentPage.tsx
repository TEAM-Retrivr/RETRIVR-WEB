import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Layout } from "../components/Layout";
import Button from "../components/Button";
import CustomCheckBox from "../components/CustomCheckbox";
import {
  GA_CONSENT_STORAGE_KEY,
  grantAnalyticsConsent,
  trackPageView,
} from "../lib/analytics";

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
  admin: `제1조 (목적)
본 약관은 Retrivr가 제공하는 관리자용 서비스 이용과 관련된 조건 및 절차를 규정함을 목적으로 합니다.

제2조 (관리자의 정의)
"관리자"란 서비스를 통해 물품을 등록하고 대여 요청을 관리하는 회원을 의미합니다.

제3조 (계정 생성 및 관리)

1. 관리자는 이메일 기반 회원가입을 통해 계정을 생성합니다.
2. 계정 정보의 관리 책임은 관리자 본인에게 있으며, 제3자에게 양도 또는 공유할 수 없습니다.

제4조 (서비스 기능)
관리자는 다음 기능을 이용할 수 있습니다.

* 물품 등록 및 수정
* 대여 요청 승인 및 거절
* 대여 상태 관리
* 알림 발송 설정

제5조 (요금제 및 결제)

1. 서비스는 무료 및 유료 요금제를 제공할 수 있습니다.
2. 현재 베타 기간 동안은 별도의 결제 기능이 제공되지 않습니다.
3. 향후 유료 기능 도입 시 별도의 정책 및 약관을 통해 안내됩니다.

제6조 (알림 서비스)

1. 서비스는 이메일 또는 카카오 알림톡을 통한 알림 기능을 제공합니다.
2. 베타 기간 동안 일부 기능은 정책에 따라 제한되거나 변경될 수 있습니다.

제7조 (관리자의 의무)

1. 정확한 물품 정보를 등록해야 합니다.
2. 이용자의 개인정보를 관련 법령에 따라 안전하게 관리해야 합니다.
3. 대여 요청을 성실하게 처리해야 합니다.

제8조 (서비스 이용 제한)
서비스는 다음과 같은 경우 관리자 이용을 제한할 수 있습니다.

* 서비스 악용
* 이용자 피해 발생
* 정책 위반 행위

제9조 (면책 조항)
서비스는 관리자의 운영 방식, 대여 승인 또는 거절, 대여 결과 등에 대해 책임을 지지 않습니다.

제10조 (약관 변경)
서비스는 필요 시 약관을 변경할 수 있으며, 변경 시 사전에 공지합니다.`,
  client: `제1조 (목적)
본 약관은 Retrivr(이하 "서비스")가 제공하는 물품 대여 요청 서비스의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)

1. "이용자"란 회원가입 없이 서비스에 접속하여 물품 대여를 요청하는 자를 의미합니다.
2. "관리자"란 물품을 등록하고 대여 요청을 승인 또는 거절할 수 있는 권한을 가진 자를 의미합니다.

제3조 (서비스의 제공)
서비스는 다음과 같은 기능을 제공합니다.

1. 물품 정보 조회
2. 대여 요청 접수
3. 대여 상태 안내 및 알림 제공

제4조 (대여 요청 및 성립)

1. 이용자는 이름 및 연락처 입력을 통해 대여 요청을 할 수 있습니다.
2. 대여 요청은 관리자의 승인 시 최종 확정됩니다.
3. 일정 시간 내 승인되지 않은 요청은 자동 취소될 수 있습니다.

제5조 (이용자의 의무)

1. 이용자는 정확하고 최신의 정보를 입력해야 합니다.
2. 타인의 정보를 도용하거나 허위 정보를 입력해서는 안 됩니다.
3. 승인된 대여 조건(기간, 반납 등)을 준수해야 합니다.

제6조 (대여 물품에 대한 책임)
이용자는 대여 물품의 분실, 훼손 또는 손상에 대해 책임을 질 수 있으며, 책임 범위는 관리자 또는 서비스 운영 정책에 따릅니다.

제7조 (알림 서비스)
서비스는 대여 요청 및 상태 안내를 위해 알림을 발송할 수 있으며, 알림은 카카오 알림톡 또는 이메일로 제공될 수 있습니다.

제8조 (서비스 이용 제한)
서비스는 다음과 같은 경우 이용을 제한할 수 있습니다.

1. 허위 정보 입력
2. 서비스의 정상적인 운영을 방해하는 행위
3. 기타 부정한 방법으로 서비스를 이용하는 경우

제9조 (면책 조항)

1. 서비스는 관리자와 이용자 간의 대여 관계에 직접 개입하지 않습니다.
2. 대여 과정에서 발생하는 분쟁에 대해 서비스는 책임을 지지 않습니다.

제10조 (약관의 변경)
서비스는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 사전에 공지합니다.
`,
};

const PRIVACY_CONTENT_BY_USER_TYPE: Record<"admin" | "client", string> = {
  admin: `1. 수집하는 개인정보 항목
   서비스는 다음과 같은 개인정보를 수집합니다.

* 이메일
* 비밀번호
* 연락처
* 소속 정보

2. 개인정보의 수집 및 이용 목적

* 관리자 계정 생성 및 인증
* 서비스 제공 및 운영

3. 개인정보의 보관 및 이용 기간
   관리자의 개인정보는 계정 탈퇴 시까지 보관합니다.
   단, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.

4. 개인정보의 제3자 제공
   서비스는 원칙적으로 개인정보를 외부에 제공하지 않습니다.

5. 개인정보 처리의 위탁
   서비스는 다음 업무를 외부에 위탁할 수 있습니다.

* 카카오 알림톡 및 이메일 발송

6. 관리자 권리
   관리자는 언제든지 자신의 개인정보를 조회, 수정 또는 삭제할 수 있습니다.

7. 개인정보 보호 책임자

* 이름: 박다솔
* 이메일: pds2023@gmail.com`,
  client: `1. 수집하는 개인정보 항목
   서비스는 다음과 같은 개인정보를 수집합니다.

[필수 항목]

* 이름
* 연락처 (전화번호 또는 이메일)

[선택 항목]

* 대여 요청 시 추가 입력 정보 (예: 요청사항 등)
  ※ 추가 정보는 물품 및 관리자 설정에 따라 달라질 수 있습니다.

2. 개인정보의 수집 및 이용 목적

* 대여 요청 접수 및 처리
* 관리자와의 원활한 연락
* 대여 상태 안내 및 알림 발송
* 서비스 운영 및 이용 기록 관리

3. 개인정보의 보관 및 이용 기간
   수집된 개인정보는 대여 완료일로부터 90일간 보관 후 지체 없이 파기합니다.
   단, 분쟁 발생 시 해당 분쟁 해결 시까지 보관할 수 있습니다.

4. 개인정보의 제공
   이용자의 개인정보는 대여 요청 처리 및 운영을 위해 해당 물품을 관리하는 관리자에게 제공됩니다.

5. 개인정보 처리의 위탁
   서비스는 원활한 서비스 제공을 위해 다음 업무를 외부에 위탁할 수 있습니다.

* 카카오 알림톡 발송
* 이메일 발송

6. 이용자의 권리 및 거부
   이용자는 개인정보 제공을 거부할 수 있으나, 이 경우 대여 요청 서비스 이용이 제한될 수 있습니다.

7. 개인정보 보호 책임자

* 이름: 박다솔
* 이메일: pds2023@gmail.com
`,
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
  const hasGrantedAnalyticsRef = useRef(
    typeof window !== "undefined" &&
      localStorage.getItem(GA_CONSENT_STORAGE_KEY) === "true",
  );
  const userType = effectiveState?.userType ?? "admin";
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
    if (isAllRequiredChecked && !hasGrantedAnalyticsRef.current) {
      grantAnalyticsConsent();
      trackPageView(`${location.pathname}${location.search}`);
      localStorage.setItem(GA_CONSENT_STORAGE_KEY, "true");
      hasGrantedAnalyticsRef.current = true;
    }

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
