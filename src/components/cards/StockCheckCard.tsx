import React from "react";
import { ProgressCircle } from "../ProgressCircle";

interface CardProps {
  status: "available" | "inavailable";
}
const StockCheckCard = ({ status }: CardProps) => {
  const baseBoxStyle =
    "flex justify-between items-center w-84.5 h-22.5 font-[Pretendard] rounded-[16px] shadow-item-card cursor-pointer box-border pl-7 pr-7.5 py-4";
  const availableBoxStyle = "bg-neutral-white ";
  const inavailableBoxStyle = "bg-[#F8F9F9]";

  const baseTextStyle = "text-20px font-[600] leading-[140%]";
  const availableTextStyle = "text-neutral-gray-1 ";
  const inavailableTextStyle = "text-neutral-gray-3";
  return (
    <div
      className={`${baseBoxStyle} ${
        status === "available" ? availableBoxStyle : inavailableBoxStyle
      }`}
    >
      <p
        className={`${baseTextStyle} ${
          status === "available" ? availableTextStyle : inavailableTextStyle
        }`}
      >
        c타입 충전기
      </p>
      <ProgressCircle available={3} total={5}></ProgressCircle>
    </div>
  );
};

export default StockCheckCard;
