import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../../../Button";
import { Modal } from "../../../Modal";
import { useUpdateAdminRentalReturnDueDate } from "../../../../hooks/queries/useAdminQueries";

// 반납일자 수정 모달에서 필요한 최소 데이터
// - rentalId: PATCH path parameter
// - itemId: 서버 전송용이 아니라 성공 후 캐시 무효화용
interface RentalDateChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalId?: number;
  itemId?: number;
  borrowerName?: string;
  borrowerFields?: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
  rentalDate?: string;
  expectedReturnDueDate?: string;
}

// 캐러셀에서 선택 가능한 연도 범위
const YEAR_MIN = 2026;
const YEAR_MAX = 2029;
const WHEEL_ITEM_HEIGHT = 32;

// API 포맷(YYYY-MM-DD) 맞춤용 2자리 패딩
const pad2 = (value: number) => String(value).padStart(2, "0");

// 서버 날짜 문자열(YYYY-MM-DD 또는 ISO)을 { year, month, day }로 파싱
// 파싱 실패 시 null 반환
const parseDateParts = (value?: string) => {
  if (!value) return null;
  const normalized = value.includes("T") ? value.slice(0, 10) : value;
  const [yearText, monthText, dayText] = normalized.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (!year || !month || !day) return null;
  return { year, month, day };
};

// 특정 연/월의 마지막 날짜 계산 (윤년 포함)
const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

interface DateWheelColumnProps {
  values: number[];
  selectedValue: number;
  unit: string;
  onChange: (value: number) => void;
  formatter?: (value: number) => string;
}

