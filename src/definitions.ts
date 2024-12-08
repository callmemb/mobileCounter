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
    faceImageId: z.string().optional(),
  })
  .refine((data) => +data.defaultNumberOfSteps <= +data.maxNumberOfSteps, {
    message: "max can not be less than default",
    path: ["maxNumberOfSteps"],
  });

const counterId = z.string();
export const counterValidator = z
  .object({
    id: counterId,
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

export const counterActionsByDayValidator = z.object({
  day: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid date format, should be 'YYYY-MM-DD'"
    ),
  counterId: counterId,
  value: z.coerce.number().min(0),
});
export const counterActionsByMonthValidator = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Invalid date format, should be 'YYYY-MM'"),
  counterId: counterId,
  value: z.coerce.number().min(0),
});

export const dayLabelFromOptions = ["startOfRange", "endOfRange"] as const;

export const settingsValidator = z.object({
  id: z.string().optional(),
  dailyStepsResetTime: z.string().time({ precision: 0 }),
  // dayLabelFrom: z.enum(dayLabelFromOptions),
  dayLabelFrom: z.string().regex(new RegExp(dayLabelFromOptions.join("|"))),
  counterActionDaysToLive: z.coerce.number().min(1),

  counterDayAggregatesDaysToLive: z.coerce.number().min(1),
  counterMonthAggregatesMonthsToLive: z.coerce.number().min(1),

  // system
  lastDailyStepResetDate: z.date().optional(),
});

export const imageValidator = z.object({
  id: z.string(),
  name: z.string().min(1),
  data: z.string().url(),
  uploadedAt: z.date(),
});

export type Counter = z.infer<typeof counterValidator>;
export type CounterGroup = z.infer<typeof counterGroupValidator>;
export type CounterAction = z.infer<typeof counterActionValidator>;

export type NewCounter = z.infer<typeof newCounterValidator>;
export type NewCounterGroup = z.infer<typeof newCounterGroupValidator>;
export type NewCounterAction = z.infer<typeof newCounterActionValidator>;

export type CounterActionsByDay = z.infer<typeof counterActionsByDayValidator>;
export type CounterActionsByMonth = z.infer<
  typeof counterActionsByMonthValidator
>;

export type Image = z.infer<typeof imageValidator>;

export type Settings = z.infer<typeof settingsValidator>;

export type SelectOption = { value: string | number; label: string };
