import { useNavigate } from "react-router-dom";
import { useGuideFadeIn } from "../useGuideFadeIn";

const PLANS = [
  { name: "월간 이용권", price: "4,900원", unit: "/월" },
  { name: "연간 이용권", price: "49,000원", unit: "/년" },
] as const;

export const GuideProSection = () => {
  const navigate = useNavigate();
  const fade = useGuideFadeIn();

  return (
    <section
      id="pro"
      className="scroll-mt-8 border-t border-neutral-gray-4 bg-neutral-white px-4 py-16 md:px-6 md:py-24"
    >
      <div
        ref={fade.ref}
        className={`mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 ${fade.className}`}
      >
        <div className="text-center md:text-left">
          <span className="mb-2 block text-12px font-bold tracking-wider text-primary uppercase">
            Retrivr Pro
          </span>
          <h2 className="text-24px font-bold leading-tight md:text-[32px]">
            단체의 필요에 맞게
            <br />
            플랜을 선택하세요
          </h2>
          <p className="mt-4 text-14px leading-relaxed text-neutral-gray-3 md:text-16px">
            물품 관리·승인·반납·장부는 무료입니다. 카카오톡 알림톡은 Pro의 첫
            번째 프리미엄 기능이며, 언제든 구독을 관리하고 해지할 수 있습니다.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {PLANS.map((plan) => (
              <li
                key={plan.name}
                className="flex items-center justify-between rounded-[12px] border border-primary bg-secondary-4 px-5 py-4 text-14px"
              >
                <span className="font-semibold text-primary">{plan.name}</span>
                <span className="text-neutral-gray-1">
                  {plan.price}
                  <span className="text-neutral-gray-3">{plan.unit}</span>
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-8 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-secondary-1 px-6 py-4 text-16px font-bold text-neutral-white shadow-primary transition hover:-translate-y-1 md:inline-flex md:w-auto"
            onClick={() => navigate("/register")}
          >
            관리자로 시작하기
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-card">
          <img
            src="/guide/pro-pricing.png"
            alt="Retrivr Pro 요금제 안내"
            width={640}
            height={800}
            className="block h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
};
