import {
  Control,
  Controller,
  FieldErrors,
  useFormContext,
  UseFormRegister,
} from "react-hook-form";
import { NewCounter, SelectOption } from "../../../definitions";
import TextInput from "../textInput";
import IconPicker from "../iconPicker";
import SelectInput from "../selectInput";
import NumberInput from "../numberInput";
import { Box } from "@mui/material";
import { useEffect } from "react";

interface CounterFieldsProps {
  register: UseFormRegister<NewCounter>;
  errors: FieldErrors<NewCounter>;
  control: Control<NewCounter>;
  groupOptions: SelectOption[];
}

export default function CounterFields({
  register,
  errors,
  control,
  groupOptions,
}: CounterFieldsProps) {
  const {
    trigger,
    formState: { isValid, touchedFields },
  } = useFormContext();

  /** rhf cant handle refined part in validation,
   * this is a workaround to trigger validation
   */
  useEffect(() => {
    if (
      touchedFields.maxNumberOfSteps &&
      touchedFields.defaultNumberOfSteps &&
      !isValid
    ) {
      trigger("maxNumberOfSteps");
    }
  }, [
    touchedFields.maxNumberOfSteps,
    touchedFields.defaultNumberOfSteps,
    isValid,
    trigger,
  ]);

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

      <Controller
        control={control}
        name="groupId"
        render={({ field }) => (
          <SelectInput
            label="Group"
            options={groupOptions}
            {...field}
            errorMessage={errors?.groupId?.message?.toString()}
          />
        )}
      />

      <Box sx={{ display: "flex", gap: 1 }}>
        <NumberInput
          label="Default steps"
          {...register("defaultNumberOfSteps")}
          errorMessage={errors?.defaultNumberOfSteps?.message?.toString()}
        />

        <NumberInput
          label="Maximum steps"
          {...register("maxNumberOfSteps")}
          errorMessage={errors?.maxNumberOfSteps?.message?.toString()}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <NumberInput
          label="Units in step"
          {...register("unitsInStep")}
          errorMessage={errors?.unitsInStep?.message?.toString()}
        />

        <TextInput
          label="Units name"
          {...register("unitsName")}
          errorMessage={errors?.unitsName?.message?.toString()}
        />
      </Box>

      <NumberInput
        label="Daily goal of steps"
        {...register("dailyGoalOfSteps")}
        errorMessage={errors?.dailyGoalOfSteps?.message?.toString()}
      />

      <Controller
        control={control}
        name="activeDaysOfWeek"
        render={({ field }) => (
          <SelectInput
            multiple
            label="Active days of week"
            options={[
              { label: "Sunday", value: 0 },
              { label: "Monday", value: 1 },
              { label: "Tuesday", value: 2 },
              { label: "Wednesday", value: 3 },
              { label: "Thursday", value: 4 },
              { label: "Friday", value: 5 },
              { label: "Saturday", value: 6 },
            ]}
            {...field}
            errorMessage={errors?.activeDaysOfWeek?.message?.toString()}
          />
        )}
      />
    </>
  );
}
