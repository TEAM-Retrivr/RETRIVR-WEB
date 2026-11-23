import type { Locker, LockerView, LockerZone } from "../types";
import { LockerCard } from "./LockerCard";
import { Board, BoardViewport, EmptyMessage } from "./LockerHome.styles";

export const LockerBoard = ({
  zone,
  view,
  selectedId,
  onSelect,
}: {
  zone?: LockerZone;
  view: LockerView;
  selectedId?: string;
  onSelect: (locker: Locker) => void;
}) => (
  <BoardViewport
    key={zone?.id}
    aria-label={
      zone
        ? `${zone.name} 사물함 ${view === "layout" ? "배치도" : "목록"}`
        : "사물함 목록"
    }
    tabIndex={0}
  >
    {zone?.lockers.length ? (
      <Board $columns={Math.max(1, zone.columns)}>
        {[...zone.lockers]
          .sort((a, b) => a.row - b.row || a.column - b.column)
          .map((locker) => (
            <LockerCard
              key={locker.id}
              locker={locker}
              selected={locker.id === selectedId}
              positioned={view === "layout"}
              onSelect={() => onSelect(locker)}
            />
          ))}
      </Board>
    ) : (
      <EmptyMessage role="status">등록된 사물함이 없습니다.</EmptyMessage>
    )}
  </BoardViewport>
);
