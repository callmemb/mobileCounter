import {
  NewCounter,
  SelectOption,
  newCounterValidator,
} from "../../../definitions";
import { Box } from "@mui/material";
import { useAppForm } from ".";

interface CounterFormProps {
  label: string;
  counter?: NewCounter;
  groupOptions: SelectOption[];
  onSubmit: (data: { value: NewCounter }) => void;
}

export default function CounterForm(props: CounterFormProps) {
  const { counter, onSubmit, label, groupOptions } = props;

  const form = useAppForm({
    defaultValues: counter,
    onSubmit: onSubmit,
    validators: {
      onChange: newCounterValidator,
    },
  });

  return (
    <form.AppForm>
      <form.FormPageTemplate label={label}>
        <form.AppField
          name="label"
          children={(f) => <f.TextInput label="Label" />}
        />

        <form.AppField
          name="icon"
          children={(f) => <f.IconPicker label="Icon" />}
        />

        <form.AppField
          name="groupId"
          children={(f) => (
            <f.SelectInput label="Group" options={groupOptions} />
          )}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <form.AppField
            name="defaultNumberOfSteps"
            children={(f) => <f.NumberInput label="Default steps" />}
          />

          <form.AppField
            name="maxNumberOfSteps"
            validators={{
              onChangeListenTo: ["defaultNumberOfSteps"],
            }}
            children={(f) => <f.NumberInput label="Maximum steps" />}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <form.AppField
            name="unitsInStep"
            children={(f) => <f.NumberInput label="Units in step" />}
          />
          <form.AppField
            name="unitsName"
            children={(f) => <f.TextInput label="Units name" />}
          />
        </Box>

        <form.AppField
          name="dailyGoalOfSteps"
          children={(f) => <f.NumberInput label="Daily goal of steps" />}
        />

        <form.AppField
          name="activeDaysOfWeek"
          children={(f) => (
            <f.SelectInput
              label="Active days of week"
              multiple={true}
              dataType="number"
              options={[
                { label: "Sunday", value: 0 },
                { label: "Monday", value: 1 },
                { label: "Tuesday", value: 2 },
                { label: "Wednesday", value: 3 },
                { label: "Thursday", value: 4 },
                { label: "Friday", value: 5 },
                { label: "Saturday", value: 6 },
              ]}
            />
          )}
        />

        <form.AppField
          name="faceImageId"
          children={(f) => <f.ImagePicker label="Image" />}
        />
      </form.FormPageTemplate>
    </form.AppForm>
  );
}
