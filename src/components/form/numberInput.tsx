import React from "react";
import TextField from "@mui/material/TextField";

interface Props extends React.ComponentProps<typeof TextField> {
  label: string;
  errorMessage?: string;
  min?: number;
  max?: number;
  step?: number;
}

const NumberInput = React.forwardRef<HTMLDivElement, Props>(
  ({ label, errorMessage, min, max, step,...props }, ref) => {
    return (
      <TextField
        ref={ref}
        type="number"
        label={label}
        error={!!errorMessage}
        helperText={errorMessage}
        variant="outlined"
        fullWidth
        sx={{ my: 1 }}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          htmlInput: {
            min,
            max,
            step,
          },
        }}
        {...props}
      />
    );
  }
);

export default NumberInput;
