import { useId } from "react";

interface ProgressCircleProps {
  available: number;
  total: number;
}

export const ProgressCircle = ({ available, total }: ProgressCircleProps) => {
  return (
    <div className="relative flex w-13 h-13 rounded-[50%] bg-neutral-gray-3 text-primary justify-center items-center">
      <div className="absolute w-13 h-13 bg-neutral-primary"></div>
      <div className="absoulte w-10 h-10 text-10px text-primary font-[400] bg-neutral-white rounded-[50%]">
        {available}/{total}
      </div>
    </div>
  );
};
