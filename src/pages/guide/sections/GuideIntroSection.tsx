import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

const INTRO_POINTS = [
  "대여·반납·재고를 한곳에서 맞춰 수기 장부가 필요 없습니다.",
  "반납 기한과 안내가 흐름에 붙어 독촉 부담이 줄어듭니다.",
  "대여자는 회원가입 없이 QR 또는 링크로 신청합니다.",
] as const;

export const GuideIntroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="intro" className="scroll-mt-20 border-b border-neutral-gray-5 px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <h1 className="text-24px font-bold">Retrivr 서비스 소개</h1>
        <p className="text-16px leading-relaxed">
          학생 단체 및 소규모 조직을 위한 물품 대여·반납 관리 자동화
        </p>
        <div className="min-h-32 rounded-lg bg-neutral-gray p-6">
          <p className="text-12px text-neutral-gray-3">소개 비주얼 자리</p>
        </div>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-14px leading-relaxed">
          {INTRO_POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => navigate("/register")}
          >
            관리자로 시작
          </Button>
          <Button
            type="button"
            variant="gray"
            size="lg"
            onClick={() => navigate("/client-search")}
          >
            대여하기
          </Button>
        </div>
      </div>
    </section>
  );
};
