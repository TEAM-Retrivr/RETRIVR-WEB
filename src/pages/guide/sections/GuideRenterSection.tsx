import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { GuidePhonePreview } from "../GuidePhonePreview";
import { useGuideFadeIn } from "../useGuideFadeIn";

const RENTER_STEPS = [
  {
    title: "대여지 입장",
    description: "대여지를 검색하거나 QR/링크로 들어갑니다.",
  },
  {
    title: "물품 선택",
    description: "대여 가능한 물품 목록에서 필요한 물건을 고릅니다.",
  },
  {
    title: "정보 입력 후 신청",
    description: "필요한 정보만 입력하고 대여를 요청합니다.",
  },
  {
    title: "승인 후 대여 완료",
    description: "관리자 승인이 끝나면 대여가 완료됩니다.",
  },
] as const;

export const GuideRenterSection = () => {
  const navigate = useNavigate();
  const fade = useGuideFadeIn();

  return (
    <section id="renter" className="scroll-mt-8 bg-neutral-gray-5 px-4 py-16 md:px-6 md:py-20">
      <div
        ref={fade.ref}
        className={`mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 ${fade.className}`}
      >
        <div className="md:order-2">
          <GuidePhonePreview
            src="/guide/renter-onboarding.png"
            alt="대여자 온보딩 화면"
          />
        </div>
        <div className="md:order-1">
          <h2 className="text-24px font-bold md:text-28px">대여자 기능</h2>
          <p className="mt-3 text-14px leading-relaxed text-neutral-gray-2">
            별도 회원가입 없이, 복잡한 절차 없이 물품을 신청할 수 있습니다.
          </p>
          <ol className="mt-6 flex list-decimal flex-col gap-4 pl-5 text-14px leading-relaxed">
            {RENTER_STEPS.map((step) => (
              <li key={step.title}>
                <p className="font-semibold text-secondary-1">{step.title}</p>
                <p className="text-neutral-gray-3">{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => navigate("/client-search")}
            >
              대여하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
