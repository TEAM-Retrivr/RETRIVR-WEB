import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

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

  return (
    <section id="renter" className="scroll-mt-20 border-b border-neutral-gray-5 px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <h2 className="text-20px font-bold">대여자 기능</h2>
        <p className="text-14px leading-relaxed">
          별도 회원가입 없이, 복잡한 절차 없이 물품을 신청할 수 있습니다.
        </p>
        <div className="min-h-32 rounded-lg bg-neutral-gray p-6">
          <p className="text-12px text-neutral-gray-3">대여자 플로우 비주얼 자리</p>
        </div>
        <ol className="flex list-decimal flex-col gap-4 pl-5 text-14px leading-relaxed">
          {RENTER_STEPS.map((step) => (
            <li key={step.title}>
              <p className="font-semibold">{step.title}</p>
              <p className="text-neutral-gray-3">{step.description}</p>
            </li>
          ))}
        </ol>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={() => navigate("/client-search")}
        >
          대여하기
        </Button>
      </div>
    </section>
  );
};
