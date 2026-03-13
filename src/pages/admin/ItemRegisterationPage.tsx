import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import Button from "../../components/Button";
import CommonInput from "../../components/CommonInput";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAdminItem } from "../../hooks/queries/useAdminQueries";
import CustomCheckBox from "../../components/CustomCheckbox";
type RenterFieldKey = "name" | "studentNumber" | "phone" | "major";

const ItemRegisterationPage = () => {
  const navigate = useNavigate();
  const { mutate: createItem, isPending } = useCreateAdminItem();
  // 물품 기본 정보
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [rentalDurationDays, setRentalDurationDays] = useState(1);

  // 대여자 입력 요구 정보 (필수 3개는 고정)
  const [optionalMajorEnabled, setOptionalMajorEnabled] = useState(true);
  const [extraRenterFieldEnabled, setExtraRenterFieldEnabled] = useState(false);
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

  // 관리자 물품 등록 API 호출
  const handleCreateItem = () => {
    if (!isFormValid) return;

    const borrowerRequirements = [
      ...renterRequiredFields.map((f) => ({
        fieldKey: f.key,
        label: f.label,
        fieldType: "TEXT",
        required: true,
      })),
      ...(optionalMajorEnabled
        ? [
            {
              fieldKey: "major",
              label: "학과",
              fieldType: "TEXT",
              required: false,
            },
          ]
        : []),
      ...(extraRenterFieldEnabled && extraRenterFieldLabel.trim()
        ? [
            {
              fieldKey: extraRenterFieldLabel.trim(),
              label: extraRenterFieldLabel.trim(),
              fieldType: "TEXT",
              required: false,
            },
          ]
        : []),
    ];

    createItem(
      {
        name: itemName.trim(),
        description: description.trim(),
        rentalDuration: rentalDurationDays,
        isActive: true,
        borrowerRequirements,
      },
      {
        onSuccess: () => {
          alert("물품이 등록되었습니다.");
          navigate("/item-manage");
        },
        onError: () => {
          alert("물품 등록에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

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

          <div className="rounded-[16px] bg-neutral-white shadow-item-card  px-5 py-4">
            <div className="flex flex-col justify-center gap-3.5 text-14px text-neutral-[#444] font-bold">
              {renterRequiredFields.map((f) => (
                <label key={f.key} className="flex items-center gap-3">
                  <CustomCheckBox checked onCheckedChange={() => {}} disabled />
                  <span>
                    {f.label}
                    <span className="text-primary"> *</span>
                  </span>
                </label>
              ))}

              <div className="flex items-center gap-3">
                <CustomCheckBox
                  checked={optionalMajorEnabled}
                  onCheckedChange={setOptionalMajorEnabled}
                />
                <span>학과</span>
              </div>
            </div>

            <div className="mt-3.5">
              <div className="flex items-center gap-3">
                <CustomCheckBox
                  checked={extraRenterFieldEnabled}
                  onCheckedChange={(checked) => {
                    setExtraRenterFieldEnabled(checked);
                    if (!checked) {
                      setExtraRenterFieldLabel("");
                    }
                  }}
                />
                <input
                  value={extraRenterFieldLabel}
                  onChange={(e) => setExtraRenterFieldLabel(e.target.value)}
                  placeholder="추가 정보 입력"
                  className="w-59.25 border-b-[0.859px] text-14px font-bold placeholder:text-14px placeholder:text-[#000] placeholder:font-normal placeholder:opacity-[0.39] placeholder:leading-[130%] pb-1.5 focus:outline-none disabled:opacity-40"
                  disabled={!extraRenterFieldEnabled}
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
          <div className="h-13 flex items-center justify-start rounded-small bg-neutral-white shadow-item-card px-5 py-3.5 mb-2.5 gap-3">
            <CustomCheckBox
              checked={sendOverdueMessageEnabled}
              onCheckedChange={setSendOverdueMessageEnabled}
            />
            <span className="text-14px text-neutral-gray-2 font-[600]">
              독촉 문자 발송하기
            </span>
          </div>

          {/* 담보 물품 존재 */}
          <div className="h-23.5 rounded-small bg-neutral-white shadow-item-card px-5 py-4.25">
            <div className="flex items-center justify-start gap-3">
              <CustomCheckBox
                checked={hasGuaranteedGoods}
                onCheckedChange={setHasGuaranteedGoods}
              />
              <span className="text-14px text-neutral-gray-2 font-[600]">
                담보 물품 존재
              </span>
            </div>
            {hasGuaranteedGoods && (
              <div className="mt-2 ml-1">
                <input
                  value={guaranteedGoodsLabel}
                  onChange={(e) => setGuaranteedGoodsLabel(e.target.value)}
                  placeholder="추가 정보 입력"
                  className="w-59.25 border-b-[0.859px] placeholder:text-14px placeholder:text-[#000] placeholder:opacity-[0.39] placeholder:leading-[130%] pb-1.5 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* 등록 버튼 */}
        {/* TODO: 등록 성공 시 확인 모달 or 확인 화면 띄운 후 물품 관리 페이지(item-manage)로 이동 */}
        <div className="flex justify-center pt-2">
          <Button
            variant="primary"
            size="lg"
            disabled={!isFormValid || isPending}
            onClick={handleCreateItem}
          >
            {isPending ? "등록 중..." : "물품 등록하기"}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ItemRegisterationPage;
