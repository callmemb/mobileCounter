import { z } from "zod";

export const counterActionValidator = z.object({
  id: z.string(),
  counterId: z.string(),
  value: z.coerce.number().min(1),
  date: z.date(),
});

export const counterValidator = z.object({
  id: z.string(),
  label: z.string().min(3),
  defaultNumberOfSteps: z.coerce.number().min(1),
  maxNumberOfSteps: z.coerce.number().min(1),
  unitsInStep: z.coerce.number().min(1),
  dailyGoalOfSteps: z.coerce.number().min(1),
  unitsName: z.string(),
  groupId: z.string(),
  
  
  // init by system
  order: z.coerce.string(),
  currentSteps: z.coerce.number().min(0),
});

export const counterGroupValidator = z.object({
  id: z.string(),
  label: z.string().min(3),
  order: z.coerce.string(),
});

export type Counter = z.infer<typeof counterValidator>;
export type CounterGroup = z.infer<typeof counterGroupValidator>;
export type CounterAction = z.infer<typeof counterActionValidator>;

// New types for creation (without IDs)
export type NewCounter = Omit<Counter, 'id' | 'order' | 'currentSteps'>;
export type NewCounterGroup = Omit<CounterGroup, 'id'>;
export type NewCounterAction = Omit<CounterAction, 'id'>;

