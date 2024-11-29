import { MenuItem } from "@mui/material";
import { SelectOption } from "../../../definitions";
import TextInput, { TextInputProps } from "./textInput";

type DataTypeToType<T extends "string" | "number"> = T extends "number"
  ? number
  : string;
type SelectValue<
  T extends "string" | "number",
  M extends boolean,
> = M extends true ? DataTypeToType<T>[] : DataTypeToType<T>;

type SelectInputProps<T extends "string" | "number", M extends boolean> = Omit<
  TextInputProps,
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
  const { options, value, multiple, onChange, dataType, ...otherProps } = props;
  return (
    <TextInput
      select
      slotProps={{
        select: { multiple },
      }}
      {...otherProps}
      // @ts-expect-error - TS too stupid to handle this case.
      value={multiple ? Array.from(value || []) : value}
      onChange={(value: string | string[]) => {
        if (multiple) {
          const converted = (value as string[]).map((v) =>
            dataType === "number" ? +v : v
          ) as SelectValue<T, M>;
          onChange?.(converted);
        } else {
          const converted = (
            dataType === "number" ? +value : value
          ) as SelectValue<T, M>;
          onChange?.(converted);
        }
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextInput>
  );
}
