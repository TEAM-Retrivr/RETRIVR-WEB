// 대여 요청 API 함수 예시
// TODO: 실제 API 엔드포인트로 교체할 것

import type { RentRequest } from "../types/rentRequest";

/**
 * 대여 요청 API 응답 타입
 */
export interface RentRequestsResponse {
  count: number; // 전체 대여 요청 개수
  requests: RentRequest[]; // 대여 요청 목록
}

/**
 * 대여 요청 목록을 가져오는 API 함수
 * @returns Promise<RentRequestsResponse>
 */
export const fetchRentRequests = async (): Promise<RentRequestsResponse> => {
  // TODO: 실제 API 호출로 교체할 것
  // 예시:
  // const response = await axios.get('/api/rent-requests');
  // return response.data; // { count: 5, requests: [...] }

  // 임시 더미 데이터 (개발용)
  const dummyRequests: RentRequest[] = [
    {
      id: "1",
      itemName: "8핀 충전기",
      count: "(2/5)",
      applicant: "조윤아 | 동물자원학과",
      time: "2026-01-21 17:00",
    },
    {
      id: "2",
      itemName: "노트북 거치대",
      count: "(1/3)",
      applicant: "조성호 | 컴퓨터공학부",
      time: "2026-01-21 16:30",
    },
  ];

  return {
    count: dummyRequests.length,
    requests: dummyRequests,
  };
};
