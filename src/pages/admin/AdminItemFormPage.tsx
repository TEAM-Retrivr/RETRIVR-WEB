import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import CommonInput from "../../components/CommonInput";
import CustomCheckBox from "../../components/CustomCheckbox";
import Header from "../../components/Header";
import { Layout } from "../../components/Layout";
import ConfirmModal from "../../components/modals/ConfirmModal";
import ErrorModal from "../../components/modals/ErrorModal";
import {
  useAdminItemDetail,
  useCreateAdminItem,
  useUpdateAdminItem,
} from "../../hooks/queries/useAdminQueries";
import type {
  AdminCreateItemRequest,
  AdminItemDetailResponse,
  AdminItemUnitChangeEntry,
  AdminUpdateItemRequest,
} from "../../api/admin/admin.type";
import { useLoadHome } from "../../hooks/queries/useAuthQueries";

type RenterFieldKey = "name" | "studentNumber" | "phone" | "major";

type ExtraRenterField = {
  id: number;
  enabled: boolean;
  label: string;
};

type AdminItemFormPageProps = {
  mode: "create" | "edit";
  itemId?: number;
};

const BASE_REQUIRED_LABELS = ["이름", "전화번호"] as const;

const OPTIONAL_LABELS = {
  studentNumber: "학번",
  major: "학과",
} as const;

/** PATCH unitChanges 중 슬롯별 반영: 추가는 currentLabel null, 이름 변경만 이전·이후 문자열 */
function buildUnitSlotChanges(
  desired: string[],
  original: string[],
): AdminItemUnitChangeEntry[] {
  const out: AdminItemUnitChangeEntry[] = [];
  for (let i = 0; i < desired.length; i++) {
    const next = (desired[i] ?? "").trim();
    const rawPrev = original[i];
    const currentLabel =
      rawPrev != null && String(rawPrev).trim() !== ""
        ? String(rawPrev).trim()
        : null;
    if (currentLabel === null) {
      out.push({ currentLabel: null, label: next });
    } else if (currentLabel !== next) {
      out.push({ currentLabel, label: next });
    }
  }
  return out;
}

/** UNIT → NON_UNIT 저장 시 서버에 남아 있는 유닛을 없애려면 각각 { currentLabel, label: null } 로 보냄 (조회 응답 기준) */
function buildUnitClearChangesFromDetail(
  detail: AdminItemDetailResponse | undefined,
): AdminItemUnitChangeEntry[] {
  if (!detail) return [];
  const fromUnits =
    detail.itemUnits?.map((u) => u.label.trim()).filter(Boolean) ?? [];
  if (fromUnits.length > 0) {
    return fromUnits.map((label) => ({
      currentLabel: label,
      label: null,
    }));
  }
  const fromLabels =
    detail.unitLabels?.map((l) => String(l).trim()).filter(Boolean) ?? [];
  return fromLabels.map((label) => ({
    currentLabel: label,
    label: null,
  }));
}

