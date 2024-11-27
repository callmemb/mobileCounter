import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  dayLabelFromOptions,
  Settings,
  settingsValidator,
} from "../definitions";
import { store, useSettings } from "../store";
import FormPageTemplate from "../components/form/formPageTemplate";
import TextInput from "../components/form/textInput";
import { Controller } from "react-hook-form";
import SelectInput from "../components/form/selectInput";
import NumberInput from "../components/form/numberInput";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const settings = useSettings();
  const onSubmit = async (data: Settings) => {
    const { errorMessage } = await store.upsertSettings(data);
    if (errorMessage) {
      alert(errorMessage);
    }
    navigate({ to: ".." });
  };

  return (
    <FormPageTemplate<Settings>
      label="Settings"
      validator={settingsValidator}
      onSubmit={onSubmit}
      defaultValues={settings}
    >
      {(register, errors, control) => (
        <>
          <TextInput
            label="Daily steps goal reset time"
            placeholder="HH:MM:SS"
            {...register("dailyStepsResetTime")}
            errorMessage={errors?.dailyStepsResetTime?.message?.toString()}
          />
          <Controller
            control={control}
            name="dayLabelFrom"
            render={({ field }) => (
              <SelectInput
                label="Day label from"
                options={dayLabelFromOptions.map((value) => ({
                  value,
                  label: value
                    .replace(/([A-Z])/g, " $1")
                    .toLowerCase()
                    .replace(/^./, (str) => str.toUpperCase()),
                }))}
                {...field}
                errorMessage={errors?.dayLabelFrom?.message?.toString()}
              />
            )}
          />

          <NumberInput
            label="Counter action days to live"
            {...register("counterActionDaysToLive")}
            errorMessage={errors?.counterActionDaysToLive?.message?.toString()}
          />
          
        </>
      )}
    </FormPageTemplate>
  );
}
