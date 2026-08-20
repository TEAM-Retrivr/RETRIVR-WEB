import * as PortOne from "@portone/browser-sdk/v2";
import type { AdminPaymentMethodProvider } from "../api/admin/admin.type";
import {
  REGISTER_OPTION_PROVIDER,
  type PaymentMethodRegisterOption,
} from "../types/paymentMethod";

const ISSUE_NAME = "Retrivr 정기결제 수단 등록";
const OPTION_STORAGE_KEY = "retrivr.portone.paymentMethodOption";
const BILLING_KEY_SAVE_STORAGE_KEY = "retrivr.portone.billingKeySave";
const PORTONE_OVERLAY_ID = "imp-iframe-wrapper";

type PortoneMethodConfig = {
  provider: AdminPaymentMethodProvider;
  billingKeyMethod: "CARD" | "EASY_PAY";
  channelKeyEnv:
    | "VITE_PORTONE_CHANNEL_KEY_KAKAOPAY"
    | "VITE_PORTONE_CHANNEL_KEY_KGINICIS";
};

const METHOD_CONFIG: Record<PaymentMethodRegisterOption, PortoneMethodConfig> =
  {
    kakao: {
      provider: REGISTER_OPTION_PROVIDER.kakao,
      billingKeyMethod: "EASY_PAY",
      channelKeyEnv: "VITE_PORTONE_CHANNEL_KEY_KAKAOPAY",
    },
    card: {
      provider: REGISTER_OPTION_PROVIDER.card,
      billingKeyMethod: "CARD",
      channelKeyEnv: "VITE_PORTONE_CHANNEL_KEY_KGINICIS",
    },
  };

export type PortoneIssueResult =
  | { ok: true; billingKey: string; provider: AdminPaymentMethodProvider }
  | {
      ok: false;
      reason: "cancelled" | "failed" | "not_configured";
      message: string;
    };

const readEnv = (key: keyof ImportMetaEnv) => import.meta.env[key]?.trim() ?? "";

export const getPortoneProvider = (option: PaymentMethodRegisterOption) =>
  METHOD_CONFIG[option].provider;

export const savePortoneRegisterOption = (
  option: PaymentMethodRegisterOption,
) => {
  sessionStorage.setItem(OPTION_STORAGE_KEY, option);
};

export const readPortoneRegisterOption = () => {
  const stored = sessionStorage.getItem(OPTION_STORAGE_KEY);
  if (stored === "kakao" || stored === "card") {
    return stored;
  }
  return null;
};

export const clearPortoneRegisterOption = () => {
  sessionStorage.removeItem(OPTION_STORAGE_KEY);
};

type BillingKeySaveState = {
  billingKey: string;
  status: "saving" | "saved";
};

const readBillingKeySaveState = (): BillingKeySaveState | null => {
  const stored = sessionStorage.getItem(BILLING_KEY_SAVE_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as BillingKeySaveState;
    if (
      typeof parsed.billingKey === "string" &&
      (parsed.status === "saving" || parsed.status === "saved")
    ) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
};

export const claimPortoneBillingKeySave = (billingKey: string) => {
  const current = readBillingKeySaveState();
  if (current?.billingKey === billingKey) {
    return current.status === "saved" ? "already-saved" : "in-flight";
  }
  sessionStorage.setItem(
    BILLING_KEY_SAVE_STORAGE_KEY,
    JSON.stringify({ billingKey, status: "saving" } satisfies BillingKeySaveState),
  );
  return "claimed";
};

export const markPortoneBillingKeySaved = (billingKey: string) => {
  sessionStorage.setItem(
    BILLING_KEY_SAVE_STORAGE_KEY,
    JSON.stringify({ billingKey, status: "saved" } satisfies BillingKeySaveState),
  );
};

export const releasePortoneBillingKeySave = (billingKey: string) => {
  const current = readBillingKeySaveState();
  if (current?.billingKey === billingKey) {
    sessionStorage.removeItem(BILLING_KEY_SAVE_STORAGE_KEY);
  }
};

export const closePortoneOverlay = () => {
  document.getElementById(PORTONE_OVERLAY_ID)?.remove();
};

/**
 * 포트원 SDK와 같이 User-Agent로 실제 휴대기기를 판별한다.
 * 관리자 화면이 402px 셸이어도 PC 브라우저는 PC로 본다.
 */
export const isPortoneMobileDevice = () => {
  const userAgent = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPod/i.test(userAgent)) return true;
  if (/iPad/i.test(userAgent)) return true;
  return /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;
};

