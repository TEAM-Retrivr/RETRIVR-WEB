import Header from "../../components/Header";
import { Layout } from "../../components/Layout";
import { ADMIN_TERMS_SECTIONS } from "../../constants/legalContent";

const AccountTermsPage = () => {
  return (
    <Layout>
      <Header name="계정 관리" pageName="이용 약관" backTo="/account" />
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar bg-neutral-white font-[Pretendard]">
        <div className="mx-4 mt-5 rounded-t-[16px] bg-[#F8F9F9] px-8 py-9 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]">
          <h1 className="text-18px font-bold text-neutral-gray-1 pb-0.5">
            이용 약관
          </h1>
          <div className="mt-5 flex flex-col gap-6 text-12px font-normal leading-[170%] text-neutral-gray-1">
            {ADMIN_TERMS_SECTIONS.map((section) => (
              <section key={section.title} className="whitespace-pre-wrap">
                <p className="font-bold">{section.title}</p>
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

export default AccountTermsPage;
