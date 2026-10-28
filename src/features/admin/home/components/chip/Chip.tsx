import { useNavigate } from "react-router-dom";
import { ChipButton, ChipTitle, ChipCount, ChipNoCount } from "./Chip.styles";

type ChipProps = {
  title: string;
  count: number;
  onClick?: () => void;
};

const Chip = ({ title, count, onClick }: ChipProps) => {
  const navigate = useNavigate();
  return (
    <ChipButton onClick={() => navigate("")}>
      <ChipTitle>{title}</ChipTitle>
      {count ? (
        <ChipCount>{count}</ChipCount>
      ) : (
        <ChipNoCount>{count}</ChipNoCount>
      )}
    </ChipButton>
  );
};

export default Chip;
