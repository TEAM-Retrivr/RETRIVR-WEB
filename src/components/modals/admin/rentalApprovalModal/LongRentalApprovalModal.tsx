import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../Modal";
import CustomCheckBox from "../../../CustomCheckbox";
import Button from "../../../Button";
import { useRentalDetail } from "../../../../hooks/queries/useClientQueries";
import {
  useApproveAdminRental,
  useApprovePublicRental,
  useRejectAdminRental,
  useRejectPublicRental,
} from "../../../../hooks/queries/useAdminQueries";

interface LongRentalApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalId: number;
  approvalApiMode?: "admin" | "public";
  verificationToken?: string;
  itemName?: string;
  itemUnitLabel?: string;
  count?: string;
  applicant?: string;
  contact?: string;
  time?: string;
  rentalDurationDays?: number;
  guaranteedGoodsProp?: string;
  requestNote?: string;
  expiresAt?: string;
  borrowerFields?: Record<string, string>;
}

const CONTACT_KEY_PATTERNS = [/연락처/i, /전화번호/i, /phone/i, /contact/i];
const NAME_KEY_PATTERNS = [/이름/i, /^name$/i];

const REQUEST_VALIDITY_MS = 15 * 60 * 1000;

const parseDateParts = (raw?: string) => {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();

  // ISO(타임존 포함)는 브라우저 파서로 처리해 UTC/KST 오차를 줄인다.
  if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(trimmed) || trimmed.includes("T")) {
    const isoDate = new Date(trimmed);
    if (!Number.isNaN(isoDate.getTime())) return isoDate;
  }

  const normalized = trimmed.replace("T", " ").replace("Z", "");
  const match = normalized.match(
    /(\d{4})[-./](\d{1,2})[-./](\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/,
  );
  if (!match) {
    const fallback = new Date(trimmed);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4] ?? 0);
  const minute = Number(match[5] ?? 0);
  const second = Number(match[6] ?? 0);
  const date = new Date(year, month - 1, day, hour, minute, second);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const formatDateTimeLabel = (raw?: string) => {
  const date = parseDateParts(raw);
  if (!date) return raw?.trim() || "요청 시각 정보 없음";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};

