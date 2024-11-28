import PageTemplate from "../../components/pageTemplate/component";
import ShortcutButton from "../../components/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft, CheckCircleOutline, Restore } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  FieldValues,
  DefaultValues,
  FieldErrors,
  Control,
  UseFormRegister,
  FormProvider,
} from "react-hook-form";
import { useRef } from "react";
import StackLayoutForFields from "../../components/form/stackLayoutForFields";
import { useNavigate } from "@tanstack/react-router";
import { ZodType } from "zod";

type FormPageTemplateProps<T extends FieldValues> = {
  label?: string;
  defaultValues?: DefaultValues<T>;
  validator: ZodType<T>;
  onSubmit: (data: T) => void;
  children: (
    register: UseFormRegister<T>,
    errors: FieldErrors<T>,
    control: Control<T>
  ) => React.ReactNode | React.ReactNode[];
};

export default function FormPageTemplate<T extends FieldValues>({
  label,
  defaultValues,
  validator,
  onSubmit,
  children,
}: FormPageTemplateProps<T>) {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const methods = useForm<T>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(validator),
    defaultValues,
  });
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  return (
    <FormProvider {...methods}>
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
              reset(defaultValues);
            }}
          >
            Reset
          </ShortcutButton>,

          <ShortcutButton
            key="submit"
            id={"submit"}
            disabled={!isValid || Object.keys(errors).length !== 0}
            icon={<CheckCircleOutline />}
            onClick={() => formRef.current?.requestSubmit()}
          >
            Submit
          </ShortcutButton>,
        ]}
      >
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <StackLayoutForFields>
            {children(register, errors, control)}
          </StackLayoutForFields>
        </form>
      </PageTemplate>
    </FormProvider>
  );
}
