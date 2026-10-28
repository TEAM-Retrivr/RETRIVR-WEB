import Chip from "../chip/Chip";
import ConfirmCard from "./ConfirmCard";

import {
  Title,
  ChipGroup,
  ShortcutSection,
  ShortcutChipSection,
  ShortcutResult,
  NoShortcutResult,
} from "./HomeShortcut.styles";

const HomeShortcut = () => {
  return (
    <ShortcutSection>
      {/* 대여 요청 제목 및 칩 */}
      <ShortcutChipSection>
        <Title>대여 요청</Title>
        <ChipGroup>
          <Chip title="전체" count={1} />
          <Chip title="물품" count={2} />
          <Chip title="사물함" count={0} />
        </ChipGroup>
      </ShortcutChipSection>
      {/* 카드 보이는 영역 / 전체 / 물품 / 사물함 */}
      <ShortcutResult>
        {/* <NoShortcutResult>대여 요청이 없어요</NoShortcutResult> */}
        <ConfirmCard
          type="사물함"
          expiredAt="요청 만료까지 14:49:10"
          itemName="4층 2"
          name="이리버"
          contact="010-3338-5583"
        />
        <ConfirmCard
          type="물품"
          expiredAt="요청 만료까지 14:49:10"
          itemName="8핀 충전기"
          name="이리버"
          contact="010-3338-5583"
        />
        <ConfirmCard
          type="물품"
          expiredAt="요청 만료까지 14:49:10"
          itemName="8핀 충전기"
          name="이리버"
          contact="010-3338-5583"
        />
      </ShortcutResult>
    </ShortcutSection>
  );
};

export default HomeShortcut;
