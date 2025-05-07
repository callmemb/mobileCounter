import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { store } from "@/store";
import { NewCounterGroup } from "@/definitions";
import CounterGroupForm from "@/components/shared/form/counterGroup";

export const Route = createFileRoute("/groups/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const onSubmit = async ({ value }: { value: NewCounterGroup }) => {
    const { errorMessage } = await store.upsertCounterGroup(value);
    if (errorMessage) {
      alert(errorMessage);
    }
    navigate({ to: ".." });
  };

  return <CounterGroupForm label='New Group' onSubmit={onSubmit} />;
}
