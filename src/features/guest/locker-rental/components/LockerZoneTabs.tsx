import type { LockerZone } from "../types";
import {
  AvailableCount,
  TotalCount,
  ZoneButton,
  ZoneList,
} from "./LockerHome.styles";

export const LockerZoneTabs = ({
  zones,
  selectedId,
  onSelect,
}: {
  zones: LockerZone[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) => (
  <ZoneList role="group" aria-label="사물함 구역">
    {zones.map((zone) => {
      const available = zone.lockers.filter(
        (locker) => locker.status === "available",
      ).length;
      const selected = zone.id === selectedId;
      return (
        <ZoneButton
          key={zone.id}
          type="button"
          $active={selected}
          aria-pressed={selected}
          aria-label={`${zone.name}, ${zone.lockers.length}개 중 ${available}개 대여 가능`}
          onClick={() => onSelect(zone.id)}
        >
          {zone.name}
          <AvailableCount $empty={available === 0}>
            {available}
            {selected && <TotalCount> / {zone.lockers.length}</TotalCount>}
          </AvailableCount>
        </ZoneButton>
      );
    })}
  </ZoneList>
);
