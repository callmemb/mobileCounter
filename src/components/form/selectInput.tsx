import React from "react";
import { MenuItem, TextField } from "@mui/material";
import { SelectOption } from "../../definitions";

interface Props extends React.ComponentProps<typeof TextField> {
  label: string;
  errorMessage?: string;
  options: SelectOption[];
  value?: string | number | (string | number)[];
  multiple?: boolean;
}

const SelectInput = React.forwardRef<HTMLDivElement, Props>(
  ({ label, errorMessage, options, value, multiple, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        select
        label={label}
        error={!!errorMessage}
        helperText={errorMessage}
        variant="outlined"
        fullWidth
        value={value || []}
        sx={{ my: 1 }}
        slotProps={{
          ...props.slotProps,
          inputLabel: {
            shrink: true,
          },
          select: { multiple },
        }}
        {...props}
      >
        {value ? null : (
          <MenuItem value="" disabled>
            <em>None</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }
);

export default SelectInput;
