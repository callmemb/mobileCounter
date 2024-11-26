import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField } from "@mui/material";

type CounterValueInputProps = {
  label: string;
  minStep: number;
  maxStep: number;
  stepSize: number;
  defaultStep: number;
  onChange: (value: number) => void;
};

const findNextFocusableElement = (element: HTMLElement): HTMLElement | null => {
  const focusables = document.querySelectorAll<HTMLElement>(
    'button:not([tabindex="-1"]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const current = Array.from(focusables).findIndex((el) => el === element);
  return focusables[current + 1] || null;
};

export default function CounterValueInput({
  label,
  minStep,
  maxStep,
  stepSize,
  defaultStep,
  onChange,
}: CounterValueInputProps) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ value: number }>({
    resolver: zodResolver(
      z.object({
        value: z.coerce
          .number()
          .min(minStep * stepSize)
          .max(maxStep * stepSize)
          .multipleOf(stepSize),
      })
    ),
    mode: "onChange",
    defaultValues: { value: defaultStep * stepSize },
  });

  const resetToDefault = () => {
    reset({ value: defaultStep * stepSize });
  };

  useEffect(() => {
    resetToDefault();
  }, [defaultStep, stepSize, reset]);

  const onSubmit = (data: { value: number }) => {
    onChange(data.value);
    findNextFocusableElement(
      // Element is only visible if input is focused
      // so we are sure there is active element
      document.activeElement as HTMLElement
    )?.focus();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onBlur={resetToDefault}>
      <TextField
        type="number"
        label={label}
        error={!!errors.value}
        {...register("value")}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          htmlInput: {
            min: minStep * stepSize,
            max: maxStep * stepSize,
            step: stepSize,
          },
        }}
      />
    </form>
  );
}
