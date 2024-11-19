import { z } from "zod";

export const newCounterValidator = z.object({
  label: z.string().min(3),
  defaultNumberOfSteps: z.coerce.number().min(1),
  maxNumberOfSteps: z.coerce.number().min(1),
  unitsInStep: z.coerce.number().min(1),
  dailyGoalOfSteps: z.coerce.number().min(1),
  unitsName: z.string().min(1),
  groupId: z.string().min(1),
});

export const counterValidator = z.object({
  id: z.string(),
  ...newCounterValidator.shape,

  // init by system
  order: z.coerce.string(),
  currentSteps: z.coerce.number().min(0),
});

export const newCounterGroupValidator = z.object({
  label: z.string().min(3),
});

export const counterGroupValidator = z.object({
  id: z.string(),
  ...newCounterGroupValidator.shape,
  order: z.coerce.string(),
});

export const counterActionValidator = z.object({
  id: z.string(),
  counterId: z.string(),
  value: z.coerce.number().min(1),
  date: z.date(),
});

export type Counter = z.infer<typeof counterValidator>;
export type CounterGroup = z.infer<typeof counterGroupValidator>;
export type CounterAction = z.infer<typeof counterActionValidator>;

// New types for creation (without IDs)
export type NewCounter = z.infer<typeof newCounterValidator>;
export type NewCounterGroup = z.infer<typeof newCounterGroupValidator>;
export type NewCounterAction = Omit<CounterAction, "id">;

export type SelectOption = { value: string|number; label: string };
