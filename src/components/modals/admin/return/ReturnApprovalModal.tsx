import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../../Modal";
import Button from "../../../Button";
import ReturnConfirmProcessModal from "./ReturnConfirmProcessModal";

interface ReturnApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adminNameToConfirm: string) => void;
  onEdit?: () => void;
  onSendOverdueMessage?: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  isOverdue?: boolean;
  itemName?: string;
  itemUnitLabel?: string;
  borrowerName?: string;
  borrowerPhone?: string;
  borrowerFields?: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
  rentalDate?: string;
  expectedReturnDueDate?: string;
  requestNote?: string;
  /** 대여 요청을 승인한 관리자 이름 (상세 표시용) */
  approvalAdminName?: string;
}

const parseDateParts = (raw?: string) => {
  if (!raw?.trim()) return null;
  const match = raw
    .trim()
    .replace("T", " ")
    .match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/);
  if (!match) return null;
  return {
    year: match[1],
    month: match[2].padStart(2, "0"),
    day: match[3].padStart(2, "0"),
  };
};

const DatePartsRow = ({
  label,
  parts,
}: {
  label: string;
  parts: { year: string; month: string; day: string } | null;
}) => (
  <div className="flex items-center gap-[3px]">
    <p className="text-12px font-normal leading-[140%] text-neutral-gray-1 opacity-90">
      {label}
    </p>
    {parts ? (
      <div className="flex items-center gap-[2px]">
        {[parts.year, parts.month, parts.day].map((part) => (
          <span
            key={`${label}-${part}`}
            className="rounded-[5px] border-[0.9px] border-neutral-gray-5 bg-white px-1 py-[3px] text-10px font-normal leading-[130%] text-neutral-gray-1"
          >
            {part}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-12px text-neutral-gray-3">정보 없음</span>
    )}
  </div>
);

const InfoChipRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex h-[17px] items-center gap-1">
    <span className="shrink-0 rounded-[4px] bg-secondary-4 px-[3px] py-[2px] text-10px font-bold leading-[130%] text-secondary-2">
      {label}
    </span>
    <span className="text-12px font-semibold leading-[140%] text-neutral-gray-1">
      {value}
    </span>
  </div>
);

const ReturnApprovalModal = ({
  isOpen,
  onClose,
  onConfirm,
  onEdit,
  onSendOverdueMessage,
  isSubmitting = false,
  submitError = null,
  isOverdue = false,
  itemName = "대여 물품",
  itemUnitLabel,
  borrowerName,
  borrowerPhone,
  borrowerFields,
  rentalDate,
  expectedReturnDueDate,
  requestNote,
  approvalAdminName,
}: ReturnApprovalModalProps) => {
  const [isProcessOpen, setIsProcessOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsProcessOpen(false);
    }
  }, [isOpen]);

  const rentalDateParts = useMemo(
    () => parseDateParts(rentalDate),
    [rentalDate],
  );
  const returnDueParts = useMemo(
    () => parseDateParts(expectedReturnDueDate),
    [expectedReturnDueDate],
  );

  const trimmedApprovalAdminName = approvalAdminName?.trim() || "";

  const borrowerInfoRows = useMemo(() => {
    const rows: { label: string; value: string }[] = [];
    if (borrowerName?.trim()) {
      rows.push({ label: "이름", value: borrowerName.trim() });
    }
    if (borrowerPhone?.trim()) {
      rows.push({ label: "연락처", value: borrowerPhone.trim() });
    }
    if (borrowerFields?.additionalProp1?.trim()) {
      rows.push({
        label: "학과",
        value: borrowerFields.additionalProp1.trim(),
      });
    }
    if (borrowerFields?.additionalProp2?.trim()) {
      rows.push({
        label: "학번",
        value: borrowerFields.additionalProp2.trim(),
      });
    }
    if (borrowerFields?.additionalProp3?.trim()) {
      rows.push({
        label: "추가정보",
        value: borrowerFields.additionalProp3.trim(),
      });
    }
    if (trimmedApprovalAdminName) {
      rows.push({ label: "대여 승인 관리자", value: trimmedApprovalAdminName });
    }
    return rows;
  }, [borrowerName, borrowerPhone, borrowerFields, trimmedApprovalAdminName]);

  const trimmedRequestNote = requestNote?.trim().slice(0, 30) || "";
  const unitLabel = itemUnitLabel?.trim() || null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showTitle={false}
        modalClassName="!rounded-[24px] max-h-[90vh] overflow-y-auto !px-4 !pb-6 !pt-9"
      >
        <div className="flex w-full flex-col items-center gap-4 font-[Pretendard]">
          {/* 상단: 상태 + 물품명 + 수정하기 */}
          <div className="flex w-full items-end justify-between gap-4 !px-2">
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex h-[19px] w-fit items-center gap-1 rounded-[10px] bg-secondary-4 px-1.5 py-0.5">
                <div
                  className={`h-[5px] w-[5px] rounded-full ${
                    isOverdue ? "bg-[#F00]" : "bg-[#2ADC5A]"
                  }`}
                />
                <p className="text-12px font-bold leading-[150%] text-primary">
                  {isOverdue ? "연체 중" : "대여 중"}
                </p>
              </div>
              <p className="truncate text-24px font-bold leading-none text-neutral-gray-1">
                {itemName}
              </p>
            </div>
            <button
              type="button"
              onClick={onEdit}
              className="flex h-[27px] w-[68px] shrink-0 items-center justify-center rounded-[10px] border border-primary bg-neutral-white text-12px font-normal leading-[140%] text-primary shadow-[0_0_4px_rgba(181,244,255,0.5)] hover:bg-bg-pale"
            >
              수정하기
            </button>
          </div>

          {/* 상세 카드 */}
          <div className="flex w-full flex-col gap-2.5 overflow-hidden rounded-[18px] border-[0.5px] border-secondary-5 bg-secondary-4 px-4 pb-[18px] pt-[26px]">
            <div className="flex w-full flex-col gap-3.5">
              <div className="flex w-full flex-col gap-1.5 px-3.5">
                {unitLabel ? (
                  <p className="truncate text-12px font-semibold leading-[140%] text-neutral-gray-1">
                    {unitLabel}
                  </p>
                ) : null}
                <div className="flex flex-col gap-0.5">
                  <DatePartsRow label=" ∙ 대여 일자" parts={rentalDateParts} />
                  <DatePartsRow label=" ∙ 반납 기한" parts={returnDueParts} />
                </div>
              </div>

              {borrowerInfoRows.length > 0 && (
                <div className="flex w-full flex-col gap-1.5 rounded-[8px] bg-white px-5 py-4">
                  {borrowerInfoRows.map((row) => (
                    <InfoChipRow
                      key={`${row.label}-${row.value}`}
                      label={row.label}
                      value={row.value}
                    />
                  ))}
                </div>
              )}

              {trimmedRequestNote ? (
                <div className="min-h-[50px] w-full rounded-[8px] bg-white px-5 py-2">
                  <div className="flex gap-1 text-12px leading-[140%] text-neutral-gray-1">
                    <p className="shrink-0 font-semibold text-[#4f4f4f]">
                      요청 사항:
                    </p>
                    <p className="whitespace-pre-wrap font-normal">
                      {trimmedRequestNote}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="mt-2 flex h-12 w-full gap-2">
            <Button
              variant="outline"
              size="md"
              className={`h-12 max-w-none flex-1 rounded-[12px] text-18px ${
                !isOverdue ? "opacity-60" : ""
              }`}
              disabled={!isOverdue || isSubmitting}
              onClick={onSendOverdueMessage}
            >
              연체 문자 전송
            </Button>
            <Button
              variant="primary"
              size="md"
              className="h-12 max-w-none flex-1 rounded-[12px] text-18px shadow-[0_0_4px_rgba(181,244,255,0.5)]"
              disabled={isSubmitting}
              onClick={() => setIsProcessOpen(true)}
            >
              반납 확인
            </Button>
          </div>
        </div>
      </Modal>

      <ReturnConfirmProcessModal
        isOpen={isProcessOpen}
        onClose={() => setIsProcessOpen(false)}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onConfirm={onConfirm}
      />
    </>
  );
};

export default ReturnApprovalModal;
