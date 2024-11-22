import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../../components/pageTemplate/component";
import ShortcutButton from "../../components/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft, CheckCircleOutline, Restore } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { store, useCounterGroup } from "../../store";
import { Counter, newCounterValidator } from "../../definitions";
import StackLayoutForFields from "../../components/form/stackLayoutForFields";
import TextInput from "../../components/form/textInput";

export const Route = createFileRoute("/groups/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const group = useCounterGroup(id);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const {
    reset,
    register,

    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Counter>({
    resolver: zodResolver(newCounterValidator),
    defaultValues: group,
  });

  useEffect(() => {
    reset(group);
  }, [group, reset]);

  const onSubmit = async (data: Counter) => {
    const { errorMessage } = await store.upsertCounter({ ...group, ...data });
    if (errorMessage) {
      alert(errorMessage);
      return;
    }
    navigate({ to: ".." });
  };

  return (
    <PageTemplate
      label="Edit Counter"
      leftOptions={[
        <ShortcutButton
          key="back"
          id="back"
          icon={<ArrowLeft />}
          color="warning"
          onClick={() => {
            navigate({ to: ".." });
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
            reset(group);
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
        </StackLayoutForFields>
      </form>
    </PageTemplate>
  );
}
