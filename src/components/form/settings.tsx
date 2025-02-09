import { useForm, Validator } from "@tanstack/react-form";
import {
  dayLabelFromOptions,
  Settings,
  settingsValidator,
} from "../../definitions";
import FormPageTemplate from "../pageTemplate/formPageTemplate";
import TextInput from "./components/textInput";
import SelectInput from "./components/selectInput";
import NumberInput from "./components/numberInput";
import ShortcutButton from "../pageTemplate/components/shortcuts/shortcutButton";
import { Backup, ClearAll, ReadMore } from "@mui/icons-material";
import { store } from "../../store";

interface SettingsFormProps {
  settings: Settings | undefined;
  onSubmit: (data: { value: Settings }) => void;
}

export default function SettingsForm(props: SettingsFormProps) {
  const { settings, onSubmit } = props;

  const form = useForm<Settings, Validator<Settings>>({
    defaultValues: settings,
    onSubmit: onSubmit,
    validators: {
      onChange: settingsValidator,
    },
  });

  return (
    <FormPageTemplate
      label="Settings"
      form={form}
      extraOptions={[
        <ShortcutButton
          key="clear"
          id={"clear"}
          icon={<ClearAll />}
          color="error"
          onClick={() => {
            if (window.confirm("Are you sure you want to clear all data?")) {
              store.deleteAllData();
            }
          }}
        >
          Clear all data
        </ShortcutButton>,
        <ShortcutButton
          key="readBackup"
          id={"readBackup"}
          icon={<ReadMore />}
          color="warning"
          onClick={async () => {
            // Create and trigger a hidden file input for the backup file.
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "application/json";
            fileInput.onchange = async (event) => {
              const target = event.target as HTMLInputElement;
              if (target.files && target.files.length > 0) {
                const file = target.files[0];
                const backupData = await file.text();
                const result = await store.importBackup(backupData);
                if (result.success) {
                  alert("Backup restored successfully.");
                } else {
                  alert("Restore failed: " + result.errorMessage);
                }
              }
            };
            fileInput.click();
          }}
        >
          Read backup file
        </ShortcutButton>,
        <ShortcutButton
          key="createBackup"
          id={"createBackup"}
          icon={<Backup />}
          color="info"
          onClick={async () => {
            try {
              const { backupData, errorMessage } = await store.createBackup();
              if (errorMessage) {
                alert(errorMessage);
              } else if (backupData) {
                const blob = new Blob([backupData], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "backup.json";
                link.click();
                URL.revokeObjectURL(url);
              }
            } catch (error) {
              alert("Backup failed");
            }
          }}
        >
          Create backup file
        </ShortcutButton>,
      ]}
    >
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
