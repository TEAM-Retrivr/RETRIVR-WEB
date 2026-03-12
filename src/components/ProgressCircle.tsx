interface ProgressCircleProps {
  available: number;
  total: number;
}

export const ProgressCircle = ({ available, total }: ProgressCircleProps) => {
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
    <div className="relative w-13 h-13">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
      >
        <defs>
          <linearGradient
            id="progress-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="var(--color-grad-blue)" />
            <stop offset="100%" stopColor="var(--color-neutral-gray-5)" />
          </linearGradient>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={String(-circumference * (1 - ratio))}
          // 12시 방향에서 시작, 시계 방향으로 진행
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-[stroke-dashoffset] duration-300 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-primary text-10px font-[600]">
        {available}/{total}
      </div>
    </div>
  );
};
