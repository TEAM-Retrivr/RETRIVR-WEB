import CommonInput from "../CommonInput";

type Variant = "register" | "profileEdit";

type AdminAccountCommonFieldsProps = {
  variant: Variant;
  includeOrganizationName?: boolean;
  organizationName: string;
  onOrganizationNameChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  passwordCheck: string;
  onPasswordCheckChange: (value: string) => void;
  adminCode: string;
  onAdminCodeChange: (value: string) => void;
};

const AdminAccountCommonFields = ({
  variant,
  includeOrganizationName = true,
  organizationName,
  onOrganizationNameChange,
  password,
  onPasswordChange,
  passwordCheck,
  onPasswordCheckChange,
  adminCode,
  onAdminCodeChange,
}: AdminAccountCommonFieldsProps) => {
  const isRegister = variant === "register";

  return (
    <>
      {includeOrganizationName && (
        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="inline text-[0.875rem] font-bold leading-none">
              이름(단체명)
            </p>
            <p className="inline text-primary">*</p>
          </div>
          {isRegister && (
            <p className="text-neutral-3 text-[0.75rem] font-normal leading-none">
              공식 명칭을 사용해주세요. ex)리턴즈(X), 00학생회(O)
            </p>
          )}
          <CommonInput
            type="text"
            value={organizationName}
            onChange={(e) => onOrganizationNameChange(e.target.value)}
            placeholder={
              isRegister ? "한국대 학생회" : "한국대 도서관자치위원회"
            }
            className={
              isRegister
                ? undefined
                : "placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
            }
          />
        </div>
      )}

      {/* 비밀번호 영역 */}
      <div
        className={`flex flex-col w-full ${isRegister ? "gap-2" : "gap-1.5"}`}
      >
        <div className="flex gap-0.5">
          <p className="text-14px font-bold">비밀번호</p>
          <p className="text-14px text-primary font-bold">*</p>
        </div>
        {!isRegister && (
          <p className="pb-1 text-neutral-gray-3 text-12px font-normal leading-[130%]">
            영문자(대문자/소문자), 숫자, 특수문자를 포함한 8자 이상으로
            설정해주세요. 특수문자는 !@#$%^&*만 사용할 수 있어요.
          </p>
        )}
        <CommonInput
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          type="password"
          placeholder="비밀번호 입력"
          className={
            isRegister
              ? undefined
              : "placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
          }
        />
      </div>

      {/* 비밀번호 확인 영역 */}
      <div
        className={`flex flex-col w-full ${isRegister ? "gap-2" : "gap-2.5"}`}
      >
        <div className="flex gap-0.5">
          <p className="text-14px font-bold">비밀번호 확인</p>
          <p className="text-14px text-primary">*</p>
        </div>
        <CommonInput
          value={passwordCheck}
          onChange={(e) => onPasswordCheckChange(e.target.value)}
          type="password"
          placeholder="비밀번호 재입력"
          className={
            isRegister
              ? undefined
              : "placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
          }
        />
      </div>

      {/* 관리자 코드 영역 */}
      <div
        className={`flex flex-col w-full ${isRegister ? "gap-2" : "gap-1.5"}`}
      >
        <div className="flex gap-0.5">
          <p className="text-14px font-bold">관리자 코드</p>
          <p className="text-14px text-primary">*</p>
        </div>
        <p
          className={
            isRegister
              ? "text-neutral-3 text-[0.75rem] font-normal leading-none"
              : "pb-1 text-neutral-gray-3 text-12px font-normal leading-[140%]"
          }
        >
          물품 관리 등 중요할 때 쓰이는 코드로, 숫자만 입력 가능해요.
        </p>
        <CommonInput
          value={adminCode}
          onChange={(e) => onAdminCodeChange(e.target.value)}
          placeholder={isRegister ? "010101" : "관리자 코드 입력"}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          className={
            isRegister
              ? undefined
              : "placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
          }
        />
      </div>
    </>
  );
};

export default AdminAccountCommonFields;
