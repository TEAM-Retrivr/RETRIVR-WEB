import styled from "@emotion/styled";
import { LockerHeader } from "../../locker-rental/components/LockerHeader";
import { LockerLayout } from "../../locker-rental/components/LockerLayout";
import { theme } from "../../../common/styles/theme";

const Message = styled.div`
  padding: 48px 20px;
  text-align: center;
  color: ${theme.colors.gray[700]};
  ${theme.typography.body1};
  button {
    display: block;
    margin: 16px auto 0;
    color: ${theme.colors.sky[700]};
    cursor: pointer;
  }
`;
export const LockerFeedback = ({
  message,
  onBack,
  onRetry,
}: {
  message: string;
  onBack: () => void;
  onRetry?: () => void;
}) => (
  <LockerLayout>
    <LockerHeader placeName="사물함 대여" onBack={onBack} />
    <Message role={onRetry ? "alert" : "status"}>
      {message}
      {onRetry && (
        <button type="button" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </Message>
  </LockerLayout>
);
