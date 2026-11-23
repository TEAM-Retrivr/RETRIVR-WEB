/// <reference types="node" />
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { rentalHomeClient } from "./client";
import { completeLockerApproval } from "./approval.api";
import { sendLockerPhoneCode, verifyLockerPhoneCode } from "./auth.api";
import {
  createLockerRental,
  getLockerLayout,
  getLockerRentalForm,
  getLockerRentalStatus,
  getLockerZones,
} from "./locker.api";
import type {
  LockerLayoutResponse,
  LockerRentalFormResponse,
  LockerRentalResponse,
} from "./locker.types";
import { mapLockerLayout } from "../model/locker.mappers";
import { lockerRequestBody } from "../model/locker.request";

const zoneId = "10000000-0000-0000-0000-000000000001";
const lockerId = "20000000-0000-0000-0000-000000000003";
const rentalId = "30000000-0000-0000-0000-000000000001";
const zone = {
  zoneId,
  name: "4층",
  rows: 2,
  columns: 3,
  totalCount: 6,
  availableCount: 2,
};
const locker = {
  lockerId,
  label: "3",
  rowIndex: 0,
  columnIndex: 2,
  parentId: null,
  status: "AVAILABLE" as const,
  extensionAvailable: false,
};
const form: LockerRentalFormResponse = {
  organizationName: "대여지",
  zone,
  locker,
  policy: {
    rentalDays: 3,
    maxExtensionCount: 2,
    extensionDays: 7,
    terms: "서버 약관",
    termsVersion: 7,
    collateral: "학생증",
    borrowerFields: [
      { fieldKey: "studentId", label: "학번", required: true, sortOrder: 0 },
    ],
  },
  startDate: "2026-11-12",
  dueDate: "2026-11-15",
};
const created: LockerRentalResponse = {
  rentalId,
  publicId: "public-id",
  status: "REQUESTED",
  requestedAt: "2026-11-12 10:00",
  expiresAt: "2026-11-12 10:15",
};
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

test("공개 조회는 기관 ID와 abort signal을 전달하고 로그인 Bearer를 보내지 않는다", async () => {
  mock(() => ({ zones: [zone] }));
  const controller = new AbortController();
  assert.equal(
    (await getLockerZones(42, controller.signal)).zones[0].zoneId,
    zoneId,
  );
  assert.equal(calls[0].url, "/api/public/v1/organizations/42/locker-zones");
  assert.equal(calls[0].signal, controller.signal);
  assert.equal(calls[0].headers.get("Authorization"), undefined);
  assert.equal(calls[0].method, "get");
});

test("잘못된 기관/사물함 ID는 서버에 요청하지 않는다", async () => {
  mock(() => {
    throw new Error("호출되면 안 됨");
  });
  await assert.rejects(getLockerZones(0));
  await assert.rejects(getLockerLayout("floor-4"));
  await assert.rejects(getLockerRentalForm("../lockers"));
  assert.equal(calls.length, 0);
});

test("대여자 인증은 renewal 클라이언트에서 BORROW 목적과 검증 ID를 전달한다", async () => {
  mock((request) =>
    request.url?.endsWith("send-code")
      ? { verificationId: "phone-id" }
      : { rawToken: "verified-phone-token", tokenId: "token-id" },
  );
  assert.deepEqual(
    await sendLockerPhoneCode({
      phoneNumber: "010-1234-5678",
      purpose: "BORROW",
    }),
    { verificationId: "phone-id" },
  );
  assert.deepEqual(
    await verifyLockerPhoneCode({
      verificationId: "phone-id",
      purpose: "BORROW",
      rawCode: "123456",
    }),
    { rawToken: "verified-phone-token", tokenId: "token-id" },
  );
  assert.deepEqual(JSON.parse(calls[1].data), {
    verificationId: "phone-id",
    purpose: "BORROW",
    rawCode: "123456",
  });
  assert.equal(calls[0].headers.get("Authorization"), undefined);
  assert.equal(calls[1].headers.get("Authorization"), undefined);
});

test("구역/신청 폼의 식별자가 다르면 다른 사물함 데이터로 진행하지 않는다", async () => {
  mock(() => ({ zone: { ...zone, zoneId: "다른 구역" }, lockers: [] }));
  await assert.rejects(getLockerLayout(zoneId), /일치하지/);
  mock(() => ({ ...form, locker: { ...locker, lockerId: "다른 사물함" } }));
  await assert.rejects(getLockerRentalForm(lockerId), /일치하지/);
});

test("서버 약관 버전과 날짜/입력 항목을 보존하고 약관이 없으면 차단한다", async () => {
  mock(() => form);
  assert.deepEqual(await getLockerRentalForm(lockerId), form);
  mock(() => ({ ...form, policy: { ...form.policy, termsVersion: 0 } }));
  await assert.rejects(getLockerRentalForm(lockerId), /약관/);
});

