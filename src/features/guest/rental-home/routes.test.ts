/// <reference types="node" />
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { rentalHomeClient } from "./api/client";
import {
  findRentalOrganizationByName,
  getRentalOrganization,
} from "./api/organization.api";
import {
  getRentalType,
  getSelectedLockerId,
  rentalHomePath,
  rentalSubmitPath,
} from "./routes";

const zoneId = "10000000-0000-0000-0000-000000000001";
const lockerId = "20000000-0000-0000-0000-000000000003";
const paramsOf = (path: string) =>
  new URL(path, "https://example.com").searchParams;
const originalAdapter = rentalHomeClient.defaults.adapter;
const calls: InternalAxiosRequestConfig[] = [];
const mock = (respond: (request: InternalAxiosRequestConfig) => unknown) => {
  calls.length = 0;
  const adapter: AxiosAdapter = async (config) => {
    calls.push(config);
    return {
      data: respond(config),
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
  rentalHomeClient.defaults.adapter = adapter;
};
afterEach(() => {
  rentalHomeClient.defaults.adapter = originalAdapter;
});

test("주소에는 대여지명과 하나의 대여 종류만 표시한다", () => {
  const path = rentalHomePath(
    new URLSearchParams("organizationId=42&type=locker"),
    "locker",
    "건국대학교 학생회관",
  );
  const params = paramsOf(path);
  assert.equal(params.get("place"), "건국대학교 학생회관");
  assert.equal(getRentalType(params), "locker");
  assert.ok(path.endsWith("&locker"));
  assert.equal(params.has("organizationId"), false);
  assert.equal(params.has("type"), false);
});

test("대여지명 안의 &, =, 한글, 공백을 별도 파라미터로 해석하지 않는다", () => {
  const name = "A&B = 한글 대여지 &locker";
  const path = rentalHomePath(new URLSearchParams(), "item", name);
  assert.equal(paramsOf(path).get("place"), name);
  assert.equal(getRentalType(paramsOf(path)), "item");
  assert.equal(paramsOf(path).has("locker"), false);
});

test("이전 locker=UUID와 새 locker 종류 플래그가 충돌하지 않는다", () => {
  const old = new URLSearchParams({
    organizationId: "42",
    type: "locker",
    zone: zoneId,
    locker: lockerId,
  });
  const migrated = paramsOf(rentalHomePath(old, "locker", "대여지"));
  assert.equal(migrated.get("locker"), "");
  assert.equal(migrated.get("lockerId"), lockerId);
  assert.equal(getSelectedLockerId(migrated), lockerId);
  assert.equal(migrated.get("zone"), zoneId);
});

test("물품 탭으로 이동하면 사물함 선택과 요청 ID를 제거한다", () => {
  const params = new URLSearchParams({
    place: "대여지",
    locker: "",
    lockerId,
    zone: zoneId,
    publicId: "request-id",
  });
  const next = paramsOf(rentalHomePath(params, "item"));
  assert.equal(getRentalType(next), "item");
  assert.equal(next.has("lockerId"), false);
  assert.equal(next.has("zone"), false);
  assert.equal(next.has("publicId"), false);
});

test("신청/요청 상태 주소에도 이름을 유지하고 ID 쿼리를 제거한다", () => {
  const params = new URLSearchParams({
    place: "대여지",
    organizationId: "42",
    type: "locker",
    lockerId,
    publicId: "request/id?one=1",
  });
  const next = paramsOf(rentalSubmitPath(params));
  assert.equal(next.get("place"), "대여지");
  assert.equal(next.has("organizationId"), false);
  assert.equal(next.get("publicId"), "request/id?one=1");
  assert.equal(getSelectedLockerId(next), lockerId);
});

test("물품/사물함 종류를 동시에 지정하면 유효한 종류로 선택하지 않는다", () => {
  assert.equal(getRentalType(new URLSearchParams("item&locker")), null);
  assert.equal(getRentalType(new URLSearchParams("type=locker")), "locker");
  assert.equal(getRentalType(new URLSearchParams()), "item");
});

test("이름 공유 링크는 부분 일치 결과 대신 정확한 이름의 ID를 찾는다", async () => {
  mock(() => ({
    organizations: [
      { organizationId: 2, name: "대여지 분점" },
      { organizationId: 42, name: "대여지" },
    ],
    nextCursor: null,
  }));
  const controller = new AbortController();
  assert.deepEqual(
    await findRentalOrganizationByName(" 대여지 ", controller.signal),
    { id: 42, name: "대여지" },
  );
  assert.equal(calls[0].params.keyword, "대여지");
  assert.equal(calls[0].signal, controller.signal);
});

test("다음 페이지에 동명 대여지가 있으면 첫 결과를 임의 선택하지 않는다", async () => {
  mock((request) =>
    request.params.cursor
      ? { organizations: [{ organizationId: 2, name: "대여지" }] }
      : {
          organizations: [{ organizationId: 1, name: "대여지" }],
          nextCursor: "next",
        },
  );
  await assert.rejects(findRentalOrganizationByName("대여지"), /여러 곳/);
  assert.equal(calls.length, 2);
});

test("정확한 이름이 없거나 검색 커서가 반복되면 명확히 실패한다", async () => {
  mock(() => ({ organizations: [{ organizationId: 1, name: "대여지 분점" }] }));
  await assert.rejects(findRentalOrganizationByName("대여지"), /찾지 못/);
  mock(() => ({ organizations: [], nextCursor: "same" }));
  await assert.rejects(findRentalOrganizationByName("대여지"), /완료하지 못/);
  assert.equal(calls.length, 2);
});

test("이전 ID 주소를 변환할 때 다른 대여지의 메타데이터를 사용하지 않는다", async () => {
  mock(() => ({ organizationId: 2, organizationName: "다른 대여지" }));
  await assert.rejects(getRentalOrganization(1), /확인할 수 없/);
});
