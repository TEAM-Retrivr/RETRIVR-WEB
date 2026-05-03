export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_ALLOWED_SPECIALS = "!@#$%^&*";
export const PASSWORD_ALLOWED_PATTERN = /^[A-Za-z0-9!@#$%^&*]+$/;
export const PASSWORD_LETTER_PATTERN = /[A-Za-z]/;
export const PASSWORD_NUMBER_PATTERN = /\d/;
export const PASSWORD_SPECIAL_PATTERN = /[!@#$%^&*]/;

export const getPasswordValidationError = (
  password: string,
): string | null => {
  if (!password) return "비밀번호를 입력해주세요.";
  if (password.length < PASSWORD_MIN_LENGTH) {
    return "비밀번호는 8자 이상이어야 합니다.";
  }
  if (!PASSWORD_LETTER_PATTERN.test(password)) {
    return "비밀번호에 영문자(대문자 또는 소문자)를 최소 1개 이상 포함해주세요.";
  }
  if (!PASSWORD_NUMBER_PATTERN.test(password)) {
    return "비밀번호에 숫자를 최소 1개 이상 포함해주세요.";
  }
  if (!PASSWORD_SPECIAL_PATTERN.test(password)) {
    return `비밀번호에 특수문자를 최소 1개 이상 포함해주세요. (${PASSWORD_ALLOWED_SPECIALS})`;
  }
  if (!PASSWORD_ALLOWED_PATTERN.test(password)) {
    return `비밀번호는 영문자(대문자/소문자), 숫자, 특수문자 ${PASSWORD_ALLOWED_SPECIALS}만 사용할 수 있습니다.`;
  }
  return null;
};