export const getPortoneRedirectResult = (
  params: URLSearchParams,
): { billingKey: string } | { error: string } | null => {
  const billingKey = params.get("billingKey")?.trim() ?? "";
  const code = params.get("code")?.trim() ?? "";
  const message = params.get("message")?.trim() ?? "";

  if (code) {
    return {
      error: message || "결제수단 등록이 취소되었거나 완료되지 않았습니다.",
    };
  }
  if (billingKey && billingKey !== "NEEDS_CONFIRMATION") {
    return { billingKey };
  }
  return null;
};

const buildRedirectUrl = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete("billingKey");
  url.searchParams.delete("code");
  url.searchParams.delete("message");
  return url.toString();
};

const hasIssuedBillingKey = (response: {
  transactionType?: string;
  code?: string;
  billingKey?: string;
}) =>
  response.transactionType === "ISSUE_BILLING_KEY" &&
  !response.code &&
  Boolean(response.billingKey) &&
  response.billingKey !== "NEEDS_CONFIRMATION";

export type PortoneCheckoutDevice = "desktop" | "mobile";

export const issuePortoneBillingKey = async ({
  option,
  customer,
}: {
  option: PaymentMethodRegisterOption;
  customer?: {
    customerId?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
}): Promise<PortoneIssueResult> => {
  const storeId = readEnv("VITE_PORTONE_STORE_ID");
  const config = METHOD_CONFIG[option];
  const channelKey = readEnv(config.channelKeyEnv);

  if (!storeId || !channelKey) {
    return {
      ok: false,
      reason: "not_configured",
      message:
        "포트원 storeId와 채널 키가 아직 설정되지 않아 결제창을 열 수 없습니다.",
    };
  }

  savePortoneRegisterOption(option);

  const customerPayload = {
    ...(customer?.customerId ? { customerId: customer.customerId } : {}),
    ...(customer?.fullName ? { fullName: customer.fullName } : {}),
    ...(customer?.email ? { email: customer.email } : {}),
    ...(customer?.phoneNumber ? { phoneNumber: customer.phoneNumber } : {}),
  };

  // 포트원 창 타입은 SDK가 User-Agent로 고른다. PC iframe에 redirectUrl을 넣으면
  // 프로미스 성공과 쿼리 복귀가 겹쳐 같은 빌링키로 POST가 두 번 갈 수 있다.
  const useMobileRedirect = isPortoneMobileDevice();

  const response = await PortOne.requestIssueBillingKey({
    storeId,
    channelKey,
    billingKeyMethod: config.billingKeyMethod,
    issueId: `retrivr-${crypto.randomUUID()}`,
    issueName: ISSUE_NAME,
    ...(useMobileRedirect ? { redirectUrl: buildRedirectUrl() } : {}),
    windowType: {
      pc: "IFRAME",
      mobile: "REDIRECTION",
    },
    locale: "KO_KR",
    offerPeriod: {
      interval: "1m",
    },
    ...(Object.keys(customerPayload).length > 0
      ? { customer: customerPayload }
      : {}),
  });

  if (!response) {
    return {
      ok: false,
      reason: "cancelled",
      message: "결제수단 등록이 취소되었습니다.",
    };
  }

  if (!hasIssuedBillingKey(response)) {
    return {
      ok: false,
      reason: "failed",
      message: response.message || "빌링키 발급에 실패했습니다.",
    };
  }

  return {
    ok: true,
    billingKey: response.billingKey,
    provider: config.provider,
  };
};
