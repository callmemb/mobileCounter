import { useForm, Validator } from "@tanstack/react-form";
import { NewCounterGroup, newCounterGroupValidator } from "../../definitions";
import { zodValidator } from "@tanstack/zod-form-adapter";
import FormPageTemplate from "../pageTemplate/formPageTemplate";
import TextInput from "./components/textInput";
import IconPicker from "./components/iconPicker";

interface CounterGroupFormProps {
  label: string;
  counterGroup?: NewCounterGroup;
  onSubmit: (data: { value: NewCounterGroup }) => void;
}

export default function CounterGroupForm(props: CounterGroupFormProps) {
  const { counterGroup, onSubmit, label } = props;

  const form = useForm<NewCounterGroup, Validator<NewCounterGroup>>({
    defaultValues: counterGroup,
    onSubmit: onSubmit,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: newCounterGroupValidator,
    },
  });

  return (
    <FormPageTemplate label={label} form={form}>
      <form.Field
        name="label"
        children={(field) => (
          <TextInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            label="Label"
            errorMessage={
              field.state.meta.isTouched
                ? field.state.meta.errors.join(",")
                : ""
            }
          />
        )}
      />

      <form.Field
        name="icon"
        children={(field) => (
          <IconPicker
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            label="Icon"
            errorMessage={
              field.state.meta.isTouched
                ? field.state.meta.errors.join(",")
                : ""
            }
          />
        )}
      />
    </FormPageTemplate>
  );
}
