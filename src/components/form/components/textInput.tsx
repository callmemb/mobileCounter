import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Tooltip } from "@mui/material";

export type TextInputProps = Omit<TextFieldProps, "value" | "onChange"> & {
  errorMessage?: string;
  popupErrors?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

export default function TextInput(props: TextInputProps) {
  const {
    value = "",
    onChange,
    errorMessage,
    popupErrors,
    ...otherProps
  } = props;
  return (
    <Tooltip
      title={errorMessage}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      open={popupErrors && !!errorMessage}
    >
      <TextField
        error={!!errorMessage}
        helperText={popupErrors ? "" : errorMessage}
        variant="outlined"
        fullWidth
        sx={{ my: 1, ...props.sx }}
        {...otherProps}
        value={value}
        onChange={(e) => {
          onChange?.(e?.target?.value || "");
        }}
      />
    </Tooltip>
  );
}
