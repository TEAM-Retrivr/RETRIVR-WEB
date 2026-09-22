import { GuideAdminSection } from "./sections/GuideAdminSection";
import { GuideFooterSection } from "./sections/GuideFooterSection";
import { GuideIntroSection } from "./sections/GuideIntroSection";
import { GuideMethodSection } from "./sections/GuideMethodSection";
import { GuideProSection } from "./sections/GuideProSection";
import { GuideRenterSection } from "./sections/GuideRenterSection";

const GuidePage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-neutral-gray-5 font-[Pretendard] text-neutral-gray-1 antialiased">
      <GuideIntroSection />
      <GuideMethodSection />
      <GuideAdminSection />
      <GuideRenterSection />
      <GuideProSection />
      <GuideFooterSection />
    </div>
  );
};

export default GuidePage;
