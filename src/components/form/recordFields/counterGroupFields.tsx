import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { NewCounterGroup } from "../../../definitions";
import TextInput from "../textInput";
import IconPicker from "../iconPicker";

interface CounterGroupFieldsProps {
  register: UseFormRegister<NewCounterGroup>;
  errors: FieldErrors<NewCounterGroup>;
  control: Control<NewCounterGroup>;
}

export default function CounterGroupFields({
  register,
  errors,
  control,
}: CounterGroupFieldsProps) {
  return (
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
  );
}
