export const ADMIN_TERMS_CONTENT = `제1조 (목적)
본 약관은 Retrivr가 제공하는 관리자용 서비스 이용과 관련된 조건 및 절차를 규정함을 목적으로 합니다.

제2조 (관리자의 정의)
"관리자"란 서비스를 통해 물품을 등록하고 대여 요청을 관리하는 회원을 의미합니다.

제3조 (계정 생성 및 관리)

1. 관리자는 이메일 기반 회원가입을 통해 계정을 생성합니다.
2. 계정 정보의 관리 책임은 관리자 본인에게 있으며, 제3자에게 양도 또는 공유할 수 없습니다.

제4조 (서비스 기능)
관리자는 다음 기능을 이용할 수 있습니다.
  ∙ 물품 등록 및 수정
  ∙ 대여 요청 승인 및 거절
  ∙ 대여 상태 관리
  ∙ 알림 발송 설정

제5조 (요금제 및 결제)

1. 서비스는 무료 및 유료 요금제를 제공할 수 있습니다.
2. 현재 베타 기간 동안은 별도의 결제 기능이 제공되지 않습니다.
3. 향후 유료 기능 도입 시 별도의 정책 및 약관을 통해 안내됩니다.

제6조 (알림 서비스)

1. 서비스는 이메일 또는 카카오 알림톡을 통한 알림 기능을 제공합니다.
2. 베타 기간 동안 일부 기능은 정책에 따라 제한되거나 변경될 수 있습니다.

제7조 (관리자의 의무)

1. 정확한 물품 정보를 등록해야 합니다.
2. 이용자의 개인정보를 관련 법령에 따라 안전하게 관리해야 합니다.
3. 대여 요청을 성실하게 처리해야 합니다.

제8조 (서비스 이용 제한)
서비스는 다음과 같은 경우 관리자 이용을 제한할 수 있습니다.
  ∙ 서비스 악용  ∙ 이용자 피해 발생  ∙ 정책 위반 행위

제9조 (면책 조항)
서비스는 관리자의 운영 방식, 대여 승인 또는 거절, 대여 결과 등에 대해 책임을 지지 않습니다.

제10조 (약관 변경)
서비스는 필요 시 약관을 변경할 수 있으며, 변경 시 사전에 공지합니다.`;

export const ADMIN_PRIVACY_CONTENT = `1. 수집하는 개인정보 항목
서비스는 다음과 같은 개인정보를 수집합니다.
  ∙ 이메일  ∙ 비밀번호  ∙ 연락처  ∙ 소속 정보

2. 개인정보의 수집 및 이용 목적
  ∙ 관리자 계정 생성 및 인증  ∙ 서비스 제공 및 운영

3. 개인정보의 보관 및 이용 기간
관리자의 개인정보는 계정 탈퇴 시까지 보관합니다.
단, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.

4. 개인정보의 제3자 제공
서비스는 원칙적으로 개인정보를 외부에 제공하지 않습니다.

5. 개인정보 처리의 위탁
서비스는 다음 업무를 외부에 위탁할 수 있습니다.
  ∙ 카카오 알림톡 및 이메일 발송

6. 관리자 권리
관리자는 언제든지 자신의 개인정보를 조회, 수정 또는 삭제할 수 있습니다.

7. 개인정보 보호 책임자
∙ 이름: 박다솔              
∙ 이메일: pds2023@gmail.com`;

export type LegalSection = {
  title: string;
  body: string;
};

const parseSectionsByTitlePattern = (
  content: string,
  titlePattern: RegExp,
): LegalSection[] => {
  const lines = content.split("\n");
  const sections: LegalSection[] = [];
  let currentTitle = "";
  let currentBody: string[] = [];

  const flush = () => {
    if (!currentTitle) return;
    sections.push({
      title: currentTitle,
      body: currentBody.join("\n").trim(),
    });
    currentTitle = "";
    currentBody = [];
  };

  for (const line of lines) {
    if (titlePattern.test(line.trim())) {
      flush();
      currentTitle = line.trim();
      continue;
    }
    currentBody.push(line);
  }
  flush();
  return sections;
};

export const parseLegalSections = (content: string): LegalSection[] =>
  parseSectionsByTitlePattern(content, /^제\d+조/);

export const parseNumberedLegalSections = (content: string): LegalSection[] =>
  parseSectionsByTitlePattern(content, /^\d+\.\s/);

export const ADMIN_TERMS_SECTIONS = parseLegalSections(ADMIN_TERMS_CONTENT);
export const ADMIN_PRIVACY_SECTIONS = parseNumberedLegalSections(
  ADMIN_PRIVACY_CONTENT,
);
