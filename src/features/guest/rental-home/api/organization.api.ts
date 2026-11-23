import { rentalHomeClient } from "./client";

// 구역 목록에는 대여지명이 없어 기존 공개 대여지 응답의 메타데이터를 사용한다.
export const getRentalOrganization = async (
  organizationId: number,
  signal?: AbortSignal,
) => {
  const { data } = await rentalHomeClient.get<{
    organizationId: number;
    organizationName: string;
  }>(`/api/public/v1/organizations/${organizationId}/items`, {
    params: { size: 1 },
    signal,
  });
  if (data.organizationId !== organizationId || !data.organizationName?.trim())
    throw new Error("대여지 정보를 확인할 수 없습니다.");
  return { id: data.organizationId, name: data.organizationName };
};

export type RentalPlace = { id: number; name: string };
export const findRentalOrganizationByName = async (
  name: string,
  signal?: AbortSignal,
): Promise<RentalPlace> => {
  const keyword = name.trim().normalize("NFC");
  if (!keyword) throw new Error("대여지를 먼저 선택해주세요.");
  const matches = new Map<number, RentalPlace>();
  const seen = new Set<string>();
  let cursor: string | undefined;
  do {
    const { data } = await rentalHomeClient.get<{
      organizations: { organizationId: number; name: string }[];
      nextCursor?: string | null;
    }>("/api/public/v1/organizations/search", {
      params: { keyword, cursor, size: 15 },
      signal,
    });
    if (!Array.isArray(data.organizations))
      throw new Error("대여지 검색 응답을 확인할 수 없습니다.");
    for (const place of data.organizations) {
      if (
        place.name.trim().normalize("NFC") === keyword &&
        Number.isSafeInteger(place.organizationId) &&
        place.organizationId > 0
      )
        matches.set(place.organizationId, {
          id: place.organizationId,
          name: place.name,
        });
    }
    if (matches.size > 1)
      throw new Error(
        "같은 이름의 대여지가 여러 곳입니다. 검색 화면에서 대여지를 선택해주세요.",
      );
    cursor = data.nextCursor || undefined;
    if (cursor && seen.has(cursor))
      throw new Error(
        "대여지 검색을 완료하지 못했습니다. 검색 화면에서 다시 선택해주세요.",
      );
    if (cursor) seen.add(cursor);
  } while (cursor);
  const place = [...matches.values()][0];
  if (!place)
    throw new Error(
      "해당 이름의 대여지를 찾지 못했습니다. 검색 화면에서 다시 선택해주세요.",
    );
  return place;
};
