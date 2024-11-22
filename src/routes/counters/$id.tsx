import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { ArrowLeft, CheckCircleOutline, Restore } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo, useRef } from "react";
import { store, useCounter, useCounterGroups } from "../../store";
import { Counter, newCounterValidator } from "../../definitions";
import PageTemplate from "../../components/pageTemplate/component";
import ShortcutButton from "../../components/pageTemplate/components/shortcuts/shortcutButton";
import StackLayoutForFields from "../../components/form/stackLayoutForFields";
import TextInput from "../../components/form/textInput";
import SelectInput from "../../components/form/selectInput";
import NumberInput from "../../components/form/numberInput";

export const Route = createFileRoute("/counters/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const counter = useCounter(id);
  const groups = useCounterGroups();
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Counter>({
    resolver: zodResolver(newCounterValidator),
    defaultValues: counter,
  });

  useEffect(() => {
    reset(counter);
  }, [counter, reset, groups]);

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
    <PageTemplate
      label="Edit Counter"
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
            reset(counter);
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
          <TextInput
            label="Label"
            {...register("label")}
            errorMessage={errors?.label?.message?.toString()}
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
        </StackLayoutForFields>
      </form>
    </PageTemplate>
  );
}
