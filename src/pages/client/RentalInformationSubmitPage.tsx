import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { FormEvent } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import CommonInput from "../../components/CommonInput";
import { ConsentSectionCard } from "../../components/cards/client/ConsentSectionCard";
import Button from "../../components/Button";
import {
  useItemDetail,
  useSendRentalRequest,
} from "../../hooks/queries/useClientQueries";
import { useQueryClient } from "@tanstack/react-query";

const label1 =
  "대여 물품 연체 시 독촉 문자가 카카오톡으로\n발송됩니다. 이에 동의하시나요?";

const label2 = "대여 시 ";
const label3 =
  "을 맡기셔야 합니다.\n물품 반납 시 반환됩니다. 이에 동의하시나요?";
const CLIENT_RENTAL_SUBMIT_STATE_STORAGE_KEY = "clientRentalSubmitState";

const RentalInformationSubmitPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const routeState = location.state as {
    itemId?: number;
    itemUnitId?: number;
    organizationId?: number;
    organizationName?: string;
    name?: string;
    rentalDuration?: number;
    guaranteedGoods?: string;
    description?: string;
    borrowerRequirements?: { label: string; required: boolean }[];
  } | null;

  const restoredState = useMemo(() => {
    const raw = sessionStorage.getItem(CLIENT_RENTAL_SUBMIT_STATE_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as typeof routeState;
    } catch {
      return null;
    }
  }, []);

  const state = routeState ?? restoredState;

  useEffect(() => {
    if (!routeState) return;
    sessionStorage.setItem(
      CLIENT_RENTAL_SUBMIT_STATE_STORAGE_KEY,
      JSON.stringify(routeState),
    );
  }, [routeState]);

  const itemId = state?.itemId ?? 0;
  const itemUnitId = state?.itemUnitId; // 개별 코드형 물품일 때만 전달
  const organizationId = state?.organizationId;
  const cachedOrganization =
    Number.isFinite(organizationId) && (organizationId ?? 0) > 0
      ? queryClient.getQueryData<{ name?: string; imageURL?: string }>([
          "selectedOrganization",
          organizationId,
        ])
      : undefined;
  const organizationName =
    state?.organizationName ?? cachedOrganization?.name ?? "대여지명";
  const itemName = state?.name ?? "대여 물품";
  const rentalDuration = state?.rentalDuration ?? 0;
  const guaranteedGoods = state?.guaranteedGoods ?? "-";
  const description = state?.description ?? "-";
  const { data: itemDetail } = useItemDetail(itemId, itemId > 0);
  const selectedItemUnitLabel = useMemo(() => {
    if (itemDetail?.itemManagementType !== "UNIT") return "";
    if (!Number.isFinite(itemUnitId) || (itemUnitId ?? 0) <= 0) return "";

    return (
      itemDetail.itemUnits?.find((unit) => unit.itemUnitId === itemUnitId)
        ?.label ?? ""
    );
  }, [itemDetail?.itemManagementType, itemDetail?.itemUnits, itemUnitId]);
  const borrowerRequirements =
    itemDetail?.borrowerRequirements ?? state?.borrowerRequirements ?? [];
  const additionalBorrowerRequirements = useMemo(
    () =>
      borrowerRequirements.filter(
        (req, index, arr) =>
          req.label !== "이름" &&
          req.label !== "연락처" &&
          req.label !== "전화번호" &&
          req.label.toLowerCase() !== "email" &&
          req.label !== "이메일" &&
          req.label !== "요청사항" &&
          arr.findIndex((item) => item.label === req.label) === index,
      ),
    [borrowerRequirements],
  );

  // 대여자 이름 : string
  const [name, setName] = useState("");
  // 대여자 전화번호 : string
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");
  const [requestment, setRequestment] = useState("");
  const [additionalFieldValues, setAdditionalFieldValues] = useState<
    Record<string, string>
  >({});

  // 개인 정보 활용 동의 체크 여부 : boolean
  const [firstConsentChecked, setFirstConsentChecked] = useState(false);
  const [secondConsentChecked, setSecondConsentChecked] = useState(false);

  // 보증 물품이 필요할 때만 두 번째 동의를 요구
  const isGuaranteedGoodsRequired =
    guaranteedGoods !== "" && guaranteedGoods !== "-";
  const isValidPhoneNumberForVerification = /^010\d{8}$/.test(
    phoneNumber.trim(),
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const hasMissingRequiredAdditionalField =
      additionalBorrowerRequirements.some(
        (requirement) =>
          requirement.required &&
          !additionalFieldValues[requirement.label]?.trim(),
      );

    if (
      !name.trim() ||
      !phoneNumber.trim() ||
      hasMissingRequiredAdditionalField
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }
    handleSendRentalRequest();
  };

  const { mutate: sendRentalRequest, isPending } = useSendRentalRequest();

  const handleSendRentalRequest = () => {
    const normalizedPhone = phoneNumber.trim();
    const normalizedName = name.trim();

    const renterFields: Record<string, string> = {};

    borrowerRequirements.forEach(({ label }) => {
      // renterFields(additionalBorrowerInfo)에는 이름/전화번호를 넣지 않는다.
      // - 이름/전화번호는 top-level의 name, phone으로 분리 전송
      if (label === "이름" || label === "전화번호" || label === "연락처")
        return;
      const value = additionalFieldValues[label]?.trim();
      if (value) {
        renterFields[label] = value;
      }
    });

    // POST /api/public/v1/items/{itemId}/rentals 의 Request Body
    const body = {
      itemUnitId,
      name: normalizedName,
      phone: normalizedPhone || undefined,
      renterFields,
    };

    sendRentalRequest(
      {
        itemId,
        ...body,
      },
      {
        onSuccess: (response) => {
          sessionStorage.removeItem(CLIENT_RENTAL_SUBMIT_STATE_STORAGE_KEY);
          const createdRentalId = response.rentalId;
          const rentalIdQuery =
            Number.isFinite(createdRentalId) && createdRentalId > 0
              ? `&rentalId=${createdRentalId}`
              : "";
          if (organizationId && organizationId > 0) {
            navigate(
              `/client-rental-confirmation?organizationId=${organizationId}${rentalIdQuery}`,
            );
            return;
          }
          navigate(
            rentalIdQuery
              ? `/client-rental-confirmation?${rentalIdQuery.slice(1)}`
              : "/client-rental-confirmation",
          );
        },
        onError: () => {
          alert("대여 요청에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };
  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <Header
          name={organizationName}
          pageName="대여 정보 입력"
          backTo={
            organizationId && organizationId > 0
              ? `/client-home?organizationId=${organizationId}`
              : "/client-search"
          }
        />
        <div className="w-84.5 h-44 font-[Pretendard] bg-secondary-4 border border-secondary-5 border-[0.5px] rounded-[16px] mt-6 mx-7.75">
          <div className="pt-7.25 pl-8 pb-7.75">
            <div className="flex flex-col text-neutral-gray-1">
              <p className=" text-24px font-bold">{itemName}</p>
              <p className="text-neutral-gray-2 text-16px font-[500] leading-none">
                {selectedItemUnitLabel}
              </p>
            </div>
            <ul className="text-12px opacity-[0.9] font-normal mt-4.25 px-0.5 leading-[130%]">
              <li>
                • 대여 기간 :{" "}
                <span className="text-primary">{rentalDuration}일</span>
              </li>
              <li>
                • 보증 물품 :{" "}
                <span className="text-primary">{guaranteedGoods}</span>
              </li>
              <li>
                • 물품 설명 : <span>{description}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full flex flex-col font-[Pretendard] mt-7.5 px-8 gap-7.5">
          <div>
            <div className="flex gap-0.5 text-neutral-gray-2 text-14px font-bold mb-2.5">
              <p>이름</p>
              <p className="text-primary">*</p>
            </div>
            <CommonInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              inputSize="large"
              className="text-14px placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
            />
          </div>
          <div>
            <div className="flex gap-0.5 text-neutral-gray-2 text-14px font-bold ">
              <p>연락처</p>
              <p className="text-primary">*</p>
            </div>
            <p className="text-neutral-gray-3 text-12px font-[400] mt-1.5 mb-2.5 leading-none">
              숫자로만 적어주세요.
            </p>
            <div className="flex items-center justify-between gap-1.5">
              <CommonInput
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={11}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="01012345678"
                inputSize="large"
                className="w-54 text-14px text-neutral-gray-1 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
              />
              <Button
                variant="primary"
                size="sm"
                className="w-29 h-12"
                disabled={!isValidPhoneNumberForVerification}
              >
                인증번호 전송
              </Button>
            </div>
            <div className="flex items-center justify-between gap-1.5 mt-2.5">
              <CommonInput
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={phoneVerificationCode}
                onChange={(e) => setPhoneVerificationCode(e.target.value)}
                placeholder="인증번호 입력"
                inputSize="large"
                className="w-51 text-14px text-neutral-gray-1 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
              />
              <Button variant="gray" size="sm" className="w-29 h-12">
                인증번호 확인
              </Button>
            </div>
          </div>
          {additionalBorrowerRequirements.map((requirement) => (
            <div key={requirement.label}>
              <div className="flex gap-0.5 text-neutral-gray-2 text-14px font-[700] mb-2.5">
                <p>{requirement.label}</p>
                {requirement.required && <p className=" text-primary">*</p>}
              </div>
              <CommonInput
                type="text"
                value={additionalFieldValues[requirement.label] ?? ""}
                onChange={(e) =>
                  setAdditionalFieldValues((prev) => ({
                    ...prev,
                    [requirement.label]: e.target.value,
                  }))
                }
                placeholder={`${requirement.label}을(를) 입력하세요.`}
                inputSize="large"
                className="placeholder:text-14px placeholder:font-[400] placeholder:leading-[120%]"
              />
            </div>
          ))}
          <div>
            <div className="text-neutral-gray-2 text-14px font-[700] mb-2.5">
              <p>요청사항</p>
            </div>
            <CommonInput
              type="text"
              value={requestment}
              onChange={(e) => setRequestment(e.target.value)}
              placeholder="요청사항을 입력하세요. ex) 반납기한 연장"
              inputSize="large"
              className="placeholder:text-14px placeholder:font-[400] placeholder:leading-[120%]"
            />
          </div>
          {/* 개인 정보 동의 영역 */}
          <div>
            <p className="text-18px text-secondary-2 opacity-[0.9] font-[700]">
              개인 정보 동의
            </p>
            <div className="flex flex-col mt-4 gap-3.5">
              <ConsentSectionCard
                label={label1}
                checked={firstConsentChecked}
                onCheckedChange={setFirstConsentChecked}
              />
              {guaranteedGoods != "" && guaranteedGoods != "-" && (
                <ConsentSectionCard
                  label={label2 + guaranteedGoods + label3}
                  checked={secondConsentChecked}
                  onCheckedChange={setSecondConsentChecked}
                />
              )}
            </div>
          </div>
        </div>
        {/* 요청하기 영역 */}
        <div className="flex flex-col w-full items-center mt-13 mb-11 gap-1.5">
          <p className="text-primary text-10px font-[400] leading-[130%]">
            관리자 승인 후 대여가 완료됩니다.
          </p>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={
              !firstConsentChecked ||
              (isGuaranteedGoodsRequired && !secondConsentChecked) ||
              isPending
            }
          >
            대여 요청하기
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default RentalInformationSubmitPage;
