import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ReturnApprovalModal from "../../../modals/admin/return/ReturnApprovalModal";
import OverdueRentalMessageModal from "../../../modals/admin/return/OverdueRentalMessageModal";
import RentalDateChangeModal from "../../../modals/admin/return/RentalDateChangeModal";
import { useConfirmAdminReturn } from "../../../../hooks/queries/useAdminQueries";
import type { AdminRentalSearchItem } from "../../../../api/admin/admin.type";

interface ReturnSearchResultCardProps {
  keyword: string;
  rental: AdminRentalSearchItem;
  organizationName?: string;
}

const highlightKeyword = (text: string, keyword: string) => {
  const trimmed = keyword.trim();
  if (!trimmed) return text;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return parts.map((part, index) =>
    part.toLocaleLowerCase() === trimmed.toLocaleLowerCase() ? (
      <span key={`${part}-${index}`} className="text-primary">
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
};

const SearchFieldRow = ({
  label,
  value,
  keyword,
}: {
  label: string;
  value: string;
  keyword: string;
}) => (
  <div className="flex min-w-0 items-center gap-1">
    <span className="shrink-0 rounded-[4px] bg-secondary-4 px-[3px] py-0.5 text-10px font-bold leading-[130%] text-secondary-2">
      {label}
    </span>
    <span className="truncate text-12px font-semibold leading-[140%] text-neutral-gray-1">
      {highlightKeyword(value, keyword)}
    </span>
  </div>
);

const ReturnSearchResultCard = ({
  keyword,
  rental,
  organizationName,
}: ReturnSearchResultCardProps) => {
  const queryClient = useQueryClient();
  const [isReturnApprovalOpen, setIsReturnApprovalOpen] = useState(false);
  const [isOverdueMessageOpen, setIsOverdueMessageOpen] = useState(false);
  const [isRentalDateChangeOpen, setIsRentalDateChangeOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutate: confirmReturn, isPending: isConfirming } =
    useConfirmAdminReturn();

  const isOverdue = rental.isOverdue ?? false;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsReturnApprovalOpen(true)}
        className="flex w-full flex-col gap-2 rounded-[8px] bg-neutral-white px-5 py-3.5 text-left"
      >
        <p className="flex min-w-0 items-baseline gap-1 text-secondary-1">
          <span className="truncate text-14px font-semibold leading-5">
            {highlightKeyword(rental.itemName, keyword)}
          </span>
          {rental.itemUnitLabel ? (
            <>
              <span className="shrink-0 text-12px font-normal leading-[140%]">
                /
              </span>
              <span className="truncate text-12px font-normal leading-[140%]">
                {rental.itemUnitLabel}
              </span>
            </>
          ) : null}
        </p>
        <div className="flex flex-col gap-1">
          <SearchFieldRow
            label="이름"
            value={rental.borrowerName}
            keyword={keyword}
          />
          <SearchFieldRow
            label="연락처"
            value={rental.contact}
            keyword={keyword}
          />
        </div>
      </button>

      <OverdueRentalMessageModal
        isOpen={isOverdueMessageOpen}
        onClose={() => setIsOverdueMessageOpen(false)}
        rentalId={rental.rentalId}
        itemId={rental.itemId}
        organizationName={organizationName}
        itemNameWithCount={rental.itemName}
        itemUnitName={rental.itemUnitLabel}
        borrowerName={rental.borrowerName}
        borrowerStudentNumber={rental.borrowerFields?.additionalProp2}
        rentalDateLabel={rental.rentalDate}
        returnDueDateLabel={rental.expectedReturnDueDate}
        canSendOverdueSms={isOverdue}
      />

      <RentalDateChangeModal
        isOpen={isRentalDateChangeOpen}
        onClose={() => setIsRentalDateChangeOpen(false)}
        rentalId={rental.rentalId}
        itemId={rental.itemId}
        borrowerName={rental.borrowerName}
        borrowerFields={rental.borrowerFields}
        rentalDate={rental.rentalDate}
        expectedReturnDueDate={rental.expectedReturnDueDate}
      />

      <ReturnApprovalModal
        isOpen={isReturnApprovalOpen}
        onClose={() => {
          setIsReturnApprovalOpen(false);
          setSubmitError(null);
        }}
        isSubmitting={isConfirming}
        submitError={submitError}
        isOverdue={isOverdue}
        itemName={rental.itemName}
        itemUnitLabel={rental.itemUnitLabel}
        borrowerName={rental.borrowerName}
        contact={rental.contact}
        borrowerFields={rental.borrowerFields}
        rentalDate={rental.rentalDate}
        expectedReturnDueDate={rental.expectedReturnDueDate}
        requestNote={rental.requestNote}
        approvalAdminName={rental.approvalAdminName}
        onEdit={() => {
          setIsReturnApprovalOpen(false);
          setIsRentalDateChangeOpen(true);
        }}
        onSendOverdueMessage={() => {
          setIsReturnApprovalOpen(false);
          setIsOverdueMessageOpen(true);
        }}
        onConfirm={(adminNameToConfirm) => {
          confirmReturn(
            {
              rentalId: rental.rentalId,
              adminNameToConfirm,
              itemId: rental.itemId,
            },
            {
              onSuccess: async () => {
                setIsReturnApprovalOpen(false);
                setSubmitError(null);
                await queryClient.invalidateQueries({
                  queryKey: ["adminRentalSearch"],
                });
              },
              onError: () => {
                setSubmitError("반납 처리에 실패했습니다. 다시 시도해주세요.");
              },
            },
          );
        }}
      />
    </>
  );
};

export default ReturnSearchResultCard;
