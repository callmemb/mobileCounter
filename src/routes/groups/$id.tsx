import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { store, useCounterGroup } from "../../store";
import { counterGroupValidator, NewCounterGroup } from "../../definitions";
import FormPageTemplate from "../../components/form/formPageTemplate";
import CounterGroupFields from "../../components/form/recordFields/counterGroupFields";

export const Route = createFileRoute("/groups/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const group = useCounterGroup(id);
  const navigate = useNavigate();

  const onSubmit = async (data: NewCounterGroup) => {
    const { errorMessage } = await store.upsertCounterGroup({
      ...group,
      ...data,
    });
    if (errorMessage) {
      alert(errorMessage);
      return;
    }
    navigate({ to: ".." });
  };

  return (
    <FormPageTemplate<NewCounterGroup>
      label="Edit Counter"
      validator={counterGroupValidator}
      onSubmit={onSubmit}
      defaultValues={group}
    >
      {(register, errors, control) => (
        <CounterGroupFields
          register={register}
          errors={errors}
          control={control}
        />
      )}
    </FormPageTemplate>
  );
}
