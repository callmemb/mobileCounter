import { z } from "zod";
import { iconNames } from "./iconRelatedConsts";

const iconValidator = z.enum([...iconNames] as [string, ...string[]]);

export const newCounterValidator = z
  .object({
    label: z.string().min(3),
    defaultNumberOfSteps: z.coerce.number().min(1),
    maxNumberOfSteps: z.coerce.number().min(1),
    unitsInStep: z.coerce.number().min(1),
    dailyGoalOfSteps: z.coerce.number().min(1),
    unitsName: z.string().optional(),
    groupId: z.string().min(1),
    icon: iconValidator,
    activeDaysOfWeek: z.array(z.number().min(0).max(6)),
  })
  .refine((data) => +data.defaultNumberOfSteps <= +data.maxNumberOfSteps, {
    message: "max can not be less than default",
    path: ["maxNumberOfSteps"],
  });

export const counterValidator = z
  .object({
    id: z.string(),
    // init by system
    order: z.coerce.string(),
    currentSteps: z.coerce.number().min(0),
  })
  .and(newCounterValidator);

export const newCounterGroupValidator = z.object({
  label: z.string().min(3),
  icon: iconValidator,
});

export const counterGroupValidator = z
  .object({
    id: z.string(),
    order: z.coerce.string(),
  })
  .and(newCounterGroupValidator);

export const newCounterActionValidator = z.object({
  counterId: z.string(),
  value: z.coerce.number().min(1),
});

export const counterActionValidator = z
  .object({
    id: z.string(),
    date: z.date(),
  })
  .and(newCounterActionValidator);

export const counterActionDayAggregatedValidator = z.object({
  counterId: z.string(),
  value: z.coerce.number().min(1),
  day: z
    .string()
    .regex(
      /^\d{2}-\d{2}-\d{4}$/,
      "Invalid date format, should be 'DD-MM-YYYY'"
    ),
});
export const counterActionMonthAggregatedValidator = z.object({
  counterId: z.string(),
  value: z.coerce.number().min(1),
  month: z.string().date(),
});

export const dayLabelFromOptions = ["startOfRange", "endOfRange"] as const;

export const settingsValidator = z.object({
  id: z.string().optional(),
  dailyStepsResetTime: z.string().time({ precision: 0 }),
  dayLabelFrom: z.enum(dayLabelFromOptions),
  counterActionDaysToLive: z.coerce.number().min(1),

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
