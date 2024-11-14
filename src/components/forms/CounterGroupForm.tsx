import { ComponentInModalPropsType } from "../../hooks/useModal";
import { TextInput } from "./form";
import { store } from "../../store";
import { useForm } from "@tanstack/react-form";
import { Button } from "@mui/material";
import { CounterGroup, counterGroupValidator, NewCounterGroup } from "../../definitions";
import { Delete } from "@mui/icons-material";

export default function CounterGroupForm({
  hide,
  initialData,
}: ComponentInModalPropsType & {
  initialData?: Partial<CounterGroup>;
}) {
  const form = useForm({
    defaultValues: {
      ...initialData,
      label: "",
    } as NewCounterGroup,
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
      const { id, error } = await store.upsertCounterGroup({
        ...initialData,
        ...value,
      });
      if(error){
        alert(error);
        return;
      }
      form.reset();
      hide();
    },
  });

  return (
    <form
      className="custom-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <TextInput
        name="label"
        form={form}
        validator={counterGroupValidator.shape.label}
      />

      <div className="row">
        <Button
          type="reset"
          size="large"
          variant="contained"
          color="secondary"
          onClick={() => form.reset()}
        >
          <Delete />
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              disabled={!canSubmit}
            >
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        />
      </div>
    </form>
  );
}
