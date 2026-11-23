import { useState } from "react";
import { LockerActionBar } from "../components/LockerActionBar";
import { LockerBoard } from "../components/LockerBoard";
import { LockerHeader } from "../components/LockerHeader";
import { LockerLayout } from "../components/LockerLayout";
import { LockerViewSwitch } from "../components/LockerViewSwitch";
import { LockerZoneTabs } from "../components/LockerZoneTabs";
import { RentalTypeTabs } from "../components/RentalTypeTabs";
import { Toolbar, ToolbarTitle } from "../components/LockerHome.styles";
import type { LockerSelection, LockerView, LockerZone } from "../types";

export type LockerHomePageProps = {
  placeName: string;
  zones: LockerZone[];
  zoneId?: string;
  lockerId?: string;
  loading?: boolean;
  error?: string;
  onRetry: () => void;
  onZoneChange: (id: string) => void;
  onSelectLocker: (id: string | undefined) => void;
  onBack: () => void;
  onItems: () => void;
  onRequest: (selection: LockerSelection) => void;
};

export const LockerHomePage = ({
  placeName,
  zones,
  zoneId,
  lockerId,
  loading,
  error,
  onRetry,
  onZoneChange,
  onSelectLocker,
  onBack,
  onItems,
  onRequest,
}: LockerHomePageProps) => {
  const [view, setView] = useState<LockerView>("list");
  const zone = zones.find((candidate) => candidate.id === zoneId);
  const selected = zone?.lockers.find(
    (locker) => locker.id === lockerId && locker.status === "available",
  );

  return (
    <LockerLayout>
      <LockerHeader placeName={placeName} onBack={onBack} />
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
          onSelect={onZoneChange}
        />
      </Toolbar>
      <LockerBoard
        zone={zone}
        view={view}
        selectedId={selected?.id}
        loading={loading}
        error={error}
        onRetry={onRetry}
        onSelect={(locker) =>
          onSelectLocker(locker.id === lockerId ? undefined : locker.id)
        }
      />
      {zone && selected && !loading && !error && (
        <LockerActionBar
          floating
          label={`${zone.name} ${selected.number} 대여하기`}
          onClick={() => onRequest({ zone, locker: selected })}
        />
      )}
    </LockerLayout>
  );
};
