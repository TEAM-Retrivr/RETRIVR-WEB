import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import Button from "../../components/Button";
import CommonInput from "../../components/CommonInput";
import { useMemo, useState } from "react";

type RenterFieldKey = "name" | "studentNumber" | "phone" | "major";

const CustomCheckbox = ({
  checked,
  onCheckedChange,
  disabled,
}: {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="px-1">
      {/* 실제 체크박스는 숨김 */}
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
      {/* 커스텀 체크박스 영역 */}
      <div
        className={`w-4.75 h-4.75 flex items-center justify-center transition-colors rounded-[4px] border-1 ${
          checked
            ? "bg-primary border-primary"
            : "bg-white border-neutral-gray-4"
        } ${disabled ? "opacity-60" : ""}`}
      >
        {/* 체크되었을 때 아이콘 표시 */}
        {checked && <img src="/icons/client/checked.svg" alt="체크됨" />}
      </div>
    </div>
  );
};

const ItemRegisterationPage = () => {
  // 물품 기본 정보
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [rentalDurationDays, setRentalDurationDays] = useState(1);

  // 대여자 입력 요구 정보 (필수 3개는 고정)
  const [optionalMajorEnabled, setOptionalMajorEnabled] = useState(true);
  const [extraRenterFieldLabel, setExtraRenterFieldLabel] = useState("");

  // 추가 선택사항
  const [sendOverdueMessageEnabled, setSendOverdueMessageEnabled] =
    useState(false);
  const [hasGuaranteedGoods, setHasGuaranteedGoods] = useState(false);
  const [guaranteedGoodsLabel, setGuaranteedGoodsLabel] = useState("");

  const isFormValid = useMemo(() => {
    if (!itemName.trim()) return false;
    if (!description.trim()) return false;
    if (totalQuantity <= 0) return false;
    if (rentalDurationDays <= 0) return false;
    if (hasGuaranteedGoods && !guaranteedGoodsLabel.trim()) return false;
    return true;
  }, [
    itemName,
    description,
    totalQuantity,
    rentalDurationDays,
    hasGuaranteedGoods,
    guaranteedGoodsLabel,
  ]);

  const renterRequiredFields: { key: RenterFieldKey; label: string }[] = [
    { key: "name", label: "이름" },
    { key: "studentNumber", label: "학번" },
    { key: "phone", label: "연락처" },
  ];

  return (
    <Layout>
      <Header
        name="건국대학교 도서관자치위원회"
        pageName="물품 신규 등록"
      ></Header>
      <div className="flex flex-col px-8 pt-7.5 pb-10 gap-9 font-[Pretendard]">
        {/* 물품명 */}
        <div className="flex flex-col gap-5.5">
          <div className="flex flex-col w-full gap-2.5">
            <div>
              <p className="inline text-14px font-bold leading-none">물품명</p>
              <p className="inline text-primary">*</p>
            </div>
            <CommonInput
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="물품 이름을 적어주세요."
              className="h-12 placeholder:text-14px placeholder:leading-none"
            />
          </div>

          {/* 설명 */}
          <div className="flex flex-col w-full gap-2.5">
            <p className="text-14px font-bold leading-none">설명</p>
            <CommonInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="물품에 대해 적어주세요."
              className="h-12 placeholder:text-14px placeholder:leading-none"
            />
          </div>

          {/* 총 개수 / 대여 기간 */}
          <div className="w-61 flex flex-col gap-4.5">
            {/* 총 개수 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="inline text-14px font-bold leading-none">
                  총 개수{" "}
                  <span className="text-10px text-neutral-gray-3 font-normal leading-[130%]">
                    (개){" "}
                  </span>
                </p>
                <p className="inline text-primary">*</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="bg-none"
                  onClick={() => setTotalQuantity((v) => Math.max(1, v - 1))}
                  aria-label="총 개수 감소"
                >
                  <img src="/icons/minus-count.svg" alt="-" />
                </button>
                <div className="flex flex-col items-center justify-center w-15.5 h-10 text-14px text-neutral-gray-1 rounded-[20px] shadow-count-box">
                  {totalQuantity}
                </div>
                <button
                  type="button"
                  className="bg-none"
                  onClick={() => setTotalQuantity((v) => v + 1)}
                  aria-label="총 개수 증가"
                >
                  <img src="/icons/plus-count.svg" alt="+" />
                </button>
              </div>
            </div>

            {/* 대여 기간 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="inline text-14px font-bold leading-none">
                  대여 기간{" "}
                  <span className="text-10px text-neutral-gray-3 font-normal leading-[130%]">
                    (일){" "}
                  </span>
                </p>
                <p className="inline text-primary">*</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="bg-none"
                  onClick={() =>
                    setRentalDurationDays((v) => Math.max(1, v - 1))
                  }
                  aria-label="대여 기간 감소"
                >
                  <img src="/icons/minus-count.svg" alt="-" />
                </button>
                <div className="flex flex-col items-center justify-center w-15.5 h-10 text-14px text-neutral-gray-1 rounded-[20px] shadow-count-box">
                  {rentalDurationDays}
                </div>
                <button
                  type="button"
                  className="bg-none"
                  onClick={() => setRentalDurationDays((v) => v + 1)}
                  aria-label="대여 기간 증가"
                >
                  <img src="/icons/plus-count.svg" alt="+" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 대여자 입력 요구 정보 */}
        <div className="flex flex-col gap-3">
          <div className="pl-2.5">
            <p className="text-18px text-secondary-2 opacity-[0.9] font-bold">
              대여자 입력 요구 정보
            </p>
            <p className="text-11px text-[#000] opacity-[0.39] font-normal mt-1">
              물품을 대여할 때 대여자가 입력해야 할 정보를 선택 또는
              추가해주세요.
            </p>
          </div>

          <div className="rounded-[16px] bg-neutral-gray-6 px-5 py-4">
            <div className="flex flex-col gap-3 text-14px text-neutral-gray-2 font-[600]">
              {renterRequiredFields.map((f) => (
                <label
                  key={f.key}
                  className="flex items-center gap-3 opacity-70"
                >
                  <CustomCheckbox checked onCheckedChange={() => {}} disabled />
                  <span>
                    {f.label}
                    <span className="text-primary"> *</span>
                  </span>
                </label>
              ))}

              <label className="flex items-center gap-3">
                <CustomCheckbox
                  checked={optionalMajorEnabled}
                  onCheckedChange={setOptionalMajorEnabled}
                />
                <span>학과</span>
              </label>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3">
                <CustomCheckbox checked={!!extraRenterFieldLabel} disabled />
                <CommonInput
                  value={extraRenterFieldLabel}
                  onChange={(e) => setExtraRenterFieldLabel(e.target.value)}
                  placeholder="추가 정보 입력"
                  inputSize="medium"
                  className="!max-w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 추가 선택사항 */}
        <div className="flex flex-col">
          <div className="pl-2.5 pb-4.5">
            <p className="text-18px text-secondary-2 opacity-[0.9] font-bold">
              추가 선택사항
            </p>
            <p className="text-11px text-neutral-gray-3 font-normal leading-[130%] mt-0.5">
              물품 반납에 필요한 사항을 추가로 선택해주세요.
            </p>
          </div>

          {/* 독촉 문자 발송 */}
          <label className="h-13 flex items-center justify-start rounded-small bg-neutral-white shadow-item-card px-5 py-3.5 mb-2.5 gap-3">
            <CustomCheckbox
              checked={sendOverdueMessageEnabled}
              onCheckedChange={setSendOverdueMessageEnabled}
            />
            <span className="text-14px text-neutral-gray-2 font-[600]">
              독촉 문자 발송하기
            </span>
          </label>

          {/* 담보 물품 존재 */}
          <div className="h-23.5 rounded-small bg-neutral-white shadow-item-card px-5 py-4.25">
            <label className="flex items-center justify-start gap-3">
              <CustomCheckbox
                checked={hasGuaranteedGoods}
                onCheckedChange={setHasGuaranteedGoods}
              />
              <span className="text-14px text-neutral-gray-2 font-[600]">
                담보 물품 존재
              </span>
            </label>
            {hasGuaranteedGoods && (
              <div className="mt-3">
                <CommonInput
                  value={guaranteedGoodsLabel}
                  onChange={(e) => setGuaranteedGoodsLabel(e.target.value)}
                  placeholder="추가 정보 입력"
                  inputSize="medium"
                  className=""
                />
              </div>
            )}
          </div>
        </div>

        {/* 등록 버튼 */}
        <div className="flex justify-center pt-2">
          <Button variant="primary" size="lg" disabled={!isFormValid}>
            물품 등록하기
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ItemRegisterationPage;
