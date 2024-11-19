import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../components/pageTemplate/component";
import ShortcutButton from "../components/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft, CheckCircleOutline, Restore } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo, useRef } from "react";
import { store, useCounterGroups } from "../store";
import { NewCounter, newCounterValidator } from "../definitions";
import StackLayoutForFields from "../components/form/stackLayoutForFields";
import TextInput from "../components/form/textInput";
import NumberInput from "../components/form/numberInput";
import SelectInput from "../components/form/selectInput";

export const Route = createFileRoute("/addCounter")({
  component: RouteComponent,
});

function RouteComponent() {
  const groups = useCounterGroups();
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const {
    reset,
    register,
    handleSubmit,

    formState: { errors, isValid },
  } = useForm<NewCounter>({
    resolver: zodResolver(newCounterValidator),
  });
  const onSubmit = async (data: NewCounter) => {
    const { errorMessage } = await store.upsertCounter(data);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }
    navigate({ to: "/" });
  };

  const groupOptions = useMemo(
    () => groups.map((g) => ({ value: g.id, label: g.label })),
    [groups]
  );

  return (
    <PageTemplate
      label="Add Counter"
      leftOptions={[
        <ShortcutButton
          key="back"
          id={"back"}
          icon={<ArrowLeft />}
          color="error"
          onClick={() => {
            navigate({ to: "/" });
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
            reset();
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

          <SelectInput
            label="Group"
            options={groupOptions}
            {...register("groupId")}
            errorMessage={errors?.groupId?.message?.toString()}
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
