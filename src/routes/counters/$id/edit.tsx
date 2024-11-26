import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useMemo } from "react";
import { store, useCounter, useCounterGroups } from "../../../store";
import { counterValidator, NewCounter } from "../../../definitions";
import FormPageTemplate from "../../../components/form/formPageTemplate";
import CounterFields from "../../../components/form/recordFields/counterFields";

export const Route = createFileRoute("/counters/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const counter = useCounter(id);
  const groups = useCounterGroups();
  const navigate = useNavigate();

  const onSubmit = async (data: NewCounter) => {
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
    <FormPageTemplate<NewCounter>
      label="Edit Counter"
      validator={counterValidator}
      onSubmit={onSubmit}
      defaultValues={counter}
    >
      {(register, errors, control) => (
        <>
          <CounterFields
            register={register}
            errors={errors}
            control={control}
            groupOptions={groupOptions}
          />
        </>
      )}
    </FormPageTemplate>
  );
}
