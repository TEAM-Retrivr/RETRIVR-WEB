import { Layout } from "../../components/Layout";
import RentalAvailableItemCard from "../../components/client/RentalAvailableItemCard";
import type { ItemRequest } from "../../types/item";

// 더미데이터 -> API 연동 후 삭제 예정
const DUMMY_ITEM_REQUESTS: ItemRequest[] = [
  {
    item: {
      itemId: 1,
      name: "C타입 충전기",
      availableQuantity: 3,
      totalQuantity: 5,
      isActive: true,
      rentalDuration: 3,
      description: "어댑터 미포함",
      guaranteedGoods: "학생증 또는 신분증",
    },
    nextCursor: 2,
  },
  {
    item: {
      itemId: 2,
      name: "멀티탭 (4구)",
      availableQuantity: 5,
      totalQuantity: 10,
      isActive: true,
      rentalDuration: 2,
      description: "최대 2200W 사용 가능",
      guaranteedGoods: "학생증",
    },
    nextCursor: 3,
  },
  {
    item: {
      itemId: 3,
      name: "보조 배터리",
      availableQuantity: 1,
      totalQuantity: 8,
      isActive: true,
      rentalDuration: 1,
      description: "케이블 별도 지참",
      guaranteedGoods: "학생증 또는 신분증",
    },
    nextCursor: 4,
  },
  {
    item: {
      itemId: 4,
      name: "우산",
      availableQuantity: 7,
      totalQuantity: 20,
      isActive: true,
      rentalDuration: 1,
      description: "반납 시 상태 확인",
      guaranteedGoods: "학생증",
    },
    nextCursor: 5,
  },
  {
    item: {
      itemId: 5,
      name: "노트북 거치대",
      availableQuantity: 2,
      totalQuantity: 4,
      isActive: true,
      rentalDuration: 7,
      description: "알루미늄 재질",
      guaranteedGoods: "학생증 또는 신분증",
    },
    nextCursor: 6,
  },
];

const ClientHome = () => {
  return (
    <Layout>
      {/* 화면 상단 영역 - 대여지 프로필 사진, 대여지명 */}
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
          <div />
          {/* 주소 및 단체 이름 */}
          <div className="pl-[12px] pt-[12.68px] gap-[4px] font-[Pretendard] leading-none flex flex-col">
            <span className="text-neutral-dark text-start text-[12px] font-[400]">
              {/* 주소 영역 - 아직 구현 X */}
            </span>
            <span className="text-neutral-white text-start text-[16px] font-[600]">
              이름
            </span>
          </div>
        </div>
      </div>
      {/* 화면 하단 영역 - 대여 가능 물품 리스트 */}
      <div className="flex flex-col font-[Pretendard] pt-10 px-6.5 gap-5">
        <p className="text-18px text-secondary-2 opacity-[0.9] font-[700]">
          대여 가능 물품
        </p>
        <div className="flex flex-col gap-3.5">
          {DUMMY_ITEM_REQUESTS.map((itemRequest) => (
            <RentalAvailableItemCard
              key={itemRequest.item.itemId}
              itemInfo={itemRequest}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ClientHome;
