import { useForm, Validator } from "@tanstack/react-form";
import {
  NewCounter,
  SelectOption,
  newCounterValidator,
} from "../../definitions";
import { zodValidator } from "@tanstack/zod-form-adapter";
import FormPageTemplate from "../pageTemplate/formPageTemplate";
import TextInput from "./components/textInput";
import IconPicker from "./components/iconPicker";
import SelectInput from "./components/selectInput";
import NumberInput from "./components/numberInput";
import { Box } from "@mui/material";
import ImagePicker from "./components/imagePicker";

interface CounterFormProps {
  label: string;
  counter?: NewCounter;
  groupOptions: SelectOption[];
  onSubmit: (data: { value: NewCounter }) => void;
}

export default function CounterForm(props: CounterFormProps) {
  const { counter, onSubmit, label, groupOptions } = props;

  const form = useForm<NewCounter, Validator<NewCounter>>({
    defaultValues: counter,
    onSubmit: onSubmit,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: newCounterValidator,
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

      <form.Field
        name="groupId"
        children={(field) => (
          <SelectInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            label="Group"
            options={groupOptions}
            errorMessage={
              field.state.meta.isTouched
                ? field.state.meta.errors.join(",")
                : ""
            }
          />
        )}
      />

      <Box sx={{ display: "flex", gap: 1 }}>
        <form.Field
          name="defaultNumberOfSteps"
          children={(field) => (
            <NumberInput
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              label="Default steps"
              errorMessage={
                field.state.meta.isTouched
                  ? field.state.meta.errors.join(",")
                  : ""
              }
            />
          )}
        />

        <form.Field
          name="maxNumberOfSteps"
          validators={{
            onChangeListenTo: ["defaultNumberOfSteps"],
          }}
          children={(field) => (
            <NumberInput
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              label="Maximum steps"
              errorMessage={
                field.state.meta.isTouched
                  ? field.state.meta.errors.join(",")
                  : ""
              }
            />
          )}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <form.Field
          name="unitsInStep"
          children={(field) => (
            <NumberInput
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              label="Units in step"
              errorMessage={
                field.state.meta.isTouched
                  ? field.state.meta.errors.join(",")
                  : ""
              }
            />
          )}
        />

        <form.Field
          name="unitsName"
          children={(field) => (
            <TextInput
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              label="Units name"
              errorMessage={
                field.state.meta.isTouched
                  ? field.state.meta.errors.join(",")
                  : ""
              }
            />
          )}
        />
      </Box>

      <form.Field
        name="dailyGoalOfSteps"
        children={(field) => (
          <NumberInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            label="Daily goal of steps"
            errorMessage={
              field.state.meta.isTouched
                ? field.state.meta.errors.join(",")
                : ""
            }
          />
        )}
      />

      <form.Field
        name="activeDaysOfWeek"
        children={(field) => (
          <SelectInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            multiple={true}
            dataType="number"
            label="Active days of week"
            options={[
              { label: "Sunday", value: 0 },
              { label: "Monday", value: 1 },
              { label: "Tuesday", value: 2 },
              { label: "Wednesday", value: 3 },
              { label: "Thursday", value: 4 },
              { label: "Friday", value: 5 },
              { label: "Saturday", value: 6 },
            ]}
            errorMessage={
              field.state.meta.isTouched
                ? field.state.meta.errors.join(",")
                : ""
            }
          />
        )}
      />

      <form.Field
        name="faceImageId"
        children={(field) => (
          <ImagePicker
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            label="Image"
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
