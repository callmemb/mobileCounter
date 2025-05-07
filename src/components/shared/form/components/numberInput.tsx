import { useFieldContext } from "../context";
import BaseInput, { BaseInputProps } from "./baseInput";

type NumberInputProps = Omit<BaseInputProps, "onChange" | "value"> & {};

export default function NumberInput(props: NumberInputProps) {
  const {
    handleChange,
    state: {
      value,
      meta: { errors, isTouched },
    },
  } = useFieldContext<number>();

  const errorMessage = isTouched ? errors.map((e) => e.message).join(",") : "";

  return (
    <BaseInput
      type="number"
      {...props}
      value={!value && value !== 0 ? "" : "" + value}
      onChange={(value) => {
        const parsedValue = value === "" ? null : +value;
        handleChange?.(parsedValue as number);
      }}
      errorMessage={errorMessage}
    />
  );
}
