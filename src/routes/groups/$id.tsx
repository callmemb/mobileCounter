import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { store } from "../../store";
import { NewCounterGroup } from "../../definitions";
import CounterGroupForm from "../../components/form/counterGroup";

export const Route = createFileRoute("/groups/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const group = store.useCounterGroup(id);
  const navigate = useNavigate();

  const onSubmit = async ({ value }: { value: NewCounterGroup }) => {
    const { errorMessage } = await store.upsertCounterGroup({
      ...group,
      ...value,
    });
    if (errorMessage) {
      alert(errorMessage);
      return;
    }
    navigate({ to: ".." });
  };

  return (
    <CounterGroupForm
      label="Edit Group"
      counterGroup={group}
      onSubmit={onSubmit}
    />
  );
}
