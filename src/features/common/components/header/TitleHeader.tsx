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
  placeName?: string;
  pageName: string;
  onClick?: () => void;
};

export const TitleHeader = ({ placeName, pageName }: TitleHeaderProps) => {
  return (
    <HeaderWrapper>
      <IconSlot>
        <Icon src={LeftChevronIcon} alt="" />
      </IconSlot>
      <InformationSection>
        <PlaceName>{placeName}</PlaceName>
        <PageName>{pageName}</PageName>
      </InformationSection>
    </HeaderWrapper>
  );
};
