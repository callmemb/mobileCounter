import { NewCounterGroup, newCounterGroupValidator } from "../../definitions";
import { useAppForm } from "./component";

interface CounterGroupFormProps {
  label: string;
  counterGroup?: NewCounterGroup;
  onSubmit: (data: { value: NewCounterGroup }) => void;
}

export default function CounterGroupForm(props: CounterGroupFormProps) {
  const { counterGroup, onSubmit, label } = props;

  const form = useAppForm({
    defaultValues: counterGroup,
    onSubmit: onSubmit,
    validators: {
      onChange: newCounterGroupValidator,
    },
  });

  return (
    <form.AppForm>
      <form.FormPageTemplate label={label}>
        <form.AppField
          name="label"
          children={(f) => <f.TextInput label="Label" />}
        />

        <form.AppField
          name="icon"
          children={(f) => <f.IconPicker label="Icon" />}
        />
      </form.FormPageTemplate>
    </form.AppForm>
  );
}
