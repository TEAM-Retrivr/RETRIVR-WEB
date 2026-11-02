import { useRef, useState } from "react";
import ItemStatusCard from "../../../../../../components/cards/admin/management/ItemStatusCard";
import ButtonBar from "../../../../../common/components/buttons/ButtonBar";
import type { RentalItem, RentalUnit } from "../../types";
import { isUnitAvailable } from "../../types";
import ItemDetailCard from "../../components/cards/ItemDetailCard";
import chevron from "../../assets/chevron-down.svg";
import { useItemBottomSheetClose } from "../ItemBottomSheet.context";
import {
  Content,
  Selection,
  Select,
  Chevron,
  Collapse,
  CollapseBody,
  UnitList,
  UnitOption,
} from "./UnitItemBottomSheet.styles";

type Props = {
  item: RentalItem;
  units: RentalUnit[];
  onRent: (unit: RentalUnit) => void;
};
const UnitItemBottomSheet = ({ item, units, onRent }: Props) => {
  const closeSheet = useItemBottomSheetClose();
  const [expanded, setExpanded] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectRef = useRef<HTMLButtonElement>(null);
  const selected = units.find(
    (unit) => unit.itemUnitId === selectedId && isUnitAvailable(unit),
  );
  return (
    <Content>
      <ItemDetailCard item={item} />
      <Selection>
        <Select
          ref={selectRef}
          type="button"
          aria-expanded={expanded}
          aria-controls="rental-unit-list"
          onClick={() => setExpanded((value) => !value)}
        >
          <span>{selected?.label ?? "물품 선택"}</span>
          <Chevron
            src={chevron}
            alt=""
            width={20}
            height={20}
            $open={expanded}
          />
        </Select>
        <Collapse
          $expanded={expanded}
          aria-hidden={!expanded}
          inert={!expanded}
        >
          <CollapseBody>
            <UnitList
              id="rental-unit-list"
              role="group"
              aria-label="대여할 세부 물품"
            >
              {units.length === 0 ? (
                <p>등록된 세부 물품이 없습니다.</p>
              ) : (
                units.map((unit) => (
                  <UnitOption
                    key={unit.itemUnitId}
                    $selected={unit.itemUnitId === selectedId}
                  >
                    <ItemStatusCard
                      variant="rental-selection"
                      itemName={unit.label}
                      status={
                        isUnitAvailable(unit)
                          ? "rentalAvailable"
                          : unit.status === "RENTED" ||
                              unit.status === "RENTAL_PENDING"
                            ? "rentedOut"
                            : "rentalUnavailable"
                      }
                      statusLabel={
                        unit.status === "RENTAL_PENDING"
                          ? "승인 대기"
                          : undefined
                      }
                      selected={unit.itemUnitId === selectedId}
                      disabled={!isUnitAvailable(unit)}
                      onSelect={() => {
                        if (isUnitAvailable(unit)) {
                          setSelectedId(unit.itemUnitId);
                          setExpanded(false);
                          selectRef.current?.focus({ preventScroll: true });
                        }
                      }}
                    />
                  </UnitOption>
                ))
              )}
            </UnitList>
          </CollapseBody>
        </Collapse>
      </Selection>
      <ButtonBar
        label="대여하기"
        disabled={!selected || !item.isActive || item.availableQuantity <= 0}
        onClick={() => {
          if (selected) closeSheet(() => onRent(selected));
        }}
      />
    </Content>
  );
};
export default UnitItemBottomSheet;
