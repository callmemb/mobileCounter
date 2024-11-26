import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Controller } from "react-hook-form";
import { useMemo } from "react";
import { store, useCounterGroups } from "../../store";
import { NewCounter, newCounterValidator } from "../../definitions";
import TextInput from "../../components/form/textInput";
import NumberInput from "../../components/form/numberInput";
import SelectInput from "../../components/form/selectInput";
import FormPageTemplate from "../../components/form/formPageTemplate";
import IconPicker from "../../components/form/iconPicker";

export const Route = createFileRoute("/counters/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const groups = useCounterGroups();
  const navigate = useNavigate();
  const onSubmit = async (data: NewCounter) => {
    const { errorMessage } = await store.upsertCounter(data);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }
    navigate({ to: ".." });
  };

  const groupOptions = useMemo(
    () => groups.map((g) => ({ value: g.id, label: g.label })),
    [groups]
  );

  return (
    <FormPageTemplate<NewCounter>
      label="Add Counter"
      validator={newCounterValidator}
      onSubmit={onSubmit}
    >
      {(register, errors, control) => (
        <>
          <TextInput
            label="Label"
            {...register("label")}
            errorMessage={errors?.label?.message?.toString()}
          />

          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <IconPicker
                label="Icon"
                {...field}
                errorMessage={errors?.icon?.message?.toString()}
              />
            )}
          />

          <Controller
            control={control}
            name="groupId"
            render={({ field }) => (
              <SelectInput
                label="Group"
                options={groupOptions}
                {...field}
                errorMessage={errors?.groupId?.message?.toString()}
              />
            )}
          />

          <NumberInput
            label="Default number of steps"
            {...register("defaultNumberOfSteps")}
            errorMessage={errors?.defaultNumberOfSteps?.message?.toString()}
          />

          <NumberInput
            label="Maximum number of steps"
            {...register("maxNumberOfSteps")}
            errorMessage={errors?.maxNumberOfSteps?.message?.toString()}
          />

          <NumberInput
            label="Units in step"
            {...register("unitsInStep")}
            errorMessage={errors?.unitsInStep?.message?.toString()}
          />

          <TextInput
            label="Units name"
            {...register("unitsName")}
            errorMessage={errors?.unitsName?.message?.toString()}
          />

          <NumberInput
            label="Daily goal of steps"
            {...register("dailyGoalOfSteps")}
            errorMessage={errors?.dailyGoalOfSteps?.message?.toString()}
          />
        </>
      )}
    </FormPageTemplate>
  );
}
