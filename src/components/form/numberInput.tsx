import React from "react";
import TextField from "@mui/material/TextField";

interface Props extends React.ComponentProps<typeof TextField> {
  label: string;
  errorMessage?: string;
}

const NumberInput = React.forwardRef<HTMLDivElement, Props>(
  ({ label, errorMessage, ...props }, ref) => {
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
        {...props}
      />
    );
  }
);

export default NumberInput;
