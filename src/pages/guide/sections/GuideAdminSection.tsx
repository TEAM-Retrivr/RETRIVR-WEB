import { GuidePhonePreview } from "../GuidePhonePreview";
import { useGuideFadeIn } from "../useGuideFadeIn";

const ADMIN_STEPS = [
  {
    title: "단체 설정",
    description: "단체를 만들고 대여를 열 준비를 합니다.",
  },
  {
    title: "물품 등록",
    description: "수량, 대여 가능 여부, 대여자가 적을 항목을 정합니다.",
  },
  {
    title: "QR/링크 공유",
    description: "대여자가 장부를 직접 작성하도록 입구를 공유합니다.",
  },
  {
    title: "대여 승인·거절",
    description: "요청을 처리하면 재고와 대여 상태가 함께 바뀝니다.",
  },
  {
    title: "반납 처리",
    description: "반납을 확인하면 재고가 돌아오고 이력이 남습니다.",
  },
  {
    title: "연체·알림",
    description: "반납 기한 안내의 상세는 Retrivr Pro에서 이어집니다.",
  },
] as const;

export const GuideAdminSection = () => {
  const fade = useGuideFadeIn();

  return (
    <section id="admin" className="scroll-mt-8 bg-neutral-white px-4 py-16 md:px-6 md:py-20">
      <div
        ref={fade.ref}
        className={`mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 ${fade.className}`}
      >
        <GuidePhonePreview
          src="/guide/admin-onboarding.png"
          alt="관리자 온보딩 화면"
        />
        <div>
          <h2 className="text-24px font-bold md:text-28px">관리자 기능</h2>
          <p className="mt-3 text-14px leading-relaxed text-neutral-gray-2">
            물품 등록부터 승인·반납까지, 운영 순서대로 장부가 맞춰집니다.
          </p>
          <ol className="mt-6 flex list-decimal flex-col gap-4 pl-5 text-14px leading-relaxed">
            {ADMIN_STEPS.map((step) => (
              <li key={step.title}>
                <p className="font-semibold text-secondary-1">{step.title}</p>
                <p className="text-neutral-gray-3">{step.description}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-14px text-neutral-gray-3">
            대여·반납 이력은 장부로 내려받을 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
};
