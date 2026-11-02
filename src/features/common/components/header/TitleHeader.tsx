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
  pageName?: string;
  onClick?: () => void;
};

export const TitleHeader = ({
  placeName,
  pageName,
  onClick,
}: TitleHeaderProps) => {
  return (
    <HeaderWrapper>
      <IconSlot type="button" aria-label="뒤로가기" onClick={onClick}>
        <Icon src={LeftChevronIcon} alt="" />
      </IconSlot>
      <InformationSection>
        {pageName ? (
          <>
            {placeName && <PlaceName>{placeName}</PlaceName>}
            <PageName>{pageName}</PageName>
          </>
        ) : (
          <PageName>{placeName}</PageName>
        )}
      </InformationSection>
    </HeaderWrapper>
  );
};
