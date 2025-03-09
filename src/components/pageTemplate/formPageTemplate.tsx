import PageTemplate from "../../components/pageTemplate/component";
import ShortcutButton from "../../components/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft, CheckCircleOutline, Restore } from "@mui/icons-material";
import { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm, Validator } from "@tanstack/react-form";

type FormPageTemplateProps<
  TFormData,
  TValidator extends Validator<TFormData>,
> = {
  label?: string;
  children: ReactNode | ReactNode[];
  form: ReturnType<typeof useForm<TFormData, TValidator>>;
  extraOptions?: ReactNode | ReactNode[];
};

export default function FormPageTemplate<
  TFormData,
  TValidator extends Validator<TFormData>,
>({
  label,
  form,
  children,
  extraOptions,
}: FormPageTemplateProps<TFormData, TValidator>) {
  const navigate = useNavigate();

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
            navigate({ to: "/" });
          }}
        >
          Cancel
        </ShortcutButton>,
        <span></span>,
        extraOptions,
      ]}
      rightOptions={[
        <ShortcutButton
          key="reset"
          id={"reset"}
          icon={<Restore />}
          color="warning"
          onClick={() => form.reset()}
        >
          Reset
        </ShortcutButton>,

        <form.Subscribe
          key="submit"
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <ShortcutButton
              id={"submit"}
              disabled={!canSubmit}
              icon={<CheckCircleOutline />}
              onClick={() => form.handleSubmit()}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </ShortcutButton>
          )}
        </form.Subscribe>,
      ]}
    >
      {children}
    </PageTemplate>
  );
}
