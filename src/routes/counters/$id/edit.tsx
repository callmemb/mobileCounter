import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useMemo } from "react";
import { store, useCounter, useCounterGroups } from "../../../store";
import { Counter, counterValidator } from "../../../definitions";
import TextInput from "../../../components/form/textInput";
import SelectInput from "../../../components/form/selectInput";
import NumberInput from "../../../components/form/numberInput";
import FormPageTemplate from "../../../components/form/formPageTemplate";
import { Controller } from "react-hook-form";
import IconPicker from "../../../components/form/iconPicker";

export const Route = createFileRoute("/counters/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const counter = useCounter(id);
  const groups = useCounterGroups();
  const navigate = useNavigate();

  const onSubmit = async (data: Counter) => {
    const { errorMessage } = await store.upsertCounter({ ...counter, ...data });
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
    <FormPageTemplate<Counter>
      label="Edit Counter"
      validator={counterValidator}
      onSubmit={onSubmit}
      defaultValues={counter}
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
