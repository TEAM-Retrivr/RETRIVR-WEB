import {
  Wrapper,
  ItemInformationSection,
  ItemName,
  ItemDescription,
  Border,
  RentalInformationSection,
  LabelSection,
  Label,
  Key,
  KeyWrapper,
  DurationRange,
} from "./InformationCard.styles";

type InformationCardProps = {
  itemLabel: { name: string; description?: string };
  informationLabel: {
    item: string;
    duration: { day: number; range: string };
    guaranteedGoods: string;
  };
};

const InformationCard = ({
  itemLabel,
  informationLabel,
}: InformationCardProps) => {
  return (
    <Wrapper>
      <ItemInformationSection>
        <ItemName>{itemLabel.name}</ItemName>
        <ItemDescription>{itemLabel.description}</ItemDescription>
      </ItemInformationSection>
      <Border />
      <RentalInformationSection>
        <LabelSection>
          <Label>대여 물품</Label>
          <Key>{informationLabel.item}</Key>
        </LabelSection>
        <LabelSection>
          <Label>대여 기간</Label>
          <KeyWrapper>
            <Key>{informationLabel.duration.day}일</Key>
            <DurationRange>{informationLabel.duration.range}</DurationRange>
          </KeyWrapper>
        </LabelSection>
        <LabelSection>
          <Label>담보 물품</Label>
          <Key>{informationLabel.guaranteedGoods}</Key>
        </LabelSection>
      </RentalInformationSection>
    </Wrapper>
  );
};

export default InformationCard;
