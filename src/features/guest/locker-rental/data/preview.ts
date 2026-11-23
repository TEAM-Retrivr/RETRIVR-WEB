import type { LockerRentalPlace, LockerZone } from "../types";

export const previewPlace: LockerRentalPlace = {
  name: "건국대학교 학생회관",
  rentalDays: 3,
  guaranteedGoods: "학생증 또는 신분증",
};

const createZone = (
  id: string,
  name: string,
  total: number,
  rented: number[],
): LockerZone => ({
  id,
  name,
  columns: 5,
  lockers: Array.from({ length: total }, (_, index) => ({
    id: `${id}-${index + 1}`,
    number: String(index + 1),
    status: rented.includes(index + 1) ? "rented" : "available",
    row: Math.floor(index / 5) + 1,
    column: (index % 5) + 1,
  })),
});

// Figma 기반 개발 미리보기 데이터. 운영 목록으로 사용하지 않는다.
// 가용 수량은 실제 카드 상태로부터 계산한다.
export const previewZones: LockerZone[] = [
  createZone("floor-4", "4층", 30, [2, 8, 9, 13, 14, 19, 22]),
  createZone("floor-5-a", "5층 A", 10, [2, 6, 9]),
  createZone("floor-5-b", "5층 B", 15, [8]),
  createZone("floor-6", "6층", 10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
];