const formatCountdown = (ms: number) => {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  // Figma 기준 HH:MM:SS. 24시간 초과 시 일수 포함
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}일 ${String(remHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const InfoChipRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-1">
    <span className="shrink-0 rounded-[4px] bg-secondary-4 px-[3px] py-[2px] text-10px font-bold leading-[130%] text-secondary-2">
      {label}
    </span>
    <span className="text-12px font-semibold leading-[140%] text-neutral-gray-1">
      {value}
    </span>
  </div>
);

const LongRentalApprovalModal = ({
  isOpen,
  onClose,
  rentalId,
  approvalApiMode = "admin",
  verificationToken,
  itemName: itemNameProp,
  itemUnitLabel: itemUnitLabelProp,
  count: countProp,
  applicant: applicantProp,
  contact: contactProp,
  time: timeProp,
  rentalDurationDays,
  guaranteedGoodsProp,
  requestNote: requestNoteProp,
  expiresAt: expiresAtProp,
  borrowerFields: borrowerFieldsProp,
}: LongRentalApproveModalProps) => {
  const navigate = useNavigate();
  const [isGuaranteedChecked, setIsGuaranteedChecked] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const { mutate: approveRental, isPending: isApproving } =
    useApproveAdminRental();
  const { mutate: approvePublicRentalMutate, isPending: isPublicApproving } =
    useApprovePublicRental();
  const { mutate: rejectRental, isPending: isRejecting } =
    useRejectAdminRental();
  const { mutate: rejectPublicRentalMutate, isPending: isPublicRejecting } =
    useRejectPublicRental();

  const verificationTokenValue = verificationToken?.trim() ?? "";
  const isPublicApprovalFlow = approvalApiMode === "public";
  const isMutating =
    isApproving || isPublicApproving || isRejecting || isPublicRejecting;
  const shouldFetchRentalDetail =
    isOpen && isPublicApprovalFlow && verificationTokenValue.length > 0;
  const { data: rentalDetail, isLoading: isRentalDetailLoading } =
    useRentalDetail(rentalId, verificationToken ?? "", shouldFetchRentalDetail);

  useEffect(() => {
    if (!isOpen) return;
    setIsGuaranteedChecked(false);
    setAdminName("");
    setSubmitError(null);
  }, [isOpen, rentalId]);

  const requestTimeRaw = rentalDetail?.requestedAt ?? timeProp;
  const requestTime = formatDateTimeLabel(requestTimeRaw);
  const itemName = rentalDetail?.itemName ?? itemNameProp ?? "대여 물품";
  const itemUnitLabelValue = rentalDetail?.itemUnitLabel ?? itemUnitLabelProp;
  const count = countProp;
  const rentalDuration = rentalDetail?.rentalDuration ?? rentalDurationDays;
  const guaranteedGoods = rentalDetail?.guaranteedGoods ?? guaranteedGoodsProp;
  const requestNote = (
    rentalDetail?.requestNote?.trim() ||
    requestNoteProp?.trim() ||
    ""
  ).slice(0, 30);

  // expiresAt prop이 있으면 그걸 쓰고, 없으면 requestedAt + 15분으로 만료 시각 계산
  const expiresAtMs = useMemo(() => {
    const fromProp = parseDateParts(expiresAtProp);
    if (fromProp) return fromProp.getTime();

    const requestedAt = parseDateParts(requestTimeRaw);
    if (!requestedAt) return null;

    return requestedAt.getTime() + REQUEST_VALIDITY_MS;
  }, [expiresAtProp, requestTimeRaw]);

  useEffect(() => {
    if (!isOpen || expiresAtMs === null) return;
    setNowMs(Date.now());
    const timerId = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, [isOpen, expiresAtMs]);

  const expiresCountdown = useMemo(() => {
    if (expiresAtMs === null) return null;
    return formatCountdown(expiresAtMs - nowMs);
  }, [expiresAtMs, nowMs]);

  const returnDueParts = useMemo(() => {
    const requestedAt = parseDateParts(requestTimeRaw);
    if (
      !requestedAt ||
      !Number.isFinite(rentalDuration) ||
      (rentalDuration ?? 0) <= 0
    ) {
      return null;
    }
    const due = addDays(requestedAt, Number(rentalDuration));
    return {
      year: String(due.getFullYear()),
      month: String(due.getMonth() + 1).padStart(2, "0"),
      day: String(due.getDate()).padStart(2, "0"),
    };
  }, [requestTimeRaw, rentalDuration]);

  const borrowerFieldSource = useMemo(() => {
    if (rentalDetail?.borrowerField) return rentalDetail.borrowerField;
    return borrowerFieldsProp;
  }, [rentalDetail?.borrowerField, borrowerFieldsProp]);

  const contactFromBorrowerField = useMemo(() => {
    const field = borrowerFieldSource;
    if (!field) return { key: undefined as string | undefined, value: "" };

    const entries = Object.entries(field)
      .filter(([, v]) => typeof v === "string" && v.trim().length > 0)
      .map(([k, v]) => [String(k), v] as const);

    const matched = entries.find(([k]) =>
      CONTACT_KEY_PATTERNS.some((pattern) => pattern.test(k)),
    );
    return { key: matched?.[0], value: matched?.[1] ?? "" };
  }, [borrowerFieldSource]);

  const borrowerFieldNameOnly = useMemo(() => {
    const field = borrowerFieldSource;
    if (!field) return "";

    const entries = Object.entries(field)
      .filter(([, v]) => typeof v === "string" && v.trim().length > 0)
      .map(([k, v]) => [String(k), v] as const);

    const matched = entries.find(([k]) =>
      NAME_KEY_PATTERNS.some((pattern) => pattern.test(k)),
    );
    return (matched?.[1] ?? "").trim();
  }, [borrowerFieldSource]);

  const applicantPropParsed = useMemo(() => {
    const safeApplicant = applicantProp?.trim();
    if (!safeApplicant) return { name: "", contact: "" };

    const parts = safeApplicant
      .split("|")
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length < 2) return { name: safeApplicant, contact: "" };

    const nameCandidate = parts[0];
    const contactCandidate = parts[parts.length - 1];
    const digits = contactCandidate.replace(/\D/g, "");
    const is010Phone = /^010\d{8}$/.test(digits);

    return is010Phone
      ? { name: nameCandidate, contact: contactCandidate }
      : { name: safeApplicant, contact: "" };
  }, [applicantProp]);

  const contactValue =
    (rentalDetail?.contact ?? "") ||
    contactFromBorrowerField.value ||
    contactProp ||
    applicantPropParsed.contact ||
    "";

  const applicant = useMemo(() => {
    const apiBorrowerName = rentalDetail?.borrowerName?.trim();
    if (apiBorrowerName) return apiBorrowerName;
    if (borrowerFieldNameOnly) return borrowerFieldNameOnly;
    if (applicantPropParsed.name) return applicantPropParsed.name;
    if (applicantProp?.trim()) return applicantProp.trim();
    return "대여자 정보";
  }, [
    rentalDetail?.borrowerName,
    borrowerFieldNameOnly,
    applicantPropParsed.name,
    applicantProp,
  ]);

  const borrowerInfoRows = useMemo(() => {
    const rows: { label: string; value: string }[] = [];
    const usedKeys = new Set<string>();

    const pushRow = (label: string, value?: string, key?: string) => {
      const trimmed = value?.trim();
      if (!trimmed) return;
      rows.push({ label, value: trimmed });
      if (key) usedKeys.add(key);
    };

    pushRow("이름", isRentalDetailLoading ? "불러오는 중..." : applicant);
    if (!isRentalDetailLoading) {
      pushRow("연락처", contactValue || "정보 없음");
    }

    if (borrowerFieldSource) {
      Object.entries(borrowerFieldSource).forEach(([key, value]) => {
        if (usedKeys.has(key)) return;
        if (NAME_KEY_PATTERNS.some((pattern) => pattern.test(key))) return;
        if (CONTACT_KEY_PATTERNS.some((pattern) => pattern.test(key))) return;
        if (typeof value !== "string" || !value.trim()) return;
        pushRow(key, value, key);
      });
    }

    return rows;
  }, [applicant, borrowerFieldSource, contactValue, isRentalDetailLoading]);

  const isDetailReady = shouldFetchRentalDetail ? !!rentalDetail : true;
  const canSubmit = useMemo(
    () =>
      isGuaranteedChecked &&
      !!adminName.trim() &&
      !isMutating &&
      !isRentalDetailLoading &&
      isDetailReady &&
      (!isPublicApprovalFlow || verificationTokenValue.length > 0),
    [
      adminName,
      isGuaranteedChecked,
      isMutating,
      isRentalDetailLoading,
      isDetailReady,
      isPublicApprovalFlow,
      verificationTokenValue,
    ],
  );

  const handleApprove = () => {
    if (!canSubmit) return;
    setSubmitError(null);
    const adminNameToApprove = adminName.trim();

    if (isPublicApprovalFlow) {
      if (!verificationTokenValue) {
        setSubmitError("관리자 코드 검증 정보가 없어 승인할 수 없습니다.");
        return;
      }

      approvePublicRentalMutate(
        {
          rentalId,
          adminNameToApprove,
          adminCodeVerificationToken: verificationTokenValue,
        },
        {
          onSuccess: (data) => {
            alert("대여 요청 승인이 완료되었습니다.");
            onClose();
            navigate(`/client-home?organizationId=${data.organizationId}`);
          },
          onError: () =>
            setSubmitError("대여 요청 승인에 실패했습니다. 다시 시도해주세요."),
        },
      );
      return;
    }

    approveRental(
      { rentalId, adminNameToApprove },
      {
        onSuccess: () => {
          alert("대여 요청 승인이 완료되었습니다.");
          onClose();
        },
        onError: () =>
          setSubmitError("대여 요청 승인에 실패했습니다. 다시 시도해주세요."),
      },
    );
  };

  const handleReject = () => {
    if (!canSubmit) return;
    setSubmitError(null);

    if (isPublicApprovalFlow) {
      if (!verificationTokenValue) {
        setSubmitError("관리자 코드 검증 정보가 없어 거절할 수 없습니다.");
        return;
      }

      rejectPublicRentalMutate(
        {
          rentalId,
          adminNameToReject: adminName.trim(),
          adminCodeVerificationToken: verificationTokenValue,
        },
        {
          onSuccess: (data) => {
            alert("대여 요청 거절이 완료되었습니다.");
            onClose();
            navigate(`/client-home?organizationId=${data.organizationId}`);
          },
          onError: () =>
            setSubmitError("대여 요청 거절에 실패했습니다. 다시 시도해주세요."),
        },
      );
      return;
    }

    rejectRental(
      { rentalId, adminNameToReject: adminName.trim() },
      {
        onSuccess: () => {
          alert("대여 요청 거절이 완료되었습니다.");
          onClose();
        },
        onError: () =>
          setSubmitError("대여 요청 거절에 실패했습니다. 다시 시도해주세요."),
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="요청을 승인하시겠어요?"
      showTitle={approvalApiMode !== "public"}
      modalClassName="rounded-[24px] max-h-[90vh] overflow-y-auto"
    >
      <div className="flex w-full flex-col font-[Pretendard]">
        {approvalApiMode === "public" && (
          <div className="mt-1 flex flex-col items-center gap-2">
            <p className="text-16px font-[600] text-primary">현장 즉시 승인</p>
            <p className="text-center text-24px font-bold leading-[140%] text-secondary-1">
              요청을 승인하시겠어요?
            </p>
          </div>
        )}

        {expiresCountdown !== null && (
          <p className="mt-2 text-center text-10px font-normal leading-[130%] text-secondary-2">
            요청 만료까지{" "}
            <span className="text-primary">{expiresCountdown}</span>
          </p>
        )}

        <div className="mt-4 flex flex-col gap-4">
          {/* 요청 상세 카드 */}
          <div className="w-full overflow-hidden rounded-[18px] border-[0.5px] border-secondary-5 bg-secondary-4 px-[15.5px] pb-4 pt-[25.5px]">
            <div className="flex flex-col gap-[6px] px-[14px]">
              <p className="text-10px font-normal leading-[130%] text-secondary-2">
                요청 시각 {requestTime}
              </p>

              <div className="flex flex-col gap-[6px]">
                <div className="flex items-end gap-1">
                  <p className="max-w-[200px] truncate text-20px font-bold leading-[140%] text-neutral-gray-1">
                    {itemName}
                  </p>
                  {approvalApiMode === "admin" && count ? (
                    <p className="mb-0.5 text-12px font-normal leading-[140%] text-neutral-gray-3">
                      {count}
                    </p>
                  ) : null}
                </div>

                {itemUnitLabelValue ? (
                  <p className="max-w-[246px] truncate text-12px font-semibold leading-[140%] text-neutral-gray-1">
                    {itemUnitLabelValue}
                  </p>
                ) : null}

                <div className="flex flex-col gap-[2px]">
                  <p className="text-12px font-normal leading-[140%] text-neutral-gray-1 opacity-90">
                    대여 기간:{" "}
                    <span className="text-primary">
                      {Number.isFinite(rentalDuration) &&
                      (rentalDuration ?? 0) > 0
                        ? `${rentalDuration}일`
                        : "정보 없음"}
                    </span>
                  </p>

                  <div className="flex items-center gap-[3px]">
                    <p className="text-12px font-normal leading-[140%] text-neutral-gray-1 opacity-90">
                      반납 기한
                    </p>
                    {returnDueParts ? (
                      <div className="flex items-center gap-[2px]">
                        {[
                          returnDueParts.year,
                          returnDueParts.month,
                          returnDueParts.day,
                        ].map((part) => (
                          <span
                            key={part}
                            className="rounded-[5px] border-[0.9px] border-neutral-gray-5 bg-white px-1 py-[3px] text-10px font-normal leading-[130%] text-neutral-gray-1"
                          >
                            {part}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-12px text-neutral-gray-3">
                        정보 없음
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 대여자 정보 */}
            <div className="mt-[14px] flex flex-col gap-[6px] rounded-[8px] bg-white px-5 py-4">
              {borrowerInfoRows.map((row) => (
                <InfoChipRow
                  key={`${row.label}-${row.value}`}
                  label={row.label}
                  value={row.value}
                />
              ))}
            </div>

            {/* 요청 사항 */}
            {requestNote ? (
              <div className="mt-2 rounded-[8px] bg-white px-5 py-2">
                <div className="flex gap-2 text-12px leading-[140%] text-neutral-gray-1">
                  <p className="shrink-0 font-semibold text-[#4f4f4f]">
                    요청 사항:
                  </p>
                  <p className="whitespace-pre-wrap font-normal">
                    {requestNote}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* 보증 물품 확인 */}
          <div className="flex h-[63px] w-full items-center justify-between rounded-[8px] border border-neutral-gray-5 px-5 py-[14px]">
            <div>
              <div className="flex items-center ">
                <span className="text-14px font-bold text-neutral-gray-1">
                  보증물품을 확인했어요.
                </span>
                <span className="ml-0.5 text-14px font-bold text-primary">
                  *
                </span>
              </div>
              <p className="mt-0.5 text-10px font-normal leading-[130%] text-[#4f4f4f] opacity-90">
                보증 물품 :{" "}
                <span className="text-primary">
                  {guaranteedGoods?.trim() || "없음"}
                </span>
              </p>
            </div>
            <CustomCheckBox
              checked={isGuaranteedChecked}
              onCheckedChange={setIsGuaranteedChecked}
            />
          </div>

          {/* 승인 관리자 입력 */}
          <div className="flex flex-col gap-[6px]">
            <label className="px-[6px] text-14px font-bold text-neutral-gray-1">
              승인 관리자 입력
              <span className="ml-0.5 text-primary">*</span>
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="승인하는 관리자의 이름을 입력해주세요."
              className="h-11 w-full rounded-[8px] bg-[#F8F9F9] px-4 py-3 text-14px font-normal leading-[140%] text-neutral-gray-1 placeholder:text-neutral-gray-3"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-8 flex flex-col gap-3">
          {submitError && <p className="text-12px text-red">{submitError}</p>}
          <div className="flex w-full justify-between gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handleReject}
              disabled={!canSubmit}
              className="h-12 max-w-[149px] rounded-[12px]"
            >
              {isRejecting || isPublicRejecting ? "거절 중..." : "거부"}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleApprove}
              disabled={!canSubmit}
              className="h-12 max-w-[149px] rounded-[12px]"
            >
              {isApproving || isPublicApproving ? "승인 중..." : "승인"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LongRentalApprovalModal;
