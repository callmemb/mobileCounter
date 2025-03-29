import { TextFieldProps } from "@mui/material/TextField";
import { useFieldContext } from "../context";
import BaseInput from "./baseInput";

export type TextInputProps = Omit<TextFieldProps, "value" | "onChange"> & {
  label: string;
  errorMessage?: string;
  popupErrors?: boolean;
};

export default function TextInput(props: TextInputProps) {
  const {
    handleChange,
    state: {
      value,
      meta: { errors, isTouched },
    },
  } = useFieldContext<string>();

  const errorMessage = isTouched ? errors.map((e) => e.message).join(",") : "";

  return (
    <BaseInput
      value={value}
      onChange={handleChange}
      errorMessage={errorMessage}
      {...props}
    />
  );
}
