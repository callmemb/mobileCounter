import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { store } from "@/store";
import { NewCounter } from "@/definitions";
import CounterForm from "@/components/shared/form/counter";

export const Route = createFileRoute("/counters/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const counter = store.useCounter(id);
  const groups = store.useCounterGroups();
  const navigate = useNavigate();

  const onSubmit = async ({ value }: { value: NewCounter }) => {
    const { errorMessage } = await store.upsertCounter({
      ...counter,
      ...value,
    });
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
    <CounterForm
      counter={counter}
      groupOptions={groupOptions}
      label="Edit Counter"
      onSubmit={onSubmit}
    />
  );
}
