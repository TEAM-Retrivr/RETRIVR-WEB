import { Layout } from "../../components/Layout";
import UserIcon from "../../components/UserIcon";
import { MenuCard } from "../../components/cards/home/MenuCard";
import { RentRequestCard } from "../../components/cards/admin/rental/RentRequestCard";
import { HOME_MENUS } from "../../types/menu";
import { useLoadHome } from "../../hooks/queries/useAuthQueries";
import BlueButton from "../../components/BlueButton";
import { useNavigate } from "react-router-dom";
interface RentRequestCardData {
  id: string;
  itemName: string;
  count: string;
  applicant: string;
  time: string;
}

const Home = () => {
  const navigate = useNavigate();
  // 대여 요청
  const { data, isLoading, error } = useLoadHome();
  // 최근 대여 요청 개수
  // 임시: API 연동 전까지 빈 배열과 0 사용

  const UserProfile = {
    organizationName: data?.organizationName, // 관리자 이름 (단체명)
    profileImageUrl: data?.profileImageUrl, // 프로필 사진 URL
    requestCount: data?.requestCount ?? 0, // 대여 요청 개수
  };

  const rentRequests: RentRequestCardData[] =
    data?.recentRequests?.map((req) => ({
      id: String(req.rentalId),
      itemName: req.itemName,
      count: `(${req.availableQuantity}/${req.totalQuantity})`,
      applicant: `${req.borrowerName} | ${req.borrowerMajor}`,
      time: req.requestedAt,
    })) ?? [];

  // TODO: 로딩/에러 상태 처리 예시
  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">로딩 중...</div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <div className="p-6">에러가 발생했습니다.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 화면 상단 영역 - 프로필 사진, 주소 및 단체명 */}
      <div
        className="w-full max-w-[402px] h-[20%] max-h-[180px] pt-[12.66%] 
      px-[7.464%] bg-home-gradient rounded-bl-[45px]"
      >
        {/* 상단 로고 텍스트 및 사람 아이콘 */}
        <div className="w-full flex justify-between">
          <img src="/icons/home/retrivr_text_outline.svg" alt="로고 텍스트" />
          <img src="/icons/home/man_icon.svg" alt="사람 아이콘" />
        </div>
        <div className="flex w-full max-h-[72px] mt-[50.64px]">
          {/* 프로필 사진 */}
          <UserIcon></UserIcon>
          {/* 주소 및 단체 이름 */}
          <div className="pl-[12px] pt-[12.68px] gap-[4px] font-[Pretendard] leading-none flex flex-col">
            <span className="text-neutral-dark text-start text-[12px] font-[400]">
              {/* 주소 영역 - 아직 구현 X */}
            </span>
            <span className="text-neutral-white text-start text-[16px] font-[600]">
              {UserProfile.organizationName}
            </span>
          </div>
        </div>
      </div>
      {/* 대여 요청 섹션 */}
      <div className="mt-[7.464%] mx-[6.468%] bg-rental-gradient w-[87.06%] max-w-[350px] h-[320px] rounded-[33px] p-5 overflow-y-auto">
        <div className="flex justify-between pt-[4.195%]">
          <div className="w-full flex text-[1.75rem] font-bold pl-[3.228%] leading-none">
            <p className="text-[#444] pr-[2%]">대여 요청</p>
            <p className="text-[#68A5FF]">{UserProfile.requestCount}</p>
            <p className="text-[#444]">건</p>
          </div>
          <button className="transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-101 object-fit cursor-pointer pr-[7.099%]">
            <img
              src="/icons/home/right-arrow.svg"
              alt="더보기 버튼"
              onClick={() => navigate("/rental-request")}
            />
          </button>
        </div>
        <div>
          {rentRequests.length === 0 ? (
            <div className="flex items-center justify-center h-full text-neutral-dark/50 text-sm pt-[40%]">
              대여 요청이 없습니다
            </div>
          ) : (
            /* 대여 요청 있는 경우 - 수직으로 가장 오래된 요청부터 하단으로 나열 */
            <div className="flex flex-col gap-3 justify-center mt-[9.034%]">
              {rentRequests.map((items) => (
                <RentRequestCard
                  key={items.id}
                  itemName={items.itemName}
                  count={items.count}
                  applicant={items.applicant}
                  time={items.time}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* 관리 섹션 - 반납 관리, 물품 관리 */}
      <div className="flex mt-[6.468%] mx-[7.962%] w-[84.08%] max-w-[350px] h-[127px] justify-between">
        {/* 반납 관리 탭 */}
        <MenuCard menu={HOME_MENUS[0]} />
        {/* 물품 관리 탭 */}
        <MenuCard menu={HOME_MENUS[1]} />
      </div>
      {/* QR 코드 생성 버튼 */}
      <BlueButton option="makeQR"></BlueButton>
    </Layout>
  );
};

export default Home;
