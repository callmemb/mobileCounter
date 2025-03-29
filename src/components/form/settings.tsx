import {
  dayLabelFromOptions,
  Settings,
  settingsValidator,
} from "../../definitions";
import ShortcutButton from "../pageTemplate/components/shortcuts/shortcutButton";
import { Backup, ClearAll, ReadMore } from "@mui/icons-material";
import { store } from "../../store";
import { useAppForm } from "./component";

interface SettingsFormProps {
  settings: Settings | undefined;
  onSubmit: (data: { value: Settings }) => void;
}

export default function SettingsForm(props: SettingsFormProps) {
  const { settings, onSubmit } = props;

  const form = useAppForm({
    defaultValues: settings,
    onSubmit: onSubmit,
    validators: {
      onChange: settingsValidator,
    },
  });

  return (
    <form.AppForm>
      <form.FormPageTemplate
        label="Settings"
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
                  const blob = new Blob([backupData], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "backup.json";
                  link.click();
                  URL.revokeObjectURL(url);
                }
              } catch (error) {
                alert(`Backup failed: ${error}`);
              }
            }}
          >
            Create backup file
          </ShortcutButton>,
        ]}
      >
        <form.AppField
          name="dailyStepsResetTime"
          children={(f) => (
            <f.TextInput
              label="Daily steps goal reset time"
              placeholder="HH:MM:SS"
            />
          )}
        />

        <form.AppField
          name="dayLabelFrom"
          children={(f) => (
            <f.SelectInput
              label="Day label from"
              options={dayLabelFromOptions.map((value) => ({
                value,
                label: value,
              }))}
            />
          )}
        />

        <form.AppField
          name="counterActionDaysToLive"
          children={(f) => (
            <f.NumberInput label="Counter action days to live" />
          )}
        />
        <form.AppField
          name="counterDayAggregatesDaysToLive"
          children={(f) => (
            <f.NumberInput label="Counter 'day stats' days to live" />
          )}
        />
        <form.AppField
          name="counterMonthAggregatesMonthsToLive"
          children={(f) => (
            <f.NumberInput label="Counter 'month stats' months to live" />
          )}
        />
      </form.FormPageTemplate>
    </form.AppForm>
  );
}
