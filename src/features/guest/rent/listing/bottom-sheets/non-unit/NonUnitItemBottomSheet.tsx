import ButtonBar from "../../../../../common/components/buttons/ButtonBar";
import type { RentalItem } from "../../types";
import ItemDetailCard from "../../components/cards/ItemDetailCard";
import { Content } from "./NonUnitItemBottomSheet.styles";
import { useItemBottomSheetClose } from "../ItemBottomSheet.context";
type Props = { item: RentalItem; onRent: () => void };
const NonUnitItemBottomSheet = ({ item, onRent }: Props) => {
  const closeSheet = useItemBottomSheetClose();
  return (
    <Content>
      <ItemDetailCard item={item} />
      <ButtonBar
        label="대여하기"
        disabled={!item.isActive || item.availableQuantity <= 0}
        onClick={() => closeSheet(onRent)}
      />
    </Content>
  );
};
export default NonUnitItemBottomSheet;
