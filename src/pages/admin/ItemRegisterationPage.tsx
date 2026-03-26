import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import Button from "../../components/Button";
import CommonInput from "../../components/CommonInput";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAdminItem } from "../../hooks/queries/useAdminQueries";
import CustomCheckBox from "../../components/CustomCheckbox";
import ConfirmModal from "../../components/modals/ConfirmModal";
import ErrorModal from "../../components/modals/ErrorModal";
type RenterFieldKey = "name" | "studentNumber" | "phone" | "major";

type ExtraRenterField = {
  id: number;
  enabled: boolean;
  label: string;
};

const ItemRegisterationPage = () => {
  const navigate = useNavigate();
  const { mutate: createItem, isPending } = useCreateAdminItem();

  // 등록 결과 모달
  const [modalType, setModalType] = useState<"confirm" | "error" | null>(null);

  // 물품 기본 정보
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [rentalDurationDays, setRentalDurationDays] = useState(1);

  // 대여자 입력 요구 정보 (필수 3개는 고정)
  const [optionalMajorEnabled, setOptionalMajorEnabled] = useState(true);
  const [extraRenterFields, setExtraRenterFields] = useState<
    ExtraRenterField[]
  >([{ id: 1, enabled: false, label: "" }]);

  // 추가 선택사항
  const [sendOverdueMessageEnabled, setSendOverdueMessageEnabled] =
    useState(false);
  const [hasGuaranteedGoods, setHasGuaranteedGoods] = useState(false);
  const [guaranteedGoodsLabel, setGuaranteedGoodsLabel] = useState("");

  const isFormValid = useMemo(() => {
    if (!itemName.trim()) return false;
    if (totalQuantity <= 0) return false;
    if (rentalDurationDays <= 0) return false;
    if (hasGuaranteedGoods && !guaranteedGoodsLabel.trim()) return false;
    return true;
  }, [
    itemName,
    description,
    totalQuantity,
    rentalDurationDays,
    sendOverdueMessageEnabled,
    hasGuaranteedGoods,
    guaranteedGoodsLabel,
  ]);

  const renterRequiredFields: { key: RenterFieldKey; label: string }[] = [
    { key: "name", label: "이름" },
    { key: "studentNumber", label: "학번" },
    { key: "phone", label: "전화번호" },
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
              fieldKey: "custom_1",
              label: "학과",
              fieldType: "TEXT",
              required: false,
            },
          ]
        : []),
      ...extraRenterFields
        .filter((field) => field.enabled && field.label.trim())
        .map((field) => ({
          fieldKey: field.label.trim(),
          label: field.label.trim(),
          fieldType: "TEXT",
          required: false,
        })),
    ];

    createItem(
      {
        name: itemName.trim(),
        description: description.trim(),
        rentalDuration: rentalDurationDays,
        isActive: true,
        itemManagementType: "NON_UNIT", // 추후에 분리시킬 예정 (현재 하드코딩됨)
        borrowerRequirements,
      },
      {
        onSuccess: () => {
          setModalType("confirm");
        },
        onError: () => {
          setModalType("error");
        },
      },
    );
  };

  return (
    <Layout>
      <Header
        name="건국대학교 도서관자치위원회"
        pageName="물품 신규 등록"
        backTo="/item-manage"
      ></Header>
      <div className="flex flex-col px-8 pt-7.5 pb-10 gap-9 font-[Pretendard]">
        <div className="flex flex-col gap-5.5">
          {/* 물품명 */}
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
            {/* 추가 정보 입력 영역 : 체크할 때마다 새로운 체크박스 + 입력창이 아래에 생성 */}
            <div className="mt-3.5 flex flex-col gap-2.5">
              {extraRenterFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  <CustomCheckBox
                    checked={field.enabled}
                    onCheckedChange={(checked) => {
                      setExtraRenterFields((prev) => {
                        const idx = prev.findIndex((f) => f.id === field.id);
                        if (idx === -1) return prev;

                        // 체크 해제: 해당 행만 제거 (다른 행은 그대로 유지)
                        if (!checked) {
                          // 마지막 한 줄만 남은 상태라면, 초기 상태(비활성 + 빈 값)로만 리셋
                          if (prev.length === 1) {
                            return [{ ...prev[0], enabled: false, label: "" }];
                          }
                          // 그 외에는 해당 줄만 제거
                          return prev.filter((f) => f.id !== field.id);
                        }

                        // 체크: 현재 필드 활성화 + 마지막 필드였다면 새 빈 행 추가
                        const next = prev.map((f) =>
                          f.id === field.id ? { ...f, enabled: true } : f,
                        );

                        const isLastField = index === prev.length - 1;
                        if (isLastField) {
                          const newId =
                            prev.reduce(
                              (maxId, f) => Math.max(maxId, f.id),
                              0,
                            ) + 1;
                          next.push({
                            id: newId,
                            enabled: false,
                            label: "",
                          });
                        }

                        return next;
                      });
                    }}
                  />
                  <input
                    value={field.label}
                    onChange={(e) => {
                      const value = e.target.value;
                      setExtraRenterFields((prev) =>
                        prev.map((f) =>
                          f.id === field.id ? { ...f, label: value } : f,
                        ),
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();

                      const trimmed = field.label.trim();
                      if (!field.enabled || !trimmed) return;

                      setExtraRenterFields((prev) => {
                        // field가 이미 삭제된 상태면 무시
                        if (!prev.some((f) => f.id === field.id)) return prev;

                        const newId =
                          prev.reduce((maxId, f) => Math.max(maxId, f.id), 0) +
                          1;

                        return [
                          ...prev,
                          {
                            id: newId,
                            enabled: false,
                            label: "",
                          },
                        ];
                      });
                    }}
                    placeholder="추가 정보 입력"
                    className="w-59.25 border-b-[0.859px] text-14px font-bold placeholder:text-14px placeholder:text-[#000] placeholder:font-normal placeholder:opacity-[0.39] placeholder:leading-[130%] pb-1.5 focus:outline-none disabled:opacity-40"
                    disabled={!field.enabled}
                  />
                </div>
              ))}
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
          <div className="rounded-small bg-neutral-white shadow-item-card px-5 py-4.25">
            <div className="flex items-center justify-start gap-3">
              <CustomCheckBox
                checked={hasGuaranteedGoods}
                onCheckedChange={setHasGuaranteedGoods}
              />
              <span className="text-14px text-neutral-gray-2 font-[600]">
                담보 물품 존재
              </span>
            </div>
            <div
              className={`ml-1 overflow-hidden transition-all duration-200 ${
                hasGuaranteedGoods
                  ? "mt-2 max-h-20 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <input
                value={guaranteedGoodsLabel}
                onChange={(e) => setGuaranteedGoodsLabel(e.target.value)}
                placeholder="추가 정보 입력"
                className="w-59.25 border-b-[0.859px] border-neutral-gray-3 placeholder:text-14px placeholder:text-[#000] placeholder:opacity-[0.39] placeholder:leading-[130%] pb-1 focus:outline-none"
              />
            </div>
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

        {modalType === "confirm" && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setModalType(null)}
            message="물품이 등록되었습니다."
            confirmText="확인하기"
            onConfirm={() => navigate("/item-manage")}
          />
        )}

        {modalType === "error" && (
          <ErrorModal
            isOpen={true}
            onClose={() => setModalType(null)}
            message1="물품 등록에 실패했습니다."
            message2="다시 시도해주세요."
            confirmText="확인"
          />
        )}
      </div>
    </Layout>
  );
};

export default ItemRegisterationPage;
