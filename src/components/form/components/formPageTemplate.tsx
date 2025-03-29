import { ReactNode } from "react";
import { ArrowLeft, CheckCircleOutline, Restore } from "@mui/icons-material";
import { useNavigate } from "@tanstack/react-router";
import { useFormContext } from "../context";
import PageTemplate from "../../pageTemplate/component";
import ShortcutButton from "../../pageTemplate/components/shortcuts/shortcutButton";

type FormPageTemplateProps = React.PropsWithChildren<{
  label: string;
  extraOptions?: ReactNode | ReactNode[];
}>;

export default function FormPageTemplate(props: FormPageTemplateProps) {
  const { label, children, extraOptions } = props;
  const form = useFormContext();
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
        <span key="spacer"></span>,
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
