import {
  HeaderWrapper,
  IconSlot,
  Icon,
  InformationSection,
  PlaceName,
  PageName,
} from "./TitleHeader.styles";
import LeftChevronIcon from "./left-chevron.svg";
type TitleHeaderProps = {
  className?: string;
  placeName?: string;
  pageName: string;
  onClick?: () => void;
};

export const TitleHeader = ({
  className,
  placeName,
  pageName,
  onClick,
}: TitleHeaderProps) => {
  return (
    <HeaderWrapper className={className}>
      <IconSlot type="button" aria-label="뒤로 가기" onClick={onClick}>
        <Icon src={LeftChevronIcon} alt="" />
      </IconSlot>
      <InformationSection>
        {placeName && <PlaceName>{placeName}</PlaceName>}
        <PageName>{pageName}</PageName>
      </InformationSection>
    </HeaderWrapper>
  );
};
