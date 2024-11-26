import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { store, useCounterGroups } from "../../store";
import { NewCounter, newCounterValidator } from "../../definitions";
import FormPageTemplate from "../../components/form/formPageTemplate";
import CounterFields from "../../components/form/recordFields/counterFields";

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
        <CounterFields
          register={register}
          errors={errors}
          control={control}
          groupOptions={groupOptions}
        />
      )}
    </FormPageTemplate>
  );
}
