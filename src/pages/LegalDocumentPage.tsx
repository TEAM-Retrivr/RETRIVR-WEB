import Header from "../components/Header";
import { Layout } from "../components/Layout";
import {
  PUBLIC_PRIVACY_SECTIONS,
  PUBLIC_TERMS_SECTIONS,
  type LegalSection,
} from "../constants/legalContent";

type LegalDocumentPageProps = {
  pageName: string;
  title: string;
  backTo: string;
  sections: LegalSection[];
};

const LegalDocumentPage = ({
  pageName,
  title,
  backTo,
  sections,
}: LegalDocumentPageProps) => {
  return (
    <Layout>
      <Header pageName={pageName} backTo={backTo} />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar bg-neutral-white font-[Pretendard]">
        <div className="mx-4 mt-5 rounded-t-[16px] bg-[#F8F9F9] px-8 py-9 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]">
          <h1 className="pb-0.5 text-center text-14px font-bold leading-5 text-neutral-gray-1">
            {title}
          </h1>
          <div className="mt-5 flex flex-col gap-6 text-12px font-normal leading-[170%] text-neutral-gray-1">
            {sections.map((section, index) => (
              <section
                key={section.title || `preamble-${index}`}
                className="whitespace-pre-wrap"
              >
                {section.title ? (
                  <p className="font-bold">{section.title}</p>
                ) : null}
                {section.body ? (
                  <p className="font-medium">{section.body}</p>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const PublicTermsPage = () => (
  <LegalDocumentPage
    pageName="이용 약관"
    title="이용 약관"
    backTo="/"
    sections={PUBLIC_TERMS_SECTIONS}
  />
);

export const PublicPrivacyPage = () => (
  <LegalDocumentPage
    pageName="개인정보 처리방침"
    title="개인정보 처리방침"
    backTo="/"
    sections={PUBLIC_PRIVACY_SECTIONS}
  />
);
