import { z } from "zod";

export const counterValidator = z.object({
  id: z.string().optional(),
  label: z.string().min(3),
  defaultNumberOfUnits: z.coerce.number().min(1),
  unitsName: z.string(),
  unitsInStep: z.coerce.number().min(1),
  dailyGoalOfSteps: z.coerce.number().min(1),
  currentSteps: z.coerce.number().min(0),
});

export type Counter = z.infer<typeof counterValidator>;
