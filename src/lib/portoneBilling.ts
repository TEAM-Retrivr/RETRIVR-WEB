import * as PortOne from "@portone/browser-sdk/v2";
import type { AdminPaymentMethodProvider } from "../api/admin/admin.type";
import {
  REGISTER_OPTION_PROVIDER,
  type PaymentMethodRegisterOption,
} from "../types/paymentMethod";

const ISSUE_NAME = "Retrivr 정기결제 수단 등록";
const OPTION_STORAGE_KEY = "retrivr.portone.paymentMethodOption";
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
  checkoutDevice,
}: {
  option: PaymentMethodRegisterOption;
  customer?: {
    customerId?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  checkoutDevice?: PortoneCheckoutDevice;
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

  const useMobileCheckout =
    checkoutDevice === "mobile" ||
    (checkoutDevice !== "desktop" && isPortoneMobileDevice());

  const response = await PortOne.requestIssueBillingKey({
    storeId,
    channelKey,
    billingKeyMethod: config.billingKeyMethod,
    issueId: `retrivr-${crypto.randomUUID()}`,
    issueName: ISSUE_NAME,
    // 노트북/PC는 리디렉션하지 않는다. 카카오페이는 PC iframe에서 QR을 보여 주고,
    // 휴대폰만 카카오톡으로 보낸다. 화면 너비(402px 셸)는 쓰지 않는다.
    ...(useMobileCheckout ? { redirectUrl: buildRedirectUrl() } : {}),
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
