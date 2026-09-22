import { GuidePhonePreview } from "../GuidePhonePreview";
import { useGuideFadeIn } from "../useGuideFadeIn";

const METHOD_CARDS = [
  {
    href: "#admin",
    title: "관리자 이용 방법",
    description:
      "물품 등록부터 QR 공유, 승인·반납까지 운영 순서대로 장부가 맞춰집니다.",
    image: "/guide/admin-onboarding.png",
    alt: "관리자 이용 가이드 화면",
    accent: "bg-secondary-4 text-primary",
  },
  {
    href: "#renter",
    title: "대여자 이용 방법",
    description:
      "회원가입 없이 대여지를 찾아 물품을 고르고, 정보만 입력하면 신청이 끝납니다.",
    image: "/guide/renter-onboarding.png",
    alt: "대여자 이용 가이드 화면",
    accent: "bg-bg-pale text-secondary-1",
  },
] as const;

export const GuideMethodSection = () => {
  const headingFade = useGuideFadeIn();
  const firstCardFade = useGuideFadeIn();
  const secondCardFade = useGuideFadeIn();
  const cardFades = [firstCardFade, secondCardFade];

  return (
    <section className="bg-neutral-gray-5 px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div ref={headingFade.ref} className={`mb-10 text-center ${headingFade.className}`}>
          <h2 className="text-24px font-bold md:text-28px">서비스 이용 방법</h2>
          <p className="mt-3 text-14px text-neutral-gray-3">
            원하시는 이용 가이드를 선택해 주세요.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {METHOD_CARDS.map((card, index) => {
            const fade = cardFades[index];
            return (
              <div key={card.href} ref={fade.ref} className={fade.className}>
                <a href={card.href} className="group block">
                <div className="flex h-full flex-col rounded-2xl border border-neutral-gray-4 bg-neutral-white p-6 shadow-sm transition duration-300 group-hover:-translate-y-2 group-hover:shadow-card md:p-10">
                  <div
                    className={`mb-5 flex size-14 items-center justify-center rounded-full ${card.accent} md:mb-6 md:size-16`}
                  >
                    <img
                      src="/icons/symbol.svg"
                      alt=""
                      className="size-8 md:size-9"
                    />
                  </div>
                  <h3 className="text-20px font-bold text-neutral-gray-1 group-hover:text-primary md:text-24px">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-14px leading-relaxed text-neutral-gray-2">
                    {card.description}
                  </p>
                  <div className="mt-6">
                    <GuidePhonePreview src={card.image} alt={card.alt} />
                  </div>
                  <span className="mt-6 inline-flex items-center text-14px font-semibold text-primary">
                    자세히 보기
                    <img
                      src="/icons/home/right-arrow.svg"
                      alt=""
                      className="ml-1 size-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
