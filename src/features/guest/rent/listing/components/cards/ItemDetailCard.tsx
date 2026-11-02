import type { RentalItem } from "../../types";
import divider from "../../assets/divider.svg";
import CircularProgressBar from "../../../../../common/components/progress/CircularProgressBar";
import {
  Details,
  Heading,
  Text,
  Name,
  Description,
  Divider,
  Information,
} from "./ItemDetailCard.styles";
const ItemDetailCard = ({ item }: { item: RentalItem }) => (
  <Details>
    <Heading>
      <Text>
        <Name>{item.name}</Name>
        {item.description && <Description>{item.description}</Description>}
      </Text>
      <CircularProgressBar
        available={item.availableQuantity}
        total={item.totalQuantity}
        isActive={item.isActive}
      />
    </Heading>
    <Divider src={divider} alt="" width={350} height={1} />
    <Information>
      <dt>대여 기간</dt>
      <dd>{item.rentalDuration}일</dd>
      <dt>담보 물품</dt>
      <dd>{item.guaranteedGoods?.trim() || "없음"}</dd>
    </Information>
  </Details>
);
export default ItemDetailCard;
