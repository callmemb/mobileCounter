import { MenuItem } from "@mui/material";
import { SelectOption } from "../../../../definitions";
import { useFieldContext } from "../context";
import BaseInput, { BaseInputProps } from "./baseInput";

type DataTypeToType<T extends "string" | "number"> = T extends "number"
  ? number
  : string;
type SelectValue<
  T extends "string" | "number",
  M extends boolean,
> = M extends true ? DataTypeToType<T>[] : DataTypeToType<T>;

type SelectInputProps<T extends "string" | "number", M extends boolean> = Omit<
  BaseInputProps,
  "onChange" | "value" | "options" | "multiple"
> & {
  options: SelectOption[];
  value?: SelectValue<T, M>;
  onChange?: (value: SelectValue<T, M>) => void;
  dataType?: T;
  multiple?: M;
};

export default function SelectInput<
  T extends "string" | "number" = "string",
  M extends boolean = false,
>(props: SelectInputProps<T, M>) {
  const { options, multiple, dataType, ...otherProps } = props;

  const {
    handleChange,
    state: {
      value,
      meta: { errors, isTouched },
    },
  } = useFieldContext<DataTypeToType<T>[] | DataTypeToType<T>>();

  const errorMessage = isTouched ? errors.map((e) => e.message).join(",") : "";

  return (
    <BaseInput
      select
      slotProps={{
        select: { multiple },
      }}
      {...otherProps}
      errorMessage={errorMessage}
      // @ts-expect-error - TS too stupid to handle this case.
      value={multiple ? Array.from(value || []) : value}
      onChange={(value: string | string[]) => {
        if (multiple) {
          const converted = (value as string[]).map((v) =>
            dataType === "number" ? +v : v
          ) as SelectValue<T, M>;
          handleChange?.(converted);
        } else {
          const converted = (
            dataType === "number" ? +value : value
          ) as SelectValue<T, M>;
          handleChange?.(converted);
        }
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </BaseInput>
  );
}