test("신청은 숫자 전화번호·rawToken·서버 fieldKey·동의 약관 버전을 전송한다", async () => {
  const body = lockerRequestBody({
    zoneId,
    lockerId,
    name: " 대여자 ",
    additionalInfo: { studentId: "202600000", customField: "값" },
    requestNote: " 요청 ",
    credentials: {
      phone: "010-1234-5678",
      tokenId: "verification-id",
      rawToken: "verified-phone-token",
    },
    termsVersion: 7,
  });
  mock(() => created);
  assert.deepEqual(await createLockerRental(lockerId, body), created);
  assert.equal(calls[0].url, `/api/public/v1/lockers/${lockerId}/rentals`);
  assert.equal(calls[0].method, "post");
  assert.deepEqual(JSON.parse(calls[0].data), {
    borrower: {
      name: "대여자",
      phone: "01012345678",
      additionalInfo: { studentId: "202600000", customField: "값" },
      requestNote: "요청",
      phoneVerificationToken: "verified-phone-token",
    },
    termsAgreed: true,
    termsVersion: 7,
  });
  assert.equal(calls[0].headers.get("Authorization"), undefined);
});

test("신청 응답의 공개 ID가 없으면 대기 화면으로 진행하지 않는다", async () => {
  mock(() => ({ ...created, publicId: "" }));
  const body = {
    borrower: {
      name: "대여자",
      phone: "01012345678",
      additionalInfo: {},
      phoneVerificationToken: "token",
    },
    termsAgreed: true as const,
    termsVersion: 1,
  };
  await assert.rejects(createLockerRental(lockerId, body), /요청 결과/);
});

test("공개 ID는 URL 인코딩하며 다른 요청/알 수 없는 상태 응답은 차단한다", async () => {
  const publicId = "public/id?one=1";
  mock(() => ({ ...created, publicId }));
  await getLockerRentalStatus(publicId);
  assert.equal(
    calls[0].url,
    `/api/public/v1/locker-rentals/${encodeURIComponent(publicId)}`,
  );
  mock(() => created);
  await assert.rejects(getLockerRentalStatus("other-id"));
  mock(() => ({ ...created, status: "UNKNOWN" }));
  await assert.rejects(getLockerRentalStatus(created.publicId));
});

test("현장 승인은 로그인 JWT와 코드 검증 토큰을 구분해서 순서대로 사용한다", async () => {
  mock((request) => {
    if (request.url?.endsWith("auth/login"))
      return {
        organizationId: 42,
        email: "manager@example.com",
        accessToken: "login-jwt",
      };
    if (request.url?.endsWith("admin-code/verification"))
      return { rawToken: "verified-admin-code-token" };
    return {
      id: rentalId,
      status: "APPROVED",
      processedAt: "2026-11-12 10:05",
    };
  });
  const result = await completeLockerApproval(created.publicId, {
    email: " manager@example.com ",
    password: "test-only-password",
    managerName: " 담당자 ",
    adminCode: "123456",
    organizationId: 42,
  });
  assert.equal(result.status, "APPROVED");
  assert.equal(calls.length, 3);
  assert.equal(calls[0].withCredentials, true);
  assert.deepEqual(JSON.parse(calls[0].data), {
    email: "manager@example.com",
    password: "test-only-password",
  });
  assert.equal(calls[1].url, "/api/admin/v1/admin-code/verification");
  assert.equal(calls[1].headers.get("Authorization"), "Bearer login-jwt");
  assert.deepEqual(JSON.parse(calls[1].data), {
    adminCode: "123456",
    purpose: "IMMEDIATE_APPROVAL",
  });
  assert.equal(calls[2].url, "/api/public/v1/locker-rentals/public-id/approve");
  assert.equal(calls[2].headers.get("Authorization"), undefined);
  assert.deepEqual(JSON.parse(calls[2].data), {
    adminNameToApprove: "담당자",
    adminCodeVerificationToken: "verified-admin-code-token",
  });
});

test("다른 대여지 관리자 또는 코드 검증 실패 시 승인 요청을 보내지 않는다", async () => {
  const input = {
    email: "manager@example.com",
    password: "test-only",
    managerName: "담당자",
    adminCode: "123456",
    organizationId: 42,
  };
  mock(() => ({ organizationId: 9, accessToken: "jwt", email: input.email }));
  await assert.rejects(
    completeLockerApproval(created.publicId, input),
    /대여지/,
  );
  assert.equal(calls.length, 1);
  mock((request) => {
    if (request.url?.endsWith("auth/login"))
      return { organizationId: 42, accessToken: "jwt", email: input.email };
    throw new Error("관리자 코드 불일치");
  });
  await assert.rejects(
    completeLockerApproval(created.publicId, input),
    /불일치/,
  );
  assert.equal(calls.length, 2);
});

test("0부터 시작하는 배치 좌표와 병합된 사물함/서버 수량을 보존한다", () => {
  const data: LockerLayoutResponse = {
    zone,
    lockers: [
      locker,
      { ...locker, lockerId: "child", parentId: lockerId, rowIndex: 1 },
      { ...locker, lockerId: "pending", columnIndex: 0, status: "PENDING" },
    ],
  };
  const mapped = mapLockerLayout(data);
  assert.equal(mapped.availableCount, 2);
  assert.equal(mapped.totalCount, 6);
  assert.equal(mapped.lockers.length, 2);
  assert.deepEqual(
    {
      row: mapped.lockers[0].row,
      column: mapped.lockers[0].column,
      rowSpan: mapped.lockers[0].rowSpan,
      columnSpan: mapped.lockers[0].columnSpan,
    },
    { row: 1, column: 3, rowSpan: 2, columnSpan: 1 },
  );
  assert.equal(mapped.lockers[1].status, "pending");
});
