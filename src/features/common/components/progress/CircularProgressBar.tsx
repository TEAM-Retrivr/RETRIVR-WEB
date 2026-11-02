import { Label, Wrapper, Track, Progress } from "./CircularProgressBar.styles";

type CircularProgressBarProps = {
  available: number;
  total: number;
  isActive?: boolean;
};

const CircularProgressBar = ({
  available,
  total,
  isActive = true,
}: CircularProgressBarProps) => {
  const safeAvailable = Number.isFinite(available) ? Math.max(0, available) : 0;
  const safeTotal = Number.isFinite(total) ? Math.max(0, total) : 0;
  const ratio =
    isActive && safeTotal > 0 ? Math.min(1, safeAvailable / safeTotal) : 0;

  return (
    <Wrapper
      role="img"
      aria-label={`전체 ${safeTotal}개 중 ${safeAvailable}개 대여 가능`}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <Track cx="28" cy="28" r="25" />
        {ratio > 0 && (
          <Progress
            cx="28"
            cy="28"
            r="25"
            pathLength="100"
            $ratio={ratio}
            transform="rotate(-90 28 28)"
          />
        )}
      </svg>
      <Label aria-hidden="true">
        {ratio > 0 ? <strong>{safeAvailable}</strong> : safeAvailable}/
        {safeTotal}
      </Label>
    </Wrapper>
  );
};

export default CircularProgressBar;
