export const ADMIN_TERMS_CONSENT_STORAGE_KEY = "adminTermsConsentGranted";
export const CLIENT_TERMS_CONSENT_STORAGE_KEY = "clientTermsConsentGranted";
export const ADMIN_GA_CONSENT_STORAGE_KEY = "adminGa4ConsentGranted";
export const CLIENT_GA_CONSENT_STORAGE_KEY = "clientGa4ConsentGranted";

export type AnalyticsUserType = "admin" | "client";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_SCRIPT_ID = "ga4-script";
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID;

const inMemoryAnalyticsConsent: Record<AnalyticsUserType, boolean> = {
  admin: false,
  client: false,
};

const ADMIN_PATH_PREFIXES = [
  "/login",
  "/register",
  "/terms",
  "/home",
  "/account",
  "/membership",
  "/profile",
  "/item-manage",
  "/item-register",
  "/item-edit",
  "/return-manage",
  "/return-check",
  "/rental-request",
];

const canUseGA = () =>
  typeof window !== "undefined" &&
  typeof document !== "undefined" &&
  typeof GA_MEASUREMENT_ID === "string" &&
  GA_MEASUREMENT_ID.length > 0;

const getConsentStorage = (userType: AnalyticsUserType) =>
  userType === "client" ? sessionStorage : localStorage;

const getTermsConsentStorageKey = (userType: AnalyticsUserType) =>
  userType === "client"
    ? CLIENT_TERMS_CONSENT_STORAGE_KEY
    : ADMIN_TERMS_CONSENT_STORAGE_KEY;

const getAnalyticsConsentStorageKey = (userType: AnalyticsUserType) =>
  userType === "client"
    ? CLIENT_GA_CONSENT_STORAGE_KEY
    : ADMIN_GA_CONSENT_STORAGE_KEY;

export const hasTermsConsent = (userType: AnalyticsUserType) => {
  if (typeof window === "undefined") return false;

  return (
    getConsentStorage(userType).getItem(getTermsConsentStorageKey(userType)) ===
    "true"
  );
};

export const setTermsConsent = (userType: AnalyticsUserType) => {
  getConsentStorage(userType).setItem(
    getTermsConsentStorageKey(userType),
    "true",
  );
};

export const hasAnalyticsConsent = (userType: AnalyticsUserType) => {
  if (inMemoryAnalyticsConsent[userType]) return true;
  if (typeof window === "undefined") return false;

  return (
    getConsentStorage(userType).getItem(
      getAnalyticsConsentStorageKey(userType),
    ) === "true"
  );
};

const hasAnyAnalyticsConsent = () =>
  hasAnalyticsConsent("admin") || hasAnalyticsConsent("client");

export const resolveAnalyticsUserType = (
  pathname: string,
): AnalyticsUserType | null => {
  if (pathname.startsWith("/client")) return "client";

  if (
    ADMIN_PATH_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return "admin";
  }

  return null;
};

export const initializeGA4 = () => {
  if (!canUseGA()) return;

  inMemoryAnalyticsConsent.admin = hasAnalyticsConsent("admin");
  inMemoryAnalyticsConsent.client = hasAnalyticsConsent("client");

  const consentGranted = hasAnyAnalyticsConsent();

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    analytics_storage: consentGranted ? "granted" : "denied",
    ...(consentGranted ? {} : { wait_for_update: 500 }),
  });
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });
};

export const grantAnalyticsConsent = (userType: AnalyticsUserType) => {
  if (!canUseGA() || typeof window.gtag !== "function") return;

  inMemoryAnalyticsConsent[userType] = true;
  getConsentStorage(userType).setItem(
    getAnalyticsConsentStorageKey(userType),
    "true",
  );
  window.gtag("consent", "update", {
    analytics_storage: "granted",
  });
};

export const trackPageView = (pagePath: string) => {
  if (!canUseGA() || typeof window.gtag !== "function") return;

  const pathname = pagePath.split("?")[0] ?? pagePath;
  const userType = resolveAnalyticsUserType(pathname);
  if (!userType || !hasAnalyticsConsent(userType)) return;

  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
};
