import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { store } from "@/store";
import { NewCounter } from "@/definitions";
import CounterForm from "@/components/shared/form/counter";

export const Route = createFileRoute("/counters/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const groups = store.useCounterGroups();
  const navigate = useNavigate();
  const onSubmit = async ({ value }: { value: NewCounter }) => {
    const { errorMessage } = await store.upsertCounter(value);
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
      groupOptions={groupOptions}
      label="Edit Counter"
      onSubmit={onSubmit}
    />
  );
}
