import { useMemo, useState } from "react";
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

const RentalInformationSubmitPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const state = location.state as {
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
  const borrowerRequirements =
    itemDetail?.borrowerRequirements ?? state?.borrowerRequirements ?? [];
  const additionalBorrowerRequirements = useMemo(
    () =>
      borrowerRequirements.filter(
        (req, index, arr) =>
          req.label !== "이름" &&
          req.label !== "연락처" &&
          req.label !== "전화번호" &&
          req.label !== "요청사항" &&
          arr.findIndex((item) => item.label === req.label) === index,
      ),
    [borrowerRequirements],
  );

  // 대여자 이름 : string
  const [name, setName] = useState("");
  // 대여자 전화번호 : string
  const [phoneNumber, setPhoneNumber] = useState("");
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
    renterFields["이름"] = normalizedName;
    renterFields["전화번호"] = normalizedPhone;

    borrowerRequirements.forEach(({ label }) => {
      if (label === "이름") return;
      if (label === "전화번호") {
        if (normalizedPhone) {
          renterFields[label] = normalizedPhone;
        }
        return;
      }
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
        onSuccess: () => {
          if (organizationId && organizationId > 0) {
            navigate(
              `/client-rental-confirmation?organizationId=${organizationId}`,
            );
            return;
          }
          navigate("/client-rental-confirmation");
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
        ></Header>
        <div className="w-84.5 h-44 font-[Pretendard] bg-secondary-4 rounded-[16px] mt-6 mx-7.75">
          <div className="pt-7.25 pl-8 pb-7.75">
            <div className="flex flex-col">
              <p className="text-neutral-gray-1 text-24px font-[700]">
                {itemName}
              </p>
              <p className="text-neutral-gray-2 text-16px font-[500] leading-none">
                {itemName}(1)
              </p>
            </div>
            <ul className="text-12px text-neutral-gray-3 font-[400] mt-4.25 leading-[130%]">
              <li>
                대여 기간 :{" "}
                <span className="text-primary">{rentalDuration}일</span>
              </li>
              <li>
                보증 물품 :{" "}
                <span className="text-primary">{guaranteedGoods}</span>
              </li>
              <li>
                물품 설명 : <span>{description}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full flex flex-col font-[Pretendard] mt-7.5 px-8 gap-7.5">
          <div>
            <div className="text-neutral-gray-2 text-14px font-[700] mb-2.5">
              <p className="inline ">이름</p>
              <p className="inline text-primary">*</p>
            </div>
            <CommonInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              inputSize="large"
              className="placeholder:text-14px placeholder:font-[400] placeholder:leading-[120%]"
            ></CommonInput>
          </div>
          <div>
            <div className=" text-neutral-gray-2 text-14px font-[700] ">
              <p className="inline">연락처</p>
              <p className="inline text-primary">*</p>
              <p className="text-neutral-gray-3 text-12px font-[400] mt-1.5 mb-2.5 leading-none">
                숫자로만 적어주세요.
              </p>
            </div>
            <CommonInput
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={11}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="01012345678"
              inputSize="large"
              className="text-14px text-neutral-gray-1 placeholder:text-14px placeholder:font-[400] placeholder:leading-[120%]"
            ></CommonInput>
          </div>
          {additionalBorrowerRequirements.map((requirement) => (
            <div key={requirement.label}>
              <div className="text-neutral-gray-2 text-14px font-[700] mb-2.5">
                <p className="inline">{requirement.label}</p>
                {requirement.required && (
                  <p className="inline text-primary">*</p>
                )}
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
              ></CommonInput>
            </div>
          ))}
          <div>
            <div className="text-neutral-gray-2 text-14px font-[700] mb-2.5">
              <p className="inline">요청사항</p>
            </div>
            <CommonInput
              type="text"
              value={requestment}
              onChange={(e) => setRequestment(e.target.value)}
              placeholder="요청사항을 입력하세요. ex) 반납기한 연장"
              inputSize="large"
              className="placeholder:text-14px placeholder:font-[400] placeholder:leading-[120%]"
            ></CommonInput>
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
              ></ConsentSectionCard>
              {guaranteedGoods != "" && guaranteedGoods != "-" && (
                <ConsentSectionCard
                  label={label2 + guaranteedGoods + label3}
                  checked={secondConsentChecked}
                  onCheckedChange={setSecondConsentChecked}
                ></ConsentSectionCard>
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
