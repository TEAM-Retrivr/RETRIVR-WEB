import type { Locker, LockerZone } from "../../locker-rental/types";
import type {
  LockerLayoutResponse,
  LockerStatus,
  LockerZoneResponse,
  PublicLockerResponse,
} from "../api/locker.types";

const statuses: Record<LockerStatus, Locker["status"]> = {
  AVAILABLE: "available",
  RENTED: "rented",
  PENDING: "pending",
  UNAVAILABLE: "unavailable",
  DISABLED: "disabled",
};
export const mapLocker = (locker: PublicLockerResponse): Locker => ({
  id: locker.lockerId,
  number: locker.label,
  status: statuses[locker.status] ?? "unavailable",
  row: locker.rowIndex + 1,
  column: locker.columnIndex + 1,
});
export const mapLockerZone = (zone: LockerZoneResponse): LockerZone => ({
  id: zone.zoneId,
  name: zone.name,
  columns: zone.columns,
  availableCount: zone.availableCount,
  totalCount: zone.totalCount,
  lockers: [],
});
export const mapLockerLayout = (layout: LockerLayoutResponse): LockerZone => ({
  ...mapLockerZone(layout.zone),
  lockers: layout.lockers
    .filter((locker) => !locker.parentId)
    .map((locker) => {
      const parts = [
        locker,
        ...layout.lockers.filter((child) => child.parentId === locker.lockerId),
      ];
      const firstRow = Math.min(...parts.map((part) => part.rowIndex));
      const firstColumn = Math.min(...parts.map((part) => part.columnIndex));
      return {
        ...mapLocker(locker),
        row: firstRow + 1,
        column: firstColumn + 1,
        rowSpan: Math.max(...parts.map((part) => part.rowIndex)) - firstRow + 1,
        columnSpan:
          Math.max(...parts.map((part) => part.columnIndex)) - firstColumn + 1,
      };
    }),
});
