import CircularProgressBar from "../../../../../common/components/progress/CircularProgressBar";
import type { RentalItem } from "../../types";
import {
  Card,
  ItemText,
  Name,
  Description,
  Unavailable,
  LoadingSlot,
  Spinner,
} from "./ItemCard.styles";

type ItemCardProps = {
  item: RentalItem;
  onClick: () => void;
  loading?: boolean;
};
const ItemCard = ({ item, onClick, loading = false }: ItemCardProps) => {
  const canRent = item.isActive && item.availableQuantity > 0;
  return (
    <Card
      type="button"
      disabled={!canRent}
      onClick={loading ? undefined : onClick}
      aria-busy={loading}
      aria-disabled={!canRent || loading}
      aria-haspopup="dialog"
    >
      <ItemText>
        <Name>{item.name}</Name>
        {canRent ? (
          item.description && <Description>{item.description}</Description>
        ) : (
          <Unavailable>대여 불가</Unavailable>
        )}
      </ItemText>
      {loading ? (
        <LoadingSlot role="status" aria-label="물품 정보를 불러오는 중입니다.">
          <Spinner aria-hidden="true" />
        </LoadingSlot>
      ) : (
        <CircularProgressBar
          available={item.availableQuantity}
          total={item.totalQuantity}
          isActive={item.isActive}
        />
      )}
    </Card>
  );
};
export default ItemCard;
