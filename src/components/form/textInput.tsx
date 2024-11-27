import React from "react";
import TextField from "@mui/material/TextField";

export interface TextInputProps extends React.ComponentProps<typeof TextField> {
  label: string;
  placeholder?: string;
  errorMessage?: string;
}

const TextInput = React.forwardRef<HTMLDivElement, TextInputProps>(
  ({ label, errorMessage, placeholder, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        label={label}
        error={!!errorMessage}
        helperText={errorMessage}
        variant="outlined"
        fullWidth
        sx={{ my: 1 }}
        placeholder={placeholder}
        slotProps={{
          ...props.slotProps,
          inputLabel: {
            shrink: true,
          },
        }}
        {...props}
      />
    );
  }
);

export default TextInput;
