import { createFileRoute } from "@tanstack/react-router";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { BaseTextFieldProps } from "@mui/material";
import BaseInput from "../../components/form/components/baseInput";

const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

export type TextInputProps = Omit<BaseTextFieldProps, "value" | "onChange"> & {
  label: string;
  errorMessage?: string;
  popupErrors?: boolean;
};

export default function TextInput(props: TextInputProps) {
  const {
    handleChange,
    state: {
      value,
      meta: { errors, isTouched },
    },
  } = useFieldContext<string>();

  const errorMessage = isTouched ? errors.map((e) => e.message).join(",") : "";

  return (
    <BaseInput
      value={value}
      onChange={handleChange}
      errorMessage={errorMessage}
      {...props}
    />
  );
}


const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput,
  },
  formComponents: {},
});

export const Route = createFileRoute("/test/2")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useAppForm({
    defaultValues: { text: "test" },
    onSubmit: console.log,
  });

  return (
    <FormPageTemplate label={"text"} form={form}>
      <form.AppField
        name="text"
        children={(f) => <f.TextInput label="Label" />}
      />
    </FormPageTemplate>
  );
}



const FormPageTemplate = withForm({
  defaultValues: {
    text: "",
  },
  props: {
    label: "",
  },
  render: function Render(props) {
    const { form, label, children } = props;
    return (
      <div>
        <h1>{label}</h1>
        {children}
        <form.Subscribe
          key="submit"
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              id={"submit"}
              disabled={!canSubmit}
              onClick={() => form.handleSubmit()}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </form.Subscribe>
      </div>
    );
  },
});
