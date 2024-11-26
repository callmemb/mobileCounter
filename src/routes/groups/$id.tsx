import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { store, useCounterGroup } from "../../store";
import { CounterGroup, counterGroupValidator } from "../../definitions";
import TextInput from "../../components/form/textInput";
import FormPageTemplate from "../../components/form/formPageTemplate";
import { Controller } from "react-hook-form";
import IconPicker from "../../components/form/iconPicker";

export const Route = createFileRoute("/groups/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const group = useCounterGroup(id);
  const navigate = useNavigate();

  const onSubmit = async (data: CounterGroup) => {
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
    <FormPageTemplate<CounterGroup>
      label="Edit Counter"
      validator={counterGroupValidator}
      onSubmit={onSubmit}
      defaultValues={group}
    >
      {(register, errors, control) => (
        <>
          <TextInput
            label="Label"
            {...register("label")}
            errorMessage={errors?.label?.message?.toString()}
          />
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <IconPicker
                label="Icon"
                {...field}
                errorMessage={errors?.icon?.message?.toString()}
              />
            )}
          />
        </>
      )}
    </FormPageTemplate>
  );
}
