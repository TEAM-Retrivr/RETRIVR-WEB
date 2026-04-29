import { useId } from "react";

interface ProgressCircleProps {
  available: number;
  total: number;
  isActive: boolean;
}

export const ProgressCircle = ({
  available,
  total,
  isActive,
}: ProgressCircleProps) => {
  const gradientId = useId();
  // NaN 방지용: available/total이 undefined, 0, 비수치인 경우를 안전하게 처리
  const safeAvailable =
    typeof available === "number" && Number.isFinite(available) ? available : 0;
  const safeTotal =
    typeof total === "number" && Number.isFinite(total) && total > 0
      ? total
      : 1;
  // 실제 비율 (0 ~ 1 사이로 클램프)
  const rawRatio = safeAvailable / safeTotal;
  const ratio = Number.isFinite(rawRatio)
    ? Math.max(0, Math.min(rawRatio, 1))
    : 0;
  // SVG 원형 진행바 공통 값
  const size = 52;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div
      className="relative w-13 h-13"
      style={{
        filter: isActive
          ? "var(--drop-shadow-progress-circle-on)"
          : "var(--drop-shadow-progress-circle-off)",
      }}
    >
      {/* 이미지에서 보이는 ‘원형 링(테두리)’ 전체를 그리는 SVG 캔버스 */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
      >
        <defs>
          {/* 진행 링에 쓰는 그라데이션(파랑 -> 회색) 정의 */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-grad-blue)" />
            <stop offset="100%" stopColor="var(--color-neutral-gray-5)" />
          </linearGradient>
        </defs>

        {/* (1) 바깥쪽 ‘배경 링’(흰색): 이미지에서 파란 링 뒤에 깔려 있는 흰색 원 테두리 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="#FFF"
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
        />

        {/* (2) 실제 ‘진행 링’(그라데이션): 파란색으로 채워져 보이는 원형 테두리 */}
        {/* - strokeDasharray: 원 둘레 길이 기준으로 dash를 설정 */}
        {/* - strokeDashoffset: ratio(0~1)에 따라 ‘안 보이는 구간’을 조절해 진행률을 표현 */}
        {/* - transform rotate(-90 ...): 시작점을 3시→12시 방향으로 옮김 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="#FFF"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={String(-circumference * (1 - ratio))}
          // 12시 방향에서 시작, 시계 방향으로 진행
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-[stroke-dashoffset] duration-300 ease-out"
        />
      </svg>

      {/* 이미지 중앙의 “2/2” 텍스트: SVG 위에 absolute로 덮어씌운 레이어 */}
      <div
        className={
          isActive
            ? "absolute inset-0 flex items-center justify-center text-primary text-10px font-[600]"
            : "absolute inset-0 flex items-center justify-center text-neutral-gray-3 text-10px font-[600]"
        }
      >
        {available}/{total}
      </div>
    </div>
  );
};
