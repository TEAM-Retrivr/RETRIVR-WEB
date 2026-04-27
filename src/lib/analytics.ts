export const GA_CONSENT_STORAGE_KEY = "ga4ConsentGranted";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_SCRIPT_ID = "ga4-script";
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID;

const canUseGA = () =>
  typeof window !== "undefined" &&
  typeof document !== "undefined" &&
  typeof GA_MEASUREMENT_ID === "string" &&
  GA_MEASUREMENT_ID.length > 0;

export const initializeGA4 = () => {
  if (!canUseGA()) return;

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
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    analytics_storage: "denied",
  });
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  if (localStorage.getItem(GA_CONSENT_STORAGE_KEY) === "true") {
    grantAnalyticsConsent();
  }
};

export const grantAnalyticsConsent = () => {
  if (!canUseGA() || typeof window.gtag !== "function") return;

  window.gtag("consent", "update", {
    analytics_storage: "granted",
  });
};

export const trackPageView = (pagePath: string) => {
  if (!canUseGA() || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
};

