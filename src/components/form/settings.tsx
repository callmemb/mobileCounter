import { useForm, Validator } from "@tanstack/react-form";
import {
  dayLabelFromOptions,
  Settings,
  settingsValidator,
} from "../../definitions";
import { zodValidator } from "@tanstack/zod-form-adapter";
import FormPageTemplate from "../pageTemplate/formPageTemplate";
import TextInput from "./components/textInput";
import SelectInput from "./components/selectInput";
import NumberInput from "./components/numberInput";

interface SettingsFormProps {
  settings: Settings | undefined;
  onSubmit: (data: { value: Settings }) => void;
}

export default function SettingsForm(props: SettingsFormProps) {
  const { settings, onSubmit } = props;

  const form = useForm<Settings, Validator<Settings>>({
    defaultValues: settings,
    onSubmit: onSubmit,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: settingsValidator,
    },
  });

  return (
    <FormPageTemplate label="Settings" form={form}>
      <form.Field
        name="dailyStepsResetTime"
        children={(field) => (
          <TextInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            label="Daily steps goal reset time"
            placeholder="HH:MM:SS"
            errorMessage={
              field.state.meta.isTouched
                ? field.state.meta.errors.join(",")
                : ""
            }
          />
        )}
      />

      <form.Field
        name="dayLabelFrom"
        children={(field) => (
          <SelectInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            label="Day label from"
            options={dayLabelFromOptions.map((value) => ({
              value,
              label: value,
            }))}
            dataType="string"
            errorMessage={
              field.state.meta.isTouched
                ? field.state.meta.errors.join(",")
                : ""
            }
          />
        )}
      />

      <form.Field
        name="counterActionDaysToLive"
        children={(field) => (
          <NumberInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            label="Counter action days to live"
            errorMessage={
              field.state.meta.isTouched
                ? field.state.meta.errors.join(",")
                : ""
            }
          />
        )}
      />

      <form.Field
        name="counterDayAggregatesDaysToLive"
        children={(field) => (
          <NumberInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            label="Counter 'day stats' days to live"
            errorMessage={
              field.state.meta.isTouched
                ? field.state.meta.errors.join(",")
                : ""
            }
          />
        )}
      />

      <form.Field
        name="counterMonthAggregatesMonthsToLive"
        children={(field) => (
          <NumberInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            label="Counter 'month stats' months to live"
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
