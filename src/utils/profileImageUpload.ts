import type { AdminProfileImageContentType } from "../api/auth/auth.type";

export const PROFILE_IMAGE_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = new Set<string>([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const resolveProfileImageContentType = (
  file: File,
): AdminProfileImageContentType | null => {
  const type = file.type.toLowerCase();
  if (ALLOWED_CONTENT_TYPES.has(type)) {
    return type as AdminProfileImageContentType;
  }
  return null;
};

export const extractProfileImageObjectKey = (uploadUrl: string): string => {
  const parsed = new URL(uploadUrl);
  const path = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
  const organizationIndex = path.indexOf("organizations/");
  return organizationIndex >= 0 ? path.slice(organizationIndex) : path;
};

export const resolveProfileImageDisplayUrl = (
  url: string | null | undefined,
  options?: { allowBlob?: boolean },
): string | null => {
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (options?.allowBlob && trimmed.startsWith("blob:")) return trimmed;
  return null;
};

export const uploadProfileImageToPresignedUrl = async (
  uploadUrl: string,
  file: File,
  contentType: AdminProfileImageContentType,
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });
  if (!response.ok) {
    throw new Error("프로필 이미지 업로드에 실패했습니다.");
  }
};
