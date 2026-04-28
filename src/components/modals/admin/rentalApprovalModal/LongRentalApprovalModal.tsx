import { useMemo, useState } from "react";
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
  count?: string;
  applicant?: string;
  time?: string;
  rentalDurationDays?: number;
  guaranteedGoods?: string;
}

const LongRentalApprovalModal = ({
  isOpen,
  onClose,
  rentalId,
  approvalApiMode = "admin",
  verificationToken,
  itemName: itemNameProp,
  count: countProp,
  applicant: applicantProp,
  time: timeProp,
  rentalDurationDays,
  guaranteedGoods,
}: LongRentalApproveModalProps) => {
  const navigate = useNavigate();
  const [isGuaranteedChecked, setIsGuaranteedChecked] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

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
  const { data: rentalDetail, isLoading: isRentalDetailLoading } = useRentalDetail(
    rentalId,
    verificationToken ?? "",
    shouldFetchRentalDetail,
  );
  const requestTime = useMemo(() => {
    if (rentalDetail?.requestedAt) {
      return rentalDetail.requestedAt.replace("T", " ").replace("Z", "");
    }
    return timeProp ?? "요청 시각 정보 없음";
  }, [rentalDetail?.requestedAt, timeProp]);
  const itemName = rentalDetail?.itemName ?? itemNameProp ?? "대여 물품";
  const count = rentalDetail?.itemUnitLabel
    ? `(${rentalDetail.itemUnitLabel})`
    : countProp ?? "(1/1)";
  const applicant = useMemo(() => {
    if (rentalDetail?.borrowerField) {
      const values = Object.values(rentalDetail.borrowerField).filter(Boolean);
      return values.length > 0 ? values.join(" | ") : "대여자 정보";
    }
    return applicantProp ?? "대여자 정보";
  }, [rentalDetail?.borrowerField, applicantProp]);
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
    <Modal isOpen={isOpen} onClose={onClose} title="요청을 승인하시겠어요?">
      {/* 전체 영역 */}
      <div className="flex flex-col w-full gap-8">
        {/* 대여정보 & 체크 & 승인 관리자 영역 */}
        <div className="flex flex-col pt-6.5 gap-5 font-[Pretendard]">
          {/* 대여 정보 영역 */}
          <div className="w-full h-61.25 px-3 pt-6 pb-5 border-1 border-secondary-5 rounded-[18px]">
            {/* 대여 물품 정보 */}
            <div className="flex flex-col w-full border-b-1 border-neutral-gray-5 px-4.5 gap-2.5">
              <p className="text-10px text-primary font-normal leading-[130%]">
                요청 시각 {requestTime}
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <div className="flex gap-1">
                    <p className="text-20px text-neutral-gray-1 font-[600] leading-[140%]">
                      {itemName}
                    </p>
                    <p className="text-12px text-neutral-gray-3 font-normal leading-[140%] mt-auto mb-1">
                      {count}
                    </p>
                  </div>
                  <p className="text-14px text-neutral-gray-1 font-[600] leading-[20px]">
                    {itemName}
                  </p>
                </div>
                {/* 대여 기간 및 보증물품 영역 */}
                <div className="flex flex-col px-1.75 pb-4.25">
                  <p className="text-14px text-neutral-gray-1 opacity-[0.9] leading-[140%]">
                    • 대여 기간:{" "}
                    {Number.isFinite(rentalDurationDays) && (rentalDurationDays ?? 0) > 0
                      ? `${rentalDurationDays}일`
                      : "정보 없음"}
                  </p>
                  <p className="text-14px text-neutral-gray-1 opacity-[0.9] leading-[140%]">
                    • 보증 물품:{" "}
                    {guaranteedGoods?.trim() ? guaranteedGoods : "없음"}
                  </p>
                </div>
              </div>
            </div>
            {/* 대여자 정보 */}
            <div className="flex flex-col w-full text-12px text-secondary-1 font-normal leading-[140%] px-4.5 pt-3">
              <p>
                {isRentalDetailLoading
                  ? "대여 정보를 불러오는 중입니다..."
                  : applicant}
              </p>
            </div>
          </div>
          {/* 체크박스 영역 - 보증물품 확인 여부 체크 */}
          <div className="flex w-full h-13 justify-between items-center px-5 py-3.5  border border-neutral-gray-5 rounded-[10px]">
            <div className="">
              <div>
                <span className="text-14px text-neutral-gray-1 font-bold">
                  보증 물품을 확인했어요.
                </span>
                <span className="text-14px text-primary font-bold ml-1">*</span>
              </div>
            </div>
            <CustomCheckBox
              checked={isGuaranteedChecked}
              onCheckedChange={(checked) => setIsGuaranteedChecked(checked)}
            />
          </div>
          {/* 승인 관리자 입력 영역 */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-14px font-bold text-neutral-gray-1">
                승인 관리자 입력{" "}
                <span className="text-14px text-primary font-700 ml-0.5">
                  *
                </span>
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="이름을 입력해주세요"
                className="w-full h-12 px-3.5 py-3 bg-[#F8F9F9] align-center rounded-small placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
              />
            </div>
          </div>
        </div>
        {/* 버튼 영역 - 거부, 승인 버튼 */}
        <div className="flex flex-col gap-3">
          {submitError && <p className="text-12px text-red">{submitError}</p>}
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              size="md"
              onClick={handleReject}
              disabled={!canSubmit}
            >
              {isRejecting || isPublicRejecting ? "거절 중..." : "거부"}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleApprove}
              disabled={!canSubmit}
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
