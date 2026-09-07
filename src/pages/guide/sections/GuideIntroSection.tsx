import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { GuidePhonePreview } from "../GuidePhonePreview";

const SLIDES = [
  {
    title: "손 쉬운 대여 장부 관리",
    subtitle: "학생 단체 및 소규모 조직을 위한 물품 대여·반납 자동화",
    image: "/guide/landing.png",
    alt: "Retrivr 시작 화면",
  },
  {
    title: "대여 물품 관리에 드는 수많은 시간",
    subtitle: "이제 Retrivr에 맡겨 보세요",
    image: "/guide/admin-onboarding.png",
    alt: "관리자 온보딩 카드",
  },
  {
    title: "물품 대여까지 걸린 무수한 절차",
    subtitle: "이제는 Retrivr에서 간단히 신청해보세요",
    image: "/guide/renter-onboarding.png",
    alt: "대여자 온보딩 카드",
  },
] as const;

const SLIDE_INTERVAL_MS = 4000;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const GuideIntroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || prefersReducedMotion()) return undefined;

    const timer = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      id="intro"
      className="relative min-h-[720px] overflow-hidden bg-secondary-1 md:min-h-[640px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-logo-gradient opacity-30" />
      {SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;

        return (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ${
              isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-8 px-6 py-16 md:flex-row md:justify-between">
              <div className="max-w-xl text-center md:text-left">
                <img
                  src="/icons/home/retrivr_text_outline.svg"
                  alt=""
                  className="mx-auto mb-6 h-10 w-auto md:mx-0"
                />
                <h1 className="text-28px font-bold leading-tight text-neutral-white md:text-[40px]">
                  {slide.title}
                </h1>
                <p className="mt-4 text-16px leading-relaxed text-secondary-5">
                  {slide.subtitle}
                </p>
                {isActive ? (
                  <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row md:items-start">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={() => navigate("/client-search")}
                    >
                      대여하기
                    </Button>
                    <Button
                      type="button"
                      variant="gray"
                      size="lg"
                      onClick={() => navigate("/register")}
                    >
                      관리자로 시작
                    </Button>
                  </div>
                ) : (
                  <div className="mt-8 h-[52px]" aria-hidden />
                )}
              </div>
              <GuidePhonePreview
                src={slide.image}
                alt={isActive ? slide.alt : ""}
              />
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`${index + 1}번째 소개`}
            aria-current={index === currentSlide ? true : undefined}
            className={`h-3 w-3 cursor-pointer rounded-full bg-neutral-white transition-opacity ${
              index === currentSlide ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};
