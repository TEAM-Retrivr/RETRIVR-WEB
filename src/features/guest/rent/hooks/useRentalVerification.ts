import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import {
  useSendEmailCode,
  useSendPhoneVerificationCode,
  useVerifyEmailCode,
  useVerifyPhoneVerificationCode,
} from "../../../../hooks/queries/useAuthQueries";
import type {
  EmailAuthBorrowerInformationRequest,
  PhoneAuthBorrowerInformationRequest,
} from "../../../../api/client/client.type";

export type VerificationMethod = "phone" | "email";
export type RentalVerificationCredentials =
  | Pick<PhoneAuthBorrowerInformationRequest, "phone" | "tokenId" | "rawToken">
  | Pick<
      EmailAuthBorrowerInformationRequest,
      "email" | "emailVerificationToken"
    >;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

const formatPhoneNumber = (value: string) =>
  `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;

export const useRentalVerification = (
  method: VerificationMethod,
  onVerified?: (credentials: RentalVerificationCredentials) => void,
) => {
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [credentials, setCredentials] =
    useState<RentalVerificationCredentials | null>(null);
  const [error, setError] = useState("");
  const busyRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const sendPhone = useSendPhoneVerificationCode();
  const verifyPhone = useVerifyPhoneVerificationCode();
  const sendEmail = useSendEmailCode();
  const verifyEmail = useVerifyEmailCode();
  const isSending = sendPhone.isPending || sendEmail.isPending;
  const isVerifying = verifyPhone.isPending || verifyEmail.isPending;
  const isBusy = isSending || isVerifying;
  const isVerified = credentials !== null;
  const hasSentCode = sentTo !== "" && sentTo === contact.trim();
  const isValidContact =
    method === "phone"
      ? /^010\d{8}$/.test(contact)
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim());
  const canSend = isValidContact && !isBusy && !isVerified;
  const canVerify =
    hasSentCode && /^\d{6}$/.test(code) && !isBusy && !isVerified;

  const changeContact = (value: string) => {
    if (busyRef.current || isVerified) return;
    const nextContact =
      method === "phone" ? value.replace(/\D/g, "").slice(0, 11) : value;
    if (nextContact === contact) return;
    setContact(nextContact);
    setCode("");
    setSentTo("");
    setVerificationId("");
    setCredentials(null);
    setError("");
  };

  const changeCode = (value: string) => {
    if (busyRef.current || isVerified) return;
    setCode(value.replace(/\D/g, "").slice(0, 6));
    setError("");
  };

  const sendCode = async () => {
    if (!canSend || busyRef.current) return;
    busyRef.current = true;
    setError("");
    const recipient = contact.trim();

    try {
      let nextVerificationId = "";
      if (method === "phone") {
        const response = await sendPhone.mutateAsync({
          phoneNumber: formatPhoneNumber(recipient),
          purpose: "BORROW",
        });
        nextVerificationId = response.verificationId?.trim() ?? "";
        if (!nextVerificationId) {
          throw new Error("인증번호를 전송하지 못했습니다. 다시 시도해주세요.");
        }
      } else {
        await sendEmail.mutateAsync({ email: recipient, purpose: "BORROW" });
      }
      if (!mountedRef.current) return;
      setVerificationId(nextVerificationId);
      setSentTo(recipient);
      setCode("");
      setCredentials(null);
    } catch (error) {
      if (mountedRef.current) {
        setError(getErrorMessage(error, "인증번호 전송에 실패했습니다."));
      }
    } finally {
      busyRef.current = false;
    }
  };

  const verifyCode = async () => {
    if (!canVerify || busyRef.current) return;
    if (method === "phone" && !verificationId) return;
    busyRef.current = true;
    setError("");

    try {
      let nextCredentials: RentalVerificationCredentials;
      if (method === "phone") {
        const response = await verifyPhone.mutateAsync({
          verificationId,
          purpose: "BORROW",
          rawCode: code,
        });
        const rawToken =
          response.verificationToken?.trim() || response.rawToken?.trim();
        const tokenId =
          response.verificationTokenId?.trim() || response.tokenId?.trim();
        if (!rawToken || !tokenId) {
          throw new Error("인증이 완료되지 않았습니다. 다시 시도해주세요.");
        }
        nextCredentials = {
          phone: formatPhoneNumber(sentTo),
          rawToken,
          tokenId,
        };
      } else {
        const response = await verifyEmail.mutateAsync({
          email: sentTo,
          purpose: "BORROW",
          code,
        });
        const token = response.token?.trim();
        if (response.tokenType !== "BORROW" || !token) {
          throw new Error("인증이 완료되지 않았습니다. 다시 시도해주세요.");
        }
        nextCredentials = { email: sentTo, emailVerificationToken: token };
      }
      if (!mountedRef.current) return;
      setCredentials(nextCredentials);
      onVerified?.(nextCredentials);
    } catch (error) {
      if (mountedRef.current) {
        setError(getErrorMessage(error, "인증번호 확인에 실패했습니다."));
      }
    } finally {
      busyRef.current = false;
    }
  };

  return {
    contact,
    code,
    credentials,
    error,
    isSending,
    isVerifying,
    isBusy,
    isVerified,
    hasSentCode,
    canSend,
    canVerify,
    changeContact,
    changeCode,
    sendCode,
    verifyCode,
  };
};
