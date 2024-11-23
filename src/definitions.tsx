import { z } from "zod";

export const newCounterValidator = z.object({
  label: z.string().min(3),
  defaultNumberOfSteps: z.coerce.number().min(1),
  maxNumberOfSteps: z.coerce.number().min(1),
  unitsInStep: z.coerce.number().min(1),
  dailyGoalOfSteps: z.coerce.number().min(1),
  unitsName: z.string().optional(),
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

export const newCounterActionValidator = z.object({
  counterId: z.string(),
  value: z.coerce.number().min(1),
});

export const counterActionValidator = z.object({
  id: z.string(),
  ...newCounterActionValidator.shape,
  date: z.date(),
});

export const dayLabelFromOptions = ["startOfRange", "endOfRange"] as const;

export const settingsValidator = z.object({
  id: z.string().optional(),
  dailyStepsResetTime: z.string().time({ precision: 0 }),
  dayLabelFrom: z.enum(dayLabelFromOptions),

  // system
  lastDailyStepResetDate: z.date().optional(),
});

export type Counter = z.infer<typeof counterValidator>;
export type CounterGroup = z.infer<typeof counterGroupValidator>;
export type CounterAction = z.infer<typeof counterActionValidator>;

// New types for creation (without IDs)
export type NewCounter = z.infer<typeof newCounterValidator>;
export type NewCounterGroup = z.infer<typeof newCounterGroupValidator>;
export type NewCounterAction = z.infer<typeof newCounterActionValidator>;

export type Settings = z.infer<typeof settingsValidator>;

export type SelectOption = { value: string | number; label: string };
