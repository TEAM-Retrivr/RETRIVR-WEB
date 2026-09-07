import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

const PLANS = [
  { name: "월간 이용권", price: "4,900원", unit: "/월" },
  { name: "연간 이용권", price: "49,000원", unit: "/년" },
] as const;

export const GuideProSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pro" className="scroll-mt-20 border-b border-neutral-gray-5 px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <h2 className="text-20px font-bold">Retrivr Pro</h2>
        <p className="text-14px leading-relaxed">
          물품 관리·승인·반납·장부는 무료로 이용할 수 있습니다. 카카오톡 알림톡은
          Retrivr Pro의 첫 번째 프리미엄 기능입니다.
        </p>
        <div className="min-h-32 rounded-lg bg-neutral-gray p-6">
          <p className="text-12px text-neutral-gray-3">요금제 비주얼 자리</p>
        </div>
        <ul className="flex flex-col gap-3">
          {PLANS.map((plan) => (
            <li
              key={plan.name}
              className="flex items-center justify-between rounded-lg border border-neutral-gray-4 px-4 py-3 text-14px"
            >
              <span className="font-semibold">{plan.name}</span>
              <span>
                {plan.price}
                <span className="text-neutral-gray-3">{plan.unit}</span>
              </span>
            </li>
          ))}
        </ul>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-14px leading-relaxed text-neutral-gray-3">
          <li>언제든 구독을 관리하고 해지할 수 있습니다.</li>
          <li>이용권이 끝나면 무료 기능만 사용할 수 있습니다.</li>
          <li>앞으로 더 많은 운영 도구가 Pro를 통해 제공될 예정입니다.</li>
        </ul>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={() => navigate("/register")}
        >
          관리자로 시작
        </Button>
      </div>
    </section>
  );
};
