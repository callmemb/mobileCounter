import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  return (
    <label>
      <div>{label}</div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </label>
  );
}

function AwesomeFormWrapper({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const form = useFormContext();
  return (
    <div>
      <p>{title}</p>
      {children}
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => <button disabled={isSubmitting}>submit</button>}
      </form.Subscribe>
    </div>
  );
}

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    AwesomeFormWrapper
  },
  fieldContext,
  formContext,
});

export const App = () => {
  const form = useAppForm({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
    },
  });
  const form2 = useAppForm({
    defaultValues: {
      anotherField: "field2",
    },
  });

  return (
    <>
      <form.AppForm>
        <form.AwesomeFormWrapper title="Form 1">
          <form.AppField name="firstName">
            {(f) => <f.TextField label="First Name" />}
          </form.AppField>
          <form.AppField name="lastName">
            {(f) => <f.TextField label="Last Name" />}
          </form.AppField>
        </form.AwesomeFormWrapper>
      </form.AppForm>

      <form2.AppForm>
        <form2.AwesomeFormWrapper title="Form 2">
          <form2.AppField name="anotherField">
            {(f) => <f.TextField label="Another Field" />}
          </form2.AppField>
        </form2.AwesomeFormWrapper>
      </form2.AppForm>
    </>
  );
};