const AdminItemFormPage = ({ mode, itemId }: AdminItemFormPageProps) => {
  const navigate = useNavigate();
  const { mutate: createItem, isPending: isCreatePending } =
    useCreateAdminItem(); // 신규 등록 요청 함수 & 등록 진행 상태
  const { mutate: updateItem, isPending: isUpdatePending } =
    useUpdateAdminItem(); // 수정 요청 함수 & 수정 진행 상태
  const shouldLoadDetail =
    mode === "edit" && Number.isFinite(itemId) && (itemId ?? 0) > 0; // 수정 모드에서만 상세 조회 조건 활성화
  const {
    data: detailData, // 수정 폼 초기값으로 사용할 상세 데이터
    isLoading: isDetailLoading, // 상세 조회 로딩 상태
    error: detailError, // 상세 조회 에러 상태
  } = useAdminItemDetail(shouldLoadDetail ? (itemId as number) : 0); // 조건 불충족 시 쿼리 enabled=false로 실제 요청 안 함

  const isPending = isCreatePending || isUpdatePending; // 등록/수정 둘 중 하나라도 진행 중이면 true
  const { data: homeData } = useLoadHome(); // 관리자 홈 정보(단체명 포함)
  const organizationName = homeData?.organizationName; // 헤더 상단에 표시할 단체명

  const [modalType, setModalType] = useState<"confirm" | "error" | null>(null); // 결과 모달 상태(성공/실패/닫힘)
  const [itemName, setItemName] = useState(""); // 물품명 입력값
  const [description, setDescription] = useState(""); // 물품 설명 입력값
  const [totalQuantity, setTotalQuantity] = useState(1); // 총 수량 입력값
  const [rentalDurationDays, setRentalDurationDays] = useState(1); // 대여 기간(일) 입력값
  const [optionalMajorEnabled, setOptionalMajorEnabled] = useState(true); // 학과 요구 항목 체크 상태
  const [optionalStudentNumberEnabled, setOptionalStudentNumberEnabled] =
    useState(true); // 학번 요구 항목 체크 상태
  const [extraRenterFields, setExtraRenterFields] = useState<
    ExtraRenterField[]
  >([{ id: 1, enabled: false, label: "" }]); // 커스텀 추가 입력 항목 목록(초기 1행)
  const [addItemDetailName, setAddItemDetailName] = useState(false); // 세부 물품 라벨 사용 여부
  // 세부 물품마다 보여줄 이름을 담는 배열임. 체크했을 때만 쓰고, 길이는 항상 totalQuantity랑 맞춤
  const [unitDetailLabels, setUnitDetailLabels] = useState<string[]>([]);
  const [originalUnitLabels, setOriginalUnitLabels] = useState<string[]>([]); // 수정 시 기존 unit 라벨 원본(패치용)
  const [sendOverdueMessageEnabled, setSendOverdueMessageEnabled] =
    useState(false); // 연체 알림 발송 옵션 체크 상태
  const [hasGuaranteedGoods, setHasGuaranteedGoods] = useState(false); // 보증 물품 존재 여부
  const [guaranteedGoodsLabel, setGuaranteedGoodsLabel] = useState(""); // 보증 물품명 입력값

  // 행 삭제·수량 감소로 빠진 유닛은 { currentLabel, label: null }로 PATCH에 따로 쌓음
  const pendingUnitDeleteOpsRef = useRef<AdminItemUnitChangeEntry[]>([]);

  useEffect(() => {
    if (!detailData || mode !== "edit") return;

    const borrowerRequirements = detailData.borrowerRequirements ?? [];
    const studentEnabled = borrowerRequirements.some(
      (field) => field.label === OPTIONAL_LABELS.studentNumber,
    );
    const majorEnabled = borrowerRequirements.some(
      (field) => field.label === OPTIONAL_LABELS.major,
    );

    const extras = borrowerRequirements
      .filter((field) => {
        return (
          !BASE_REQUIRED_LABELS.includes(
            field.label as (typeof BASE_REQUIRED_LABELS)[number],
          ) &&
          field.label !== OPTIONAL_LABELS.studentNumber &&
          field.label !== OPTIONAL_LABELS.major
        );
      })
      .map((field, index) => ({
        id: index + 1,
        enabled: true,
        label: field.label,
      }));

    const labelsFromUnits = Array.isArray(detailData.itemUnits)
      ? detailData.itemUnits
          .map((unit) => unit.label)
          .filter((label): label is string => Boolean(label?.trim()))
      : [];
    const labelsFromUnitLabels = Array.isArray(detailData.unitLabels)
      ? detailData.unitLabels.filter((label): label is string =>
          Boolean(label?.trim()),
        )
      : [];
    const initialUnitLabels =
      labelsFromUnits.length > 0 ? labelsFromUnits : labelsFromUnitLabels;
    const hasUnitLabels = initialUnitLabels.length > 0;

    setItemName(detailData.name ?? "");
    setDescription(detailData.description ?? "");
    setTotalQuantity(detailData.totalQuantity ?? 1);
    setRentalDurationDays(detailData.rentalDuration ?? 1);
    setOptionalStudentNumberEnabled(studentEnabled);
    setOptionalMajorEnabled(majorEnabled);
    setExtraRenterFields([
      ...extras,
      { id: extras.length + 1 || 1, enabled: false, label: "" },
    ]);
    setAddItemDetailName(hasUnitLabels);
    setOriginalUnitLabels(initialUnitLabels);
    // 수정 진입 시: 서버에 있던 세부 이름이 있으면 그걸 쓰고, 없는 슬롯은 물품명 (n) 형태로 채움
    const qty = detailData.totalQuantity ?? 1;
    const nameBase = (detailData.name ?? "").trim();
    setUnitDetailLabels(
      hasUnitLabels
        ? Array.from({ length: qty }, (_, i) => {
            const fromApi = initialUnitLabels[i]?.trim();
            return fromApi || `${nameBase || "물품"} (${i + 1})`;
          })
        : [],
    );
    setSendOverdueMessageEnabled(Boolean(detailData.useMessageAlarmService));
    setHasGuaranteedGoods(Boolean(detailData.guaranteedGoods));
    setGuaranteedGoodsLabel(detailData.guaranteedGoods ?? "");
    pendingUnitDeleteOpsRef.current = [];
  }, [detailData, mode]);

  // 총 개수만 바꿀 때 세부 이름 배열 길이를 같이 맞춤. 늘리면 새 칸은 기본 문구로 채우고, 줄이면 뒤에서 자름
  const syncUnitDetailLabelsToQuantity = (nextQty: number) => {
    if (!addItemDetailName) return;
    setUnitDetailLabels((prev) => {
      if (prev.length === nextQty) return prev;
      const base = itemName.trim() || "물품";
      if (prev.length < nextQty) {
        return [
          ...prev,
          ...Array.from(
            { length: nextQty - prev.length },
            (_, j) => `${base} (${prev.length + j + 1})`,
          ),
        ];
      }
      return prev.slice(0, nextQty);
    });
  };

  // 위쪽 총 개수 +/- 버튼에서 호출함. 세부 이름 모드일 때 original·라벨 배열 길이와, 줄이면 끝 슬롯 삭제 PATCH용 기록까지 맞춤
  const handleTotalQuantityDelta = (delta: -1 | 1) => {
    const nextQty =
      delta === -1 ? Math.max(1, totalQuantity - 1) : totalQuantity + 1;
    if (nextQty === totalQuantity) return;

    if (addItemDetailName) {
      if (nextQty < totalQuantity) {
        for (let j = nextQty; j < totalQuantity; j++) {
          const lab = originalUnitLabels[j]?.trim();
          if (lab) {
            pendingUnitDeleteOpsRef.current.push({
              currentLabel: lab,
              label: null,
            });
          }
        }
        setOriginalUnitLabels((prev) => prev.slice(0, nextQty));
      } else {
        setOriginalUnitLabels((prev) => {
          if (prev.length >= nextQty) return prev;
          return [...prev, ...Array(nextQty - prev.length).fill("")];
        });
      }
      syncUnitDetailLabelsToQuantity(nextQty);
    }
    setTotalQuantity(nextQty);
  };

  // 체크하면 세부 이름 모드 켜지고, 이미 적어둔 칸은 유지하고 빈 칸만 기본값으로 채움
  const handleAddItemDetailNameChange = (checked: boolean) => {
    setAddItemDetailName(checked);
    if (!checked) return;
    setUnitDetailLabels((prev) =>
      Array.from({ length: totalQuantity }, (_, i) => {
        const existing = prev[i]?.trim();
        if (existing) return prev[i];
        return `${itemName.trim() || "물품"} (${i + 1})`;
      }),
    );
  };

  // 한 줄 삭제: 서버에 있던 라벨이면 삭제 연산 누적 후, 수량·배열에서 해당 인덱스 제거
  const handleRemoveUnitDetailRow = (index: number) => {
    if (totalQuantity <= 1) return;
    const serverLabel = originalUnitLabels[index]?.trim();
    if (serverLabel) {
      pendingUnitDeleteOpsRef.current.push({
        currentLabel: serverLabel,
        label: null,
      });
    }
    setTotalQuantity((q) => q - 1);
    setUnitDetailLabels((prev) => prev.filter((_, j) => j !== index));
    setOriginalUnitLabels((prev) => prev.filter((_, j) => j !== index));
  };

  const isFormValid = useMemo(() => {
    if (!itemName.trim()) return false;
    if (totalQuantity <= 0) return false;
    if (rentalDurationDays <= 0) return false;
    if (hasGuaranteedGoods && !guaranteedGoodsLabel.trim()) return false;
    return true;
  }, [
    itemName,
    totalQuantity,
    rentalDurationDays,
    hasGuaranteedGoods,
    guaranteedGoodsLabel,
  ]);

  const renterRequiredFields: { key: RenterFieldKey; label: string }[] = [
    { key: "name", label: "이름" },
    { key: "phone", label: "전화번호" },
  ];

  const handleSubmit = () => {
    if (!isFormValid) return;
    if (mode === "edit" && (!itemId || itemId <= 0)) return;

    const borrowerRequirements = [
      ...renterRequiredFields.map((f) => ({
        label: f.label,
        required: true,
      })),
      ...(optionalStudentNumberEnabled
        ? [{ label: OPTIONAL_LABELS.studentNumber, required: true }]
        : []),
      ...(optionalMajorEnabled
        ? [{ label: OPTIONAL_LABELS.major, required: true }]
        : []),
      ...extraRenterFields
        .filter((field) => field.enabled && field.label.trim())
        .map((field) => ({
          label: field.label.trim(),
          required: false,
        })),
    ];
    // 세부 이름 켜진 경우에만 보냄. 칸을 비워두면 서버에는 물품명 (n) 같은 기본값으로 채워서 넣음
    const desiredUnitLabels = addItemDetailName
      ? Array.from({ length: totalQuantity }, (_, i) => {
          const raw = unitDetailLabels[i]?.trim() ?? "";
          return raw || `${itemName.trim()} (${i + 1})`;
        })
      : [];

    // 세부 물품(유닛) 이름을 쓰면 UNIT, 아니면 NON_UNIT (요청 바디 종류가 다름)
    const itemManagementType = addItemDetailName ? "UNIT" : "NON_UNIT";

    const flushPendingDeletesOnSuccess = () => {
      pendingUnitDeleteOpsRef.current = [];
    };

    if (mode === "create") {
      // NON_UNIT: unitLabels 없음. UNIT: unitLabels만 (명세상 unitChanges는 PATCH 전용)
      const createBody: AdminCreateItemRequest = {
        name: itemName.trim(),
        description: description.trim() || "",
        totalQuantity,
        rentalDuration: rentalDurationDays,
        itemManagementType,
        useMessageAlarmService: sendOverdueMessageEnabled,
        guaranteedGoods: hasGuaranteedGoods
          ? guaranteedGoodsLabel.trim()
          : null,
        borrowerRequirements,
        ...(addItemDetailName ? { unitLabels: desiredUnitLabels } : {}),
      };
      createItem(createBody, {
        onSuccess: () => {
          flushPendingDeletesOnSuccess();
          setModalType("confirm");
        },
        onError: () => setModalType("error"),
      });
      return;
    }

    const baseUpdate: AdminUpdateItemRequest = {
      name: itemName.trim(),
      description: description.trim() || "",
      totalQuantity,
      rentalDuration: rentalDurationDays,
      itemManagementType,
      useMessageAlarmService: sendOverdueMessageEnabled,
      guaranteedGoods: hasGuaranteedGoods ? guaranteedGoodsLabel.trim() : null,
      borrowerRequirements,
      isActive: true,
    };

    let updateBody: AdminUpdateItemRequest;
    if (itemManagementType === "UNIT") {
      updateBody = {
        ...baseUpdate,
        unitChanges: [
          ...pendingUnitDeleteOpsRef.current,
          ...buildUnitSlotChanges(desiredUnitLabels, originalUnitLabels),
        ],
      };
    } else {
      // NON_UNIT: 원래부터 유닛 없음이면 unitChanges 없음.
      // UNIT이었다가 NON_UNIT으로 바꾸면 DB에 유닛이 남아 있어서 거절되므로, 상세 조회 시점 기준으로 유닛 전부 삭제
      const clearUnitChanges = buildUnitClearChangesFromDetail(detailData);
      updateBody =
        clearUnitChanges.length > 0
          ? { ...baseUpdate, unitChanges: clearUnitChanges }
          : baseUpdate;
    }

    updateItem(
      { itemId: itemId as number, body: updateBody },
      {
        onSuccess: () => {
          flushPendingDeletesOnSuccess();
          setModalType("confirm");
        },
        onError: () => setModalType("error"),
      },
    );
  };

  if (mode === "edit" && !shouldLoadDetail) {
    return (
      <Layout>
        <div>잘못된 접근입니다.</div>
      </Layout>
    );
  }

  if (mode === "edit" && isDetailLoading) {
    return (
      <Layout>
        <div>로딩 중...</div>
      </Layout>
    );
  }

  if (mode === "edit" && detailError) {
    return (
      <Layout>
        <div>물품 정보를 불러오지 못했습니다.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        name={organizationName}
        pageName={mode === "create" ? "물품 신규 등록" : "물품 정보 수정"}
        backTo="/item-manage"
      />
      <div className="flex flex-col px-8 pt-7.5 pb-10 gap-9 font-[Pretendard]">
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

          <div className="flex flex-col w-full gap-2.5">
            <p className="text-14px font-bold leading-none">설명</p>
            <CommonInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="물품에 대해 적어주세요."
              className="h-12 placeholder:text-14px placeholder:leading-none"
            />
          </div>

          <div className="w-full flex flex-col gap-4.5">
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
                  onClick={() => handleTotalQuantityDelta(-1)}
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
                  onClick={() => handleTotalQuantityDelta(1)}
                  aria-label="총 개수 증가"
                >
                  <img src="/icons/plus-count.svg" alt="+" />
                </button>
              </div>
            </div>

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

        {/* 세부 물품 이름: 체크 행 + (켜졌을 때) 입력 목록을 한 카드로 묶음 */}
        <div className="rounded-small bg-neutral-white shadow-item-card overflow-hidden">
          <div className="flex min-h-13 items-center justify-start gap-3 px-5 py-3.5">
            <CustomCheckBox
              checked={addItemDetailName}
              onCheckedChange={handleAddItemDetailNameChange}
            />
            <span className="text-14px text-neutral-gray-2 font-[600]">
              세부 물품에 이름을 지정하시겠어요?
            </span>
          </div>

          {addItemDetailName && (
            <>
              <div className="flex flex-col pb-2">
                {/* 많아지면 스크롤 되게 함. 스크롤바는 숨김 */}
                <div className="no-scrollbar max-h-[min(280px,45vh)] overflow-y-auto flex flex-col gap-0.5 pr-0.5">
                  {Array.from({ length: totalQuantity }, (_, i) => (
                    <div
                      key={i}
                      className="flex py-1 px-4 items-center font-[Pretendard] gap-2"
                    >
                      {/* CommonInput은 가로 풀 넓이 쓰기 애매해서 여기만 동일 스타일로 raw input 씀 */}
                      <input
                        type="text"
                        value={unitDetailLabels[i] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setUnitDetailLabels((prev) => {
                            const next = [...prev];
                            next[i] = value;
                            return next;
                          });
                        }}
                        placeholder={`${itemName.trim() || "물품"} (${i + 1})`}
                        className="w-54.5 h-12 flex-1 rounded-[12px] bg-[#F8F9F9] px-4 py-3 text-14px text-neutral-gray-1 font-[Pretendard] outline-none transition-all placeholder:text-gray-400 placeholder:leading-none focus:ring-2 focus:ring-blue-100"
                      />
                      <button
                        type="button"
                        className="bg-primary text-neutral-white font-[600] w-20 h-11 shrink-0 rounded-[12px] text-14px px-2"
                        disabled={totalQuantity <= 1}
                        onClick={() => handleRemoveUnitDetailRow(i)}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

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
            <div className="flex flex-col justify-center gap-3.5 text-14px text-neutral-gray-1 font-bold">
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
                  checked={optionalStudentNumberEnabled}
                  onCheckedChange={setOptionalStudentNumberEnabled}
                />
                <span>학번</span>
              </div>
              <div className="flex items-center gap-3">
                <CustomCheckBox
                  checked={optionalMajorEnabled}
                  onCheckedChange={setOptionalMajorEnabled}
                />
                <span>학과</span>
              </div>
            </div>
            <div className="mt-3.5 flex flex-col gap-2.5">
              {extraRenterFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  <CustomCheckBox
                    checked={field.enabled}
                    onCheckedChange={(checked) => {
                      setExtraRenterFields((prev) => {
                        const idx = prev.findIndex((f) => f.id === field.id);
                        if (idx === -1) return prev;

                        if (!checked) {
                          if (prev.length === 1) {
                            return [{ ...prev[0], enabled: false, label: "" }];
                          }
                          return prev.filter((f) => f.id !== field.id);
                        }

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

        <div className="flex flex-col">
          <div className="pl-2.5 pb-4.5">
            <p className="text-18px text-secondary-2 opacity-[0.9] font-bold">
              추가 선택사항
            </p>
            <p className="text-11px text-neutral-gray-3 font-normal leading-[130%] mt-0.5">
              물품 반납에 필요한 사항을 추가로 선택해주세요.
            </p>
          </div>

          <div className="h-13 flex items-center justify-start rounded-small bg-neutral-white shadow-item-card px-5 py-3.5 mb-2.5 gap-3">
            <CustomCheckBox
              checked={sendOverdueMessageEnabled}
              onCheckedChange={setSendOverdueMessageEnabled}
            />
            <span className="text-14px text-neutral-gray-2 font-[600]">
              독촉 문자 발송하기
            </span>
          </div>

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

        <div className="flex justify-center pt-2">
          <Button
            variant="primary"
            size="lg"
            disabled={!isFormValid || isPending}
            onClick={handleSubmit}
          >
            {isPending
              ? mode === "create"
                ? "등록 중..."
                : "수정 중..."
              : mode === "create"
                ? "물품 등록하기"
                : "수정사항 저장하기"}
          </Button>
        </div>

        {modalType === "confirm" && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setModalType(null)}
            message={
              mode === "create"
                ? "물품이 등록되었습니다."
                : "물품 정보가 수정되었습니다."
            }
            confirmText="확인하기"
            onConfirm={() => navigate("/item-manage")}
          />
        )}

        {modalType === "error" && (
          <ErrorModal
            isOpen={true}
            onClose={() => setModalType(null)}
            message1={
              mode === "create"
                ? "물품 등록에 실패했습니다."
                : "물품 수정에 실패했습니다."
            }
            message2="다시 시도해주세요."
            confirmText="확인"
          />
        )}
      </div>
    </Layout>
  );
};

export default AdminItemFormPage;
