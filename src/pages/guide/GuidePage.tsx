import { GuideAdminSection } from "./sections/GuideAdminSection";
import { GuideFooterSection } from "./sections/GuideFooterSection";
import { GuideIntroSection } from "./sections/GuideIntroSection";
import { GuideProSection } from "./sections/GuideProSection";
import { GuideRenterSection } from "./sections/GuideRenterSection";

const NAV_ITEMS = [
  { href: "#intro", label: "소개" },
  { href: "#admin", label: "관리자" },
  { href: "#renter", label: "대여자" },
  { href: "#pro", label: "Pro" },
  { href: "#footer", label: "정보" },
] as const;

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-neutral-white text-neutral-gray-1">
      <header className="sticky top-0 z-10 border-b border-neutral-gray-5 bg-neutral-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-16px font-bold">Retrivr 가이드</p>
          <nav aria-label="가이드 목차">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-14px">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a className="underline" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <GuideIntroSection />
        <GuideAdminSection />
        <GuideRenterSection />
        <GuideProSection />
      </main>
      <GuideFooterSection />
    </div>
  );
};

export default GuidePage;
