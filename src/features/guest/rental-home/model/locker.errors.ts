import { isAxiosError } from "axios";

export const lockerErrorMessage = (error: unknown, fallback: string) =>
  isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || fallback
    : error instanceof Error
      ? error.message
      : fallback;
