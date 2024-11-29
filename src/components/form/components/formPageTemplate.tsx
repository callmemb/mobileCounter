import PageTemplate from "../../pageTemplate/component";
import ShortcutButton from "../../pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft, CheckCircleOutline, Restore } from "@mui/icons-material";
import { useRef } from "react";
import StackLayoutForFields from "./stackLayoutForFields";
import { useNavigate } from "@tanstack/react-router";
import { ZodType } from "zod";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import TextInput from "./textInput";

type FormPageTemplateProps<T> = {
  label?: string;
  defaultValues?: Partial<T>;
  validator: ZodType<T>;
  onSubmit: (data: T) => void;
  children: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FormPageTemplate<T extends Record<string, any>>({
  label,
  defaultValues,
  validator,
  onSubmit,
  children,
}: FormPageTemplateProps<T>) {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const form = useForm<T>({
    defaultValues: defaultValues,
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
    // Add a validator to support Zod usage in Form and Field
    validatorAdapter: zodValidator(),
    validators: {
      onChange: validator,
    },
  });

  return (
    <PageTemplate
      label={label}
      leftOptions={[
        <ShortcutButton
          key="back"
          id="back"
          icon={<ArrowLeft />}
          color="warning"
          onClick={() => {
            navigate({ to: ".." });
          }}
        >
          Cancel
        </ShortcutButton>,
      ]}
      rightOptions={[
        <ShortcutButton
          key="reset"
          id={"reset"}
          icon={<Restore />}
          color="warning"
          onClick={() => {
            form.reset();
          }}
        >
          Reset
        </ShortcutButton>,

        <ShortcutButton
          key="submit"
          id={"submit"}
          disabled={
            !form.state.canSubmit || Object.keys(form.state.errors).length !== 0
          }
          icon={<CheckCircleOutline />}
          onClick={() => formRef.current?.requestSubmit()}
        >
          Submit
        </ShortcutButton>,
      ]}
    >
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <StackLayoutForFields>
          {/* {children(register, errors, control)} */}

          <form.Field
            name="label"
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <TextInput
                    id={field.name}
                    name={field.name}
                    label="Label"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                  {/* <FieldInfo field={field} /> */}
                </>
              );
            }}
          />

        </StackLayoutForFields>
      </form>
    </PageTemplate>
  );
}
