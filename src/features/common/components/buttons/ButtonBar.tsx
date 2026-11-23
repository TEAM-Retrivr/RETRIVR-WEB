import { Wrapper } from "./ButtonBar.styles";

type ButtonBarProps = {
  className?: string;
  label: string;
  disabled?: boolean;
  variant?: "primary" | "white";
  size?: number | string;
  onClick?: () => void;
  type?: "button" | "submit";
};

const ButtonBar = ({
  className,
  label,
  disabled = false,
  variant = "primary",
  size = "100%",
  onClick,
  type = "button",
}: ButtonBarProps) => {
  return (
    <Wrapper
      className={className}
      type={type}
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
