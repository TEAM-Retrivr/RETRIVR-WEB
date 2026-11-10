/** JWT의 만료 시각(ms). 없거나 형식이 잘못된 토큰은 유효하지 않다. */
export const getAdminSessionExpiresAt = (): number => {
  if (typeof window === "undefined") return 0;

  const token = localStorage.getItem("accessToken");
  if (!token) return 0;

  try {
    const parts = token.split(".");
    if (parts.length !== 3 || parts.some((part) => !part)) return 0;

    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload: unknown = JSON.parse(atob(padded));
    if (!payload || typeof payload !== "object" || !("exp" in payload)) return 0;

    const expiresAt = typeof payload.exp === "number" ? payload.exp * 1000 : 0;
    return Number.isFinite(expiresAt) ? expiresAt : 0;
  } catch {
    return 0;
  }
};

export const hasValidAdminSession = () => getAdminSessionExpiresAt() > Date.now();

export const ADMIN_SESSION_INVALIDATED_EVENT = "admin-session-invalidated";

/** 서버 인증 실패를 현재 열린 관리자 화면에도 즉시 알린다. */
export const invalidateAdminSession = () => {
  clearAdminSession();
  window.dispatchEvent(new Event(ADMIN_SESSION_INVALIDATED_EVENT));
};

/** 관리자 세션에 저장된 이메일을 반환한다. 없으면 JWT payload에서 복구를 시도한다. */
export const getAdminEmail = (): string => {
  if (typeof window === "undefined") return "";

  const stored = localStorage.getItem("email")?.trim();
  if (stored) return stored;

  const token = localStorage.getItem("accessToken");
  if (!token) return "";

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return "";

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(atob(padded)) as {
      email?: unknown;
      sub?: unknown;
    };

    const fromEmail =
      typeof payload.email === "string" ? payload.email.trim() : "";
    const fromSub =
      typeof payload.sub === "string" && payload.sub.includes("@")
        ? payload.sub.trim()
        : "";
    const recovered = fromEmail || fromSub;
    if (!recovered) return "";

    localStorage.setItem("email", recovered);
    return recovered;
  } catch {
    return "";
  }
};

/** 관리자 클라이언트 세션(토큰·식별자)을 정리한다. */
export const clearAdminSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("orgId");
  localStorage.removeItem("email");
};
