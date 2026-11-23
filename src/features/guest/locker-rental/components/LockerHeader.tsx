import styled from "@emotion/styled";
import { TitleHeader } from "../../../common/components/header/TitleHeader";

const Header = styled(TitleHeader)<{ $subtitle: boolean }>`
  height: ${({ $subtitle }) => ($subtitle ? "64px" : "58px")};
  min-height: ${({ $subtitle }) => ($subtitle ? "64px" : "58px")};
  align-items: center;
  padding: ${({ $subtitle }) =>
    $subtitle ? "12px 52px 8px 16px" : "16px 52px 16px 16px"};
  button {
    display: flex;
    align-items: center;
  }
`;

export const LockerHeader = ({
  placeName,
  request = false,
  onBack,
}: {
  placeName: string;
  request?: boolean;
  onBack: () => void;
}) => (
  <Header
    $subtitle={request}
    placeName={request ? placeName : undefined}
    pageName={request ? "사물함 대여" : placeName}
    onClick={onBack}
  />
);
