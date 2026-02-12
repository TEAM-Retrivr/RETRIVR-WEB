# README-Frontend

---

### 1. 프로젝트 소개 - 이 프로젝트가 **무엇을 해결하기 위한 서비스인지** 한 문장으로 정의

배포 링크 바로 클릭할 수 있게 배치

- **프로젝트 명칭 및 로고**
- **핵심 기능 요약**
- **배포 URL / 데모 영상 (GIF)**: 실제 동작 화면을 GIF나 이미지로 첨부

---

### 2. 기술 스택 - 사용되는 기술 스택에 대한 설명 (필요한가?)

**2-1. 프레임워크 / 라이브러리 (Framework / Library)**

2-1-1. React

2-1-2. Vite

**2-2. 상태 관리 (State Management)**:

2-2-1. TanStack Query

2-2-2. Zustand

**2-3. CSS 스타일링 (CSS Styling)**:

2-3-1. Tailwind CSS

**2-4. 툴 (Tools)**: 

2-4-1. TypeScript

2-4-2. ESLint

2-4-3. Prettier

---

### 3. 주요 기능 및 구현 상세 - MVP 기능 소개 + FE 관점에서 고민한 부분 or 자랑할 만한 부분 작성해두기

1. 성능 최적화 (이미지 최적화, 렌더링 최적화 등)
2. 사용자 경험 (Skeleton UI 적용, 인터랙션 처리 등)
3. 기술적 도전 (복잡한 폼 상태 관리, 실시간 데이터 처리 등)

---

### 4. 프로젝트 구조
```
src/
├── api/             # Tanstack Query (Axios 인스턴스 및 API 함수)
├── components/      # 공통 UI 컴포넌트 (Button, Input, Modal 등)
├── constants/       # 상수 관리 (에러 메시지, API 경로 등)
├── hooks/           # 커스텀 훅
├── pages/           # 라우트별 페이지 컴포넌트
│   ├── admin/       # 관리자 전용 페이지 (기자재 관리, 대여 승인 등)
│   └── user/        # 대여자용 페이지 (기자재 리스트, 예약 등)
├── store/           # Zustand (상태 관리 로직)
├── styles/          # Tailwind CSS 설정 및 글로벌 스타일
└── types/           # 공통 TypeScript 인터페이스/타입 정의
```
