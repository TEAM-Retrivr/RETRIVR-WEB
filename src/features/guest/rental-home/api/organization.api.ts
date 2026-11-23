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
  return { id: data.organizationId, name: data.organizationName };
};
