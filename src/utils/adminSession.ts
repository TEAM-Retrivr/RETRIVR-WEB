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
