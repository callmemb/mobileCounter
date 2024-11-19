import React from "react";
import { MenuItem, TextField } from "@mui/material";
import { SelectOption } from "../../definitions";

interface Props extends React.ComponentProps<typeof TextField> {
  label: string;
  errorMessage?: string;
  options: SelectOption[];
}

/**
 * This fucker is still bugging out on controlled/uncontrolled input
 *   and reset form.
 * 
 */
const TextInput = React.forwardRef<HTMLDivElement, Props>(
  ({ label, errorMessage, options, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        select
        label={label}
        error={!!errorMessage}
        helperText={errorMessage}
        variant="outlined"
        fullWidth
        sx={{ my: 1 }}
        defaultValue={""}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }
);

export default TextInput;
