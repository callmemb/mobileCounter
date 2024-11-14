import { TextField } from "@mui/material";
import "./form.css";
import {} from "react";
import { FormApi, ReactFormApi } from "@tanstack/react-form";

import { ZodString } from "zod";

export default function () {
  return "TODO";
}



export function TextInput({
  name,
  form,
  validator,
}: {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: FormApi<any, undefined> & ReactFormApi<any, undefined>;
  validator: ZodString;
}) {
  return (
    <form.Field
      name={name}
      validators={{
        onChangeAsyncDebounceMs: 200,
        onChangeAsync: async ({ value }) => {
          const v = validator.safeParse(value);
          return v.success
            ? undefined
            : v.error.issues.map((i) => i.message).join(", ");
        },
      }}
      children={(field) => {
        const error =
          field.state.meta.isTouched && field.state.meta.errors.length > 0
            ? field.state.meta.errors.join(", ")
            : null;
        return (
          <TextField
            variant="outlined"
            fullWidth={true}
            label={field.name}
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            helperText={error}
            error={!!error}
          />
        );
      }}
    />
  );
}
