import type { Locker } from "../types";
import { LockerButton, LockerNumber, LockerStatus } from "./LockerHome.styles";

const statusLabel = {
  available: "대여 가능",
  rented: "대여 중",
  unavailable: "이용 불가",
  pending: "승인 대기",
  disabled: "사용 중지",
};

export const LockerCard = ({
  locker,
  selected,
  positioned,
  onSelect,
}: {
  locker: Locker;
  selected: boolean;
  positioned: boolean;
  onSelect: () => void;
}) => (
  <LockerButton
    type="button"
    $selected={selected}
    $status={locker.status}
    $row={positioned ? locker.row : undefined}
    $column={positioned ? locker.column : undefined}
    $rowSpan={positioned ? locker.rowSpan : undefined}
    $columnSpan={positioned ? locker.columnSpan : undefined}
    aria-pressed={selected}
    aria-label={`${locker.number}번 사물함, ${statusLabel[locker.status]}`}
    disabled={locker.status !== "available"}
    onClick={onSelect}
  >
    <LockerNumber>{locker.number}</LockerNumber>
    <LockerStatus $available={locker.status === "available"}>
      {statusLabel[locker.status]}
    </LockerStatus>
  </LockerButton>
);
