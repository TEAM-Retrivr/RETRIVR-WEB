import { useState } from "react";
import { LockerActionBar } from "../components/LockerActionBar";
import { LockerBoard } from "../components/LockerBoard";
import { LockerHeader } from "../components/LockerHeader";
import { LockerLayout } from "../components/LockerLayout";
import { LockerViewSwitch } from "../components/LockerViewSwitch";
import { LockerZoneTabs } from "../components/LockerZoneTabs";
import { RentalTypeTabs } from "../components/RentalTypeTabs";
import { Toolbar, ToolbarTitle } from "../components/LockerHome.styles";
import type {
  LockerRentalPlace,
  LockerSelection,
  LockerView,
  LockerZone,
} from "../types";

export type LockerHomePageProps = {
  place: LockerRentalPlace;
  zones: LockerZone[];
  initialZoneId?: string;
  initialLockerId?: string;
  onBack: () => void;
  onItems: () => void;
  onRequest: (selection: LockerSelection) => void;
};

export const LockerHomePage = ({
  place,
  zones,
  initialZoneId,
  initialLockerId,
  onBack,
  onItems,
  onRequest,
}: LockerHomePageProps) => {
  const [zoneId, setZoneId] = useState(initialZoneId ?? zones[0]?.id);
  const [lockerId, setLockerId] = useState(initialLockerId);
  const [view, setView] = useState<LockerView>("list");
  const zone = zones.find((candidate) => candidate.id === zoneId) ?? zones[0];
  const selected = zone?.lockers.find(
    (locker) => locker.id === lockerId && locker.status === "available",
  );

  return (
    <LockerLayout>
      <LockerHeader placeName={place.name} onBack={onBack} />
      <RentalTypeTabs onItems={onItems} />
      <Toolbar>
        <ToolbarTitle>
          <h1>
            {view === "layout"
              ? "옆으로 밀어 더 볼 수 있어요"
              : "대여할 사물함을 선택해주세요"}
          </h1>
          <LockerViewSwitch value={view} onChange={setView} />
        </ToolbarTitle>
        <LockerZoneTabs
          zones={zones}
          selectedId={zone?.id}
          onSelect={(id) => {
            setZoneId(id);
            setLockerId(undefined);
          }}
        />
      </Toolbar>
      <LockerBoard
        zone={zone}
        view={view}
        selectedId={selected?.id}
        onSelect={(locker) =>
          setLockerId(locker.id === lockerId ? undefined : locker.id)
        }
      />
      {zone && selected && (
        <LockerActionBar
          floating
          label={`${zone.name} ${selected.number} 대여하기`}
          onClick={() => onRequest({ zone, locker: selected })}
        />
      )}
    </LockerLayout>
  );
};
