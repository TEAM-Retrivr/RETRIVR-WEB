import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import {
  Field,
  FieldHeader,
  FieldLabel,
  RequiredMark,
  Hint,
  Control,
  Input,
  Textarea,
  Adornment,
} from "./TextField.styles";

type SharedProps = {
  label: string;
  hideLabel?: boolean;
  hint?: ReactNode;
  trailingAction?: ReactNode;
};

type TextFieldProps = SharedProps &
  (
    | ({ multiline?: false } & Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "children"
      >)
    | ({ multiline: true; trailingAction?: never } & Omit<
        TextareaHTMLAttributes<HTMLTextAreaElement>,
        "children"
      >)
  );

const TextField = ({
  label,
  hideLabel = false,
  hint,
  trailingAction,
  multiline = false,
  id,
  required,
  className,
  ...controlProps
}: TextFieldProps) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint != null ? `${fieldId}-hint` : undefined;
  const describedBy =
    [controlProps["aria-describedby"], hintId].filter(Boolean).join(" ") ||
    undefined;

  return (
    <Field className={className}>
      <FieldHeader $hidden={hideLabel}>
        <FieldLabel htmlFor={fieldId}>
          {label}
          {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
        </FieldLabel>
        {hint != null && <Hint id={hintId}>{hint}</Hint>}
      </FieldHeader>
      <Control>
        {multiline ? (
          <Textarea
            {...(controlProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            id={fieldId}
            required={required}
            aria-describedby={describedBy}
          />
        ) : (
          <Input
            {...(controlProps as InputHTMLAttributes<HTMLInputElement>)}
            id={fieldId}
            required={required}
            aria-describedby={describedBy}
          />
        )}
        {trailingAction && <Adornment>{trailingAction}</Adornment>}
      </Control>
    </Field>
  );
};

export default TextField;
