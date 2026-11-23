import styled from "@emotion/styled";
import { IconHeader } from "../../../common/components/header/IconHeader";
import ButtonBar from "../../../common/components/buttons/ButtonBar";
import { theme } from "../../../common/styles/theme";
import bubble from "../assets/request-bubble.svg";
import mascot from "../assets/request-mascot.svg";
import { LockerLayout } from "../components/LockerLayout";
import type { VerificationMethod } from "../../rent/submit/hooks/useRentalVerification";
import type { LockerRentalStatus } from "../../rental-home/api/locker.types";

const Scene = styled.section`
  position: relative;
  height: 465px;
  overflow: hidden;
  background: ${theme.colors.gray[50]};
  text-align: center;
  h1 {
    margin: 112px 0 20px;
    color: ${theme.colors.sky[500]};
    ${theme.typography.heading1};
  }
`;
const Bubble = styled.div`
  position: relative;
  width: 274px;
  height: 96.113px;
  margin: 0 auto;
  img {
    display: block;
  }
  p {
    position: absolute;
    inset: 14px 0 auto;
    margin: 0;
    color: ${theme.colors.gray[700]};
    ${theme.typography.label1};
  }
`;
const Mascot = styled.div`
  position: absolute;
  top: 282px;
  left: calc(50% - 97px);
  width: 195px;
  height: 221px;
  img {
    position: absolute;
    top: -24.32%;
    left: -35.09%;
    width: 168.36%;
    height: 159.75%;
    max-width: none;
  }
`;
const Instructions = styled.div`
  flex: 1;
  padding: 94px 20px 20px;
  text-align: center;
  p {
    margin: 0 0 20px;
    color: ${theme.colors.sky[500]};
    ${theme.typography.body1};
  }
  button {
    max-width: 315px;
    margin: 0 auto;
    font-weight: ${theme.fontWeight.semibold};
  }
`;

export const LockerRequestPendingPage = ({
  onApprove,
  onHome,
  status = "REQUESTED",
  verificationMethod = "phone",
}: {
  onApprove?: () => void;
  onHome?: () => void;
  status?: LockerRentalStatus;
  verificationMethod?: VerificationMethod;
}) => (
  <LockerLayout scrollable>
    <IconHeader />
    <Scene aria-labelledby="locker-request-pending">
      <h1 id="locker-request-pending">
        {
          {
            REQUESTED: "대여 요청 중",
            APPROVED: "대여 승인 완료",
            REJECTED: "대여 요청 거절",
            RETURNED: "반납 완료",
          }[status]
        }
      </h1>
      <Bubble>
        <img src={bubble} alt="" width={274} height={96.113} />
        <p>
          {status === "REQUESTED" ? (
            <>
              관리자 확인 후<br />
              {verificationMethod === "phone" ? "카카오톡" : "이메일"}으로
              연락드릴게요!
            </>
          ) : status === "APPROVED" ? (
            <>
              대여가 승인되었어요
              <br />
              사물함을 이용해주세요
            </>
          ) : status === "REJECTED" ? (
            <>
              대여가 승인되지 않았어요
              <br />
              관리자에게 문의해주세요
            </>
          ) : (
            <>
              반납이 완료되었어요
              <br />
              이용해주셔서 감사합니다
            </>
          )}
        </p>
      </Bubble>
      <Mascot>
        <img src={mascot} alt="" />
      </Mascot>
    </Scene>
    <Instructions>
      {status === "REQUESTED" && (
        <p>
          현장 이용 중이라면 홈으로 돌아가지 말고,
          <br />
          관리자에게 화면을 보여주세요
        </p>
      )}
      <ButtonBar
        label={
          status === "REQUESTED" ? "현장 승인 (관리자 전용)" : "대여 홈으로"
        }
        disabled={status === "REQUESTED" ? !onApprove : !onHome}
        onClick={status === "REQUESTED" ? onApprove : onHome}
      />
    </Instructions>
  </LockerLayout>
);
