import TextInput, { TextInputProps } from "./textInput";

type NumberInputProps = Omit<TextInputProps, "onChange" | "value"> & {
  value?: number | undefined | null;
  onChange?: (value: number) => void;
};

export default function NumberInput(props: NumberInputProps) {
  const { value, onChange, ...otherProps } = props;

  return (
    <TextInput
      type="number"
      {...otherProps}
      value={!value && value !== 0 ? "" : "" + value}
      onChange={(value) => {
        const parsedValue = value === "" ? null : +value;
        // hack allowing to clear the input
        // Remember to validate the input value
        onChange?.(parsedValue as number);
      }}
    />
  );
}
