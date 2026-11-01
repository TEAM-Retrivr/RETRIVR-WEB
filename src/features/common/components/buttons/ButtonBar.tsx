import { Wrapper } from "./ButtonBar.styles";

type ButtonBarProps = {
  label: string;
  disabled?: boolean;
  variant?: "primary" | "white";
  size?: number | string;
  onClick: () => void;
};

const ButtonBar = ({
  label,
  disabled = false,
  variant = "primary",
  size = "100%",
  onClick,
}: ButtonBarProps) => {
  return (
    <Wrapper
      type="button"
      $variant={variant}
      $size={size}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </Wrapper>
  );
};

export default ButtonBar;
