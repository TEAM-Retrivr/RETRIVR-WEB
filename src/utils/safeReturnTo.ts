const DEFAULT_RETURN_TO = "/membership/payment-methods";

const ALLOWED_RETURN_PREFIXES = [
  "/membership",
  "/membership/payment-methods",
  "/membership/payment-methods/register",
  "/membership/subscribe",
  "/membership/vouchers",
] as const;

const normalizeInternalPath = (value: string) => {
  const [pathname, search = ""] = value.split("?");
  const segments = pathname.split("/");
  const resolved: string[] = [];

  for (const segment of segments) {
    if (!segment || segment === ".") continue;
    if (segment === "..") {
      if (resolved.length === 0) return null;
      resolved.pop();
      continue;
    }
    resolved.push(segment);
  }

  const normalizedPath = `/${resolved.join("/")}`;
  return search ? `${normalizedPath}?${search}` : normalizedPath;
};

const isAllowedMembershipPath = (value: string) => {
  const pathname = value.split("?")[0] ?? "";
  return ALLOWED_RETURN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
};

export const resolveMembershipReturnTo = (value: string | null) => {
  if (!value) return DEFAULT_RETURN_TO;
  try {
    const decoded = decodeURIComponent(value);
    if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("://")) {
      return DEFAULT_RETURN_TO;
    }
    const normalized = normalizeInternalPath(decoded);
    if (!normalized || !isAllowedMembershipPath(normalized)) {
      return DEFAULT_RETURN_TO;
    }
    return normalized;
  } catch {
    return DEFAULT_RETURN_TO;
  }
};