// 모바일용 세로 스크롤 휠 컬럼
// - 스크롤 스냅으로 가장 가까운 값을 선택
// - 중앙 행이 선택값이며, 상/하 1개씩만 노출
const DateWheelColumn = ({
  values,
  selectedValue,
  unit,
  onChange,
  formatter = (value) => String(value),
}: DateWheelColumnProps) => {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const settleTimerRef = useRef<number | null>(null);

  // 중앙 선택 라인을 만들기 위해 위/아래에 더미 1칸 추가
  const wheelRows = useMemo(
    () => [null, ...values, null] as Array<number | null>,
    [values],
  );

  const scrollToValue = (value: number, behavior: ScrollBehavior = "auto") => {
    const container = wheelRef.current;
    if (!container) return;
    const index = values.indexOf(value);
    if (index < 0) return;
    container.scrollTo({
      top: index * WHEEL_ITEM_HEIGHT,
      behavior,
    });
  };

  useEffect(() => {
    scrollToValue(selectedValue, "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue, values.length]);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    const container = wheelRef.current;
    if (!container) return;

    const nearestIndex = Math.round(container.scrollTop / WHEEL_ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(values.length - 1, nearestIndex));
    const nextValue = values[clampedIndex];
    if (nextValue !== selectedValue) {
      onChange(nextValue);
    }

    // 스크롤이 멈추면 가장 가까운 칸으로 자연스럽게 정렬
    if (settleTimerRef.current) {
      window.clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = window.setTimeout(() => {
      scrollToValue(nextValue, "smooth");
    }, 80);
  };

  return (
    <div className="relative w-22">
      {/* 중앙 선택 영역 시각화 */}
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 rounded-[8px] bg-secondary-4" />
      <div
        ref={wheelRef}
        onScroll={handleScroll}
        className="h-24 overflow-y-auto no-scrollbar snap-y snap-mandatory"
      >
        {wheelRows.map((value, index) => (
          <div
            key={`${value ?? "spacer"}-${index}`}
            className="h-8 flex items-center justify-center snap-start"
          >
            {value === null ? null : (
              <button
                type="button"
                onClick={() => {
                  onChange(value);
                  scrollToValue(value, "smooth");
                }}
                className={`text-[16px] leading-[130%] px-2 z-[999] rounded-[6px] ${
                  value === selectedValue
                    ? "font-[600] text-[#000]"
                    : "font-normal text-neutral-gray-4 hover:text-neutral-gray-2"
                }`}
              >
                {formatter(value)}
                {unit}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const RentalDateChangeModal = ({
  isOpen,
  onClose,
  rentalId,
  itemId,
  borrowerName,
  borrowerFields,
  rentalDate,
  expectedReturnDueDate,
}: RentalDateChangeModalProps) => {
  // 반납일자는 대여일자보다 과거로 갈 수 없으므로 최소 허용 일자로 사용
  const minimumDateParts = useMemo(
    () => parseDateParts(rentalDate),
    [rentalDate],
  );

  // 두 날짜 파트를 "YYYYMMDD" 숫자로 비교하기 위한 유틸
  const toComparableDateNumber = (parts: {
    year: number;
    month: number;
    day: number;
  }) => Number(`${parts.year}${pad2(parts.month)}${pad2(parts.day)}`);

  // 모달 최초/재오픈 시 사용할 초기 날짜 기준
  // 우선순위: 기존 반납 예정일 > 대여일 > 오늘
  const initial = useMemo(() => {
    const parsedBase =
      parseDateParts(expectedReturnDueDate) ??
      parseDateParts(rentalDate) ??
      (() => {
        const today = new Date();
        return {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate(),
        };
      })();

    if (!minimumDateParts) return parsedBase;
    return toComparableDateNumber(parsedBase) <
      toComparableDateNumber(minimumDateParts)
      ? minimumDateParts
      : parsedBase;
  }, [expectedReturnDueDate, rentalDate, minimumDateParts]);

  // 캐러셀 선택 상태 (연/월/일)
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);
  // 제출 실패 메시지
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 반납일자 수정 mutation
  const { mutateAsync: updateDueDate, isPending: isSubmitting } =
    useUpdateAdminRentalReturnDueDate();

  // 모달 열릴 때마다 선택 상태/에러를 초기화해서 항상 일관된 UX 제공
  useEffect(() => {
    if (!isOpen) return;
    setYear(initial.year);
    setMonth(initial.month);
    setDay(initial.day);
    setSubmitError(null);
  }, [isOpen, initial.day, initial.month, initial.year]);

  // 월/연 변경으로 현재 day가 유효 범위를 벗어나는 경우 보정
  // 예) 3/31 -> 4월 변경 시 4/30으로 자동 보정
  useEffect(() => {
    const maxDay = daysInMonth(year, month);
    if (day > maxDay) {
      setDay(maxDay);
    }
  }, [year, month, day]);

  // 대여일자 이전으로 내려간 경우 자동으로 최소 허용일(대여일자)로 되돌림
  useEffect(() => {
    if (!minimumDateParts) return;

    const current = toComparableDateNumber({ year, month, day });
    const minimum = toComparableDateNumber(minimumDateParts);
    if (current < minimum) {
      setYear(minimumDateParts.year);
      setMonth(minimumDateParts.month);
      setDay(minimumDateParts.day);
    }
  }, [year, month, day, minimumDateParts]);

  // 선택 월의 마지막 일(일 캐러셀 상/하한 계산에 사용)
  const maxDay = daysInMonth(year, month);
  // API 요청 바디 포맷
  const selectedDateText = `${year}-${pad2(month)}-${pad2(day)}`;

  // rentalId가 있어야 요청 가능, 요청 중에는 재요청 방지
  const canSubmit = Boolean(rentalId) && !isSubmitting;

  // "수정하기" 클릭 처리
  // - 요청 바디: { newReturnDueDate: "YYYY-MM-DD" }
  // - 성공 시 모달 닫기
  // - 실패 시 사용자 안내 메시지 노출
  const handleConfirm = async () => {
    if (!rentalId) {
      setSubmitError(
        "반납일자 수정에 필요한 rentalId가 없어 요청할 수 없습니다.",
      );
      return;
    }

    try {
      setSubmitError(null);
      await updateDueDate({
        rentalId,
        itemId,
        body: { newReturnDueDate: selectedDateText },
      });
      onClose();
    } catch (e) {
      setSubmitError("반납일자 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 각 컬럼 옵션 목록
  const yearOptions = useMemo(
    () =>
      Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MIN + i),
    [],
  );
  const monthOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    [],
  );
  const dayOptions = useMemo(
    () => Array.from({ length: maxDay }, (_, i) => i + 1),
    [maxDay],
  );

  return (
    // Modal의 기본 title 영역은 사용하지 않고, 본문에서 커스텀 타이틀 렌더링
    <Modal isOpen={isOpen} onClose={onClose} showTitle={false}>
      <div className="font-[Pretendard] mt-1">
        {/* 타이틀 */}
        <div className="text-20px font-[600] text-secondary-1 leading-[140%] px-3">
          반납 일자를 수정하시겠어요?
        </div>

        {/* 요약 정보 카드: 대여자/기존 일자 */}
        <div className="w-full bg-secondary-4 rounded-[12px] px-5 pt-4.5 pb-3.75 mt-4.5">
          <div className="text-12px text-neutral-gray-1 font-normal leading-[145%]">
            <p>이름 : {borrowerName ?? "-"}</p>
            {borrowerFields?.additionalProp1 ? (
              <p>학과 : {borrowerFields.additionalProp1}</p>
            ) : null}
            {borrowerFields?.additionalProp2 ? (
              <p>학번 : {borrowerFields.additionalProp2}</p>
            ) : null}
          </div>
          <div className="mt-4 text-secondary-2">
            <div className="flex gap-4 text-12px">
              <p className="font-bold leading-[130%]">대여 일자</p>
              <p className="font-normal leading-[140%]">{rentalDate ?? "-"}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-secondary-2 text-12px px-5.5 mt-5">
          <p className="font-bold leading-[130%]">반납 일자</p>
          <p className="font-normal leading-[140%]">
            {expectedReturnDueDate ?? "-"}
          </p>
        </div>
        {/* 날짜 캐러셀(연/월/일 3열) */}
        <div className="mt-8 px-2">
          <div className="flex justify-around items-center">
            {/* 연도/월/일을 각각 독립된 스크롤 휠로 렌더링 */}
            <DateWheelColumn
              values={yearOptions}
              selectedValue={year}
              onChange={setYear}
              unit="년"
            />
            <DateWheelColumn
              values={monthOptions}
              selectedValue={month}
              onChange={setMonth}
              unit="월"
              formatter={pad2}
            />
            <DateWheelColumn
              values={dayOptions}
              selectedValue={day}
              onChange={setDay}
              unit="일"
              formatter={pad2}
            />
          </div>
        </div>

        {/* 제출 실패 메시지 */}
        {submitError && (
          <p className="text-12px text-[#FF0000] mt-3">{submitError}</p>
        )}

        {/* 확인 버튼 */}
        <div className="mt-7">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!canSubmit}
            onClick={handleConfirm}
          >
            {isSubmitting ? "수정 중..." : "수정하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RentalDateChangeModal;
