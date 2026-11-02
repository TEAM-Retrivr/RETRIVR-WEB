import {
  Wrapper,
  CheckBox,
  DescriptionSection,
  Title,
  Description,
} from "./RentalConsentCard.styles";

type RentalConsentCardProps = {
  description: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
};
const RentalConsentCard = ({
  description,
  checked = false,
  disabled,
  onChange,
}: RentalConsentCardProps) => {
  return (
    <Wrapper $checked={checked}>
      <CheckBox
        type="checkbox"
        aria-label="대여 및 반납 안내를 확인하고 동의합니다."
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <DescriptionSection>
        <Title>대여 및 반납 안내를 확인하고 동의합니다.</Title>
        <Description>{description}</Description>
      </DescriptionSection>
    </Wrapper>
  );
};

export default RentalConsentCard;
