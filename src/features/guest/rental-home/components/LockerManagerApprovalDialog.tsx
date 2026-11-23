import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import TextField from "../../../common/components/form/TextField";
import ButtonBar from "../../../common/components/buttons/ButtonBar";
import { theme } from "../../../common/styles/theme";
import type { LockerManagerApproval } from "../api/approval.api";
import { lockerErrorMessage } from "../model/locker.errors";

const Dialog = styled.dialog`
  width: min(350px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  margin: auto;
  padding: 24px 20px;
  overflow: auto;
  border: 0;
  border-radius: 20px;
  background: ${theme.colors.gray[0]};
  color: ${theme.colors.gray[900]};
  font-family: ${theme.fontFamily.primary};
  &::backdrop {
    background: rgb(57 65 74 / 40%);
  }
  h2 {
    margin: 0;
    ${theme.typography.heading2};
  }
  p {
    margin: 8px 0 20px;
    color: ${theme.colors.gray[700]};
    ${theme.typography.body2};
  }
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 0;
    padding: 0;
    margin: 0;
    min-width: 0;
  }
`;
const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
  & > button {
    flex: 1;
  }
`;
const ErrorMessage = styled.div`
  margin-top: 16px;
  color: ${theme.colors.red};
  ${theme.typography.body2};
`;

export const LockerManagerApprovalDialog = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (
    input: Omit<LockerManagerApproval, "organizationId">,
  ) => Promise<void>;
}) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const lock = useRef(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [managerName, setManagerName] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  const valid =
    email.trim() && password && managerName.trim() && /^\d{6}$/.test(adminCode);
  return (
    <Dialog
      ref={dialog}
      aria-labelledby="locker-approval-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!lock.current) onClose();
      }}
    >
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!valid || lock.current) return;
          lock.current = true;
          setBusy(true);
          setError("");
          try {
            await onSubmit({ email, password, managerName, adminCode });
          } catch (cause) {
            setError(
              lockerErrorMessage(
                cause,
                "현장 승인에 실패했습니다. 관리자 정보를 확인해주세요.",
              ),
            );
          } finally {
            lock.current = false;
            setBusy(false);
            setPassword("");
          }
        }}
      >
        <h2 id="locker-approval-title">현장 승인</h2>
        <p>대여지 관리자 계정과 관리자 코드를 확인합니다.</p>
        <fieldset disabled={busy}>
          <TextField
            label="관리자 이메일"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="비밀번호"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <TextField
            label="담당자 이름"
            autoComplete="name"
            maxLength={100}
            required
            value={managerName}
            onChange={(event) => setManagerName(event.target.value)}
          />
          <TextField
            label="관리자 코드"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={6}
            required
            value={adminCode}
            onChange={(event) =>
              setAdminCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />
        </fieldset>
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        <Actions>
          <ButtonBar
            label="취소"
            variant="white"
            disabled={busy}
            onClick={onClose}
          />
          <ButtonBar
            label={busy ? "확인 중" : "승인하기"}
            type="submit"
            disabled={!valid || busy}
          />
        </Actions>
      </form>
    </Dialog>
  );
};
