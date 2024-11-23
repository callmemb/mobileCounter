import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { store } from "../../store";
import { NewCounterGroup, newCounterGroupValidator } from "../../definitions";
import TextInput from "../../components/form/textInput";
import FormPageTemplate from "../../components/form/formPageTemplate";

export const Route = createFileRoute("/groups/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const onSubmit = async (data: NewCounterGroup) => {
    const { errorMessage } = await store.upsertCounterGroup(data);
    if (errorMessage) {
      alert(errorMessage);
    }
    navigate({ to: ".." });
  };

  return (
    <FormPageTemplate<NewCounterGroup>
      label="New Group"
      validator={newCounterGroupValidator}
      onSubmit={onSubmit}
    >
      {(register, errors) => (
        <TextInput
          label="Label"
          {...register("label")}
          errorMessage={errors?.label?.message?.toString()}
        />
      )}
    </FormPageTemplate>
  );
}
