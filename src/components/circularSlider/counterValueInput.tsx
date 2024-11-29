import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import NumberInput from "../form/components/numberInput";

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
  const [value, setValue] = useState<number | undefined>(
    defaultStep * stepSize
  );

  const validator = useMemo(
    () =>
      z.coerce
        .number()
        .min(minStep * stepSize)
        .max(maxStep * stepSize)
        .multipleOf(stepSize),
    [minStep, maxStep, stepSize]
  );

  const errors = useMemo(() => {
    const { error } = validator.safeParse(value);
    return error ? error?.errors.map((e) => e.message).join(", ") : undefined;
  }, [value, validator]);

  const resetToDefault = useCallback(() => {
    setValue(defaultStep * stepSize);
  }, [defaultStep, stepSize]);

  useEffect(() => {
    resetToDefault();
  }, [resetToDefault]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onChange(value || 0);
    findNextFocusableElement(
      // Element is only visible if input is focused
      // so we are sure there is active element
      document.activeElement as HTMLElement
    )?.focus();
  };

  return (
    <form action="" onSubmit={onSubmit}>
      <NumberInput
        type="number"
        popupErrors
        label={label}
        errorMessage={errors}
        value={value}
        onChange={(v) => setValue(v)}
        onBlur={resetToDefault}
        slotProps={{
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
