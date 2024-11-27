import { useLiveQuery } from "dexie-react-hooks";
import {
  Counter,
  CounterAction,
  counterActionValidator,
  CounterGroup,
  counterGroupValidator,
  counterValidator,
  NewCounter,
  NewCounterAction,
  NewCounterGroup,
  Settings,
  settingsValidator,
} from "./definitions";
import { db } from "./store/indexDB";
import { v4 as genId } from "uuid";
import { generateKeyBetween } from "./lib/generateKeyBetween";
import dayjs from "dayjs";
import { getDayOfWeek } from "./lib/dates";

type StoreResponse<T> = {
  errorMessage?: string;
  id?: T extends { id: string } ? T["id"] : string;
  record?: T;
};

class Store {
  async upsertCounter(
    record: NewCounter | Counter
  ): Promise<StoreResponse<Counter>> {
    try {
      let defaults = {};
      if (!("id" in record)) {
        const firstCounter =
          (await db.counters.limit(1).first())?.order || null;
        const order = generateKeyBetween(null, firstCounter);
        defaults = { id: genId(), order: order, currentSteps: 0 };
      }
      const validatedRecord = counterValidator.parse({
        ...record,
        ...defaults,
      });
      const group = await db.counterGroups.get(validatedRecord.groupId);
      if (!group) {
        return {
          errorMessage: "Group not found",
          id: "id" in record ? record.id : undefined,
        };
      }
      await db.counters.put(validatedRecord);
      return { id: validatedRecord.id, record: validatedRecord };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id: "id" in record ? record.id : undefined,
      };
    }
  }
  async deleteCounter(id: Counter["id"]): Promise<StoreResponse<Counter>> {
    try {
      return await db
        .transaction("rw", db.counterActions, db.counters, async () => {
          await db.counterActions.where("counterId").equals(id).delete();
          await db.counters.delete(id);
        })
        .then(() => {
          return { id };
        });
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id,
      };
    }
  }
  async upsertCounterGroup(
    record: NewCounterGroup | CounterGroup
  ): Promise<StoreResponse<CounterGroup>> {
    try {
      let defaults = {};
      if (!("id" in record)) {
        const firstCounter =
          (await db.counterGroups.limit(1).first())?.order || null;
        const order = generateKeyBetween(null, firstCounter);
        defaults = { id: genId(), order: order };
      }
      const validatedRecord = counterGroupValidator.parse({
        ...record,
        ...defaults,
      });
      await db.counterGroups.put(validatedRecord);
      return { id: validatedRecord.id, record: validatedRecord };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id: "id" in record ? record.id : undefined,
      };
    }
  }
  async deleteCounterGroup(
    id: CounterGroup["id"]
  ): Promise<StoreResponse<CounterGroup>> {
    try {
      return await db
        .transaction("rw", db.counters, db.counterGroups, async () => {
          const relevantCounters = await db.counters
            .where("groupId")
            .equals(`${id}`)
            .toArray();
          await Promise.all(
            relevantCounters.map((counter) => this.deleteCounter(counter.id))
          );
          await db.counterGroups.delete(id);
        })
        .then(() => {
          return { id };
        });
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id,
      };
    }
  }

  async addCounterAction(
    record: NewCounterAction
  ): Promise<StoreResponse<CounterAction>> {
    try {
      const validatedRecord = counterActionValidator.parse({
        id: genId(),
        date: new Date(),
        ...record,
      });
      const counter = await db.counters.get(validatedRecord.counterId);
      if (counter) {
        counter.currentSteps += validatedRecord.value / counter.unitsInStep;
        await db.counters.put(counter);
      } else {
        return { errorMessage: "Counter not found" };
      }
      await db.counterActions.put(validatedRecord);
      return { id: validatedRecord.id, record: validatedRecord };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async deleteCounterAction(
    id: CounterAction["id"]
  ): Promise<StoreResponse<CounterAction>> {
    try {
      const counterAction = await db.counterActions.get(id);
      if (!counterAction) {
        return { errorMessage: "Action not found", id };
      }
      const counter = await db.counters.get(counterAction.counterId);
      if (!counter) {
        return { errorMessage: "Counter not found", id: id };
      }
      const settings = await db.settings.get("0");
      return await db
        .transaction("rw", db.counters, db.counterActions, async () => {
          if (settings?.dailyStepsResetTime) {
            // check if action is in the same day.
            const [hh, mm, ss] = settings.dailyStepsResetTime.split(":");
            const tmp = dayjs().set("h", +hh).set("m", +mm).set("s", +ss);
            const dailyStepsBreakpointTime = tmp.isAfter(dayjs())
              ? tmp.subtract(1, "d")
              : tmp;
            if (dailyStepsBreakpointTime.isBefore(counterAction.date)) {
              const newCurrentSteps =
                counter.currentSteps -
                counterAction.value / counter.unitsInStep;
              await db.counters.put({
                ...counter,
                currentSteps: newCurrentSteps,
              });
            }
          }
          await db.counterActions.delete(id);
        })
        .then(() => {
          return { id };
        });
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id,
      };
    }
  }

  async deleteOldCounterActions() {
    const settings = await db.settings.get("0");
    const ttl = settings?.counterActionDaysToLive;
    if (!ttl) {
      return;
    }
    const [hh, mm, ss] = settings.dailyStepsResetTime.split(":");
    const tmp = dayjs().set("h", +hh).set("m", +mm).set("s", +ss);
    const dateLimit = tmp.isAfter(dayjs()) ? tmp.subtract(1, "d") : tmp;
    await db.counterActions.where("date").below(dateLimit.toDate()).delete();
  }

  async moveCounter(
    counterId: Counter["id"],
    afterCounterId?: Counter["id"],
    beforeCounterId?: Counter["id"]
  ): Promise<StoreResponse<Counter>> {
    const counter = await db.counters.get(counterId);
    if (!counter) {
      return { errorMessage: "Counter not found" };
    }
    let orderBefore: string | null = null;
    if (afterCounterId) {
      const afterCounter = await db.counters.get(afterCounterId);
      if (!afterCounter) {
        return { errorMessage: "After Counter not found" };
      }
      orderBefore = afterCounter.order;
    }
    let orderAfter: string | null = null;
    if (beforeCounterId) {
      const beforeCounter = await db.counters.get(beforeCounterId);
      if (!beforeCounter) {
        return { errorMessage: "Before Counter not found" };
      }
      orderAfter = beforeCounter.order;
    }
    const order = generateKeyBetween(orderBefore, orderAfter);
    const record = { ...counter, order };
    await db.counters.put(record);
    return { id: counter.id, record };
  }

  async moveCounterGroup(
    counterGroupId: CounterGroup["id"],
    afterCounterGroupId?: CounterGroup["id"],
    beforeCounterGroupId?: CounterGroup["id"]
  ): Promise<StoreResponse<CounterGroup>> {
    const counterGroup = await db.counterGroups.get(counterGroupId);
    if (!counterGroup) {
      return { errorMessage: "CounterGroup not found" };
    }
    let orderBefore: string | null = null;
    if (afterCounterGroupId) {
      const afterCounterGroup = await db.counterGroups.get(afterCounterGroupId);
      if (!afterCounterGroup) {
        return { errorMessage: "After CounterGroup not found" };
      }
      orderBefore = afterCounterGroup.order;
    }
    let orderAfter: string | null = null;
    if (beforeCounterGroupId) {
      const beforeCounterGroup =
        await db.counterGroups.get(beforeCounterGroupId);
      if (!beforeCounterGroup) {
        return { errorMessage: "Before CounterGroup not found" };
      }
      orderAfter = beforeCounterGroup.order;
    }
    const order = generateKeyBetween(orderBefore, orderAfter);
    const record = { ...counterGroup, order };
    await db.counterGroups.put(record);
    return { id: counterGroup.id, record };
  }

  async upsertSettings(record: Settings): Promise<StoreResponse<Settings>> {
    try {
      const validatedRecord = settingsValidator.parse({
        lastDailyStepsReset: dayjs().subtract(2, "d").toDate(),
        ...record,
        id: "0",
      });
      await db.settings.put(validatedRecord);
      return { record };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async clearAllCurrentSteps() {
    return await db.transaction("rw", db.counters, db.settings, async () => {
      await db.counters.toCollection().modify({ currentSteps: 0 });
      await db.settings.update("0", { lastDailyStepResetDate: new Date() });
    });
  }
}
export const store = new Store();

export function useCounter(id: Counter["id"]) {
  return useLiveQuery(() => db.counters.get(id), [id]);
}

export function useCounters(
  groupId: CounterGroup["id"] | null,
  filterByActiveDays = false
) {
  const settings = useSettings();
  const { dailyStepsResetTime, dayLabelFrom } = settings || {};

  const currentDayOfWeek = getDayOfWeek(
    new Date(),
    dailyStepsResetTime,
    dayLabelFrom
  );
  return (
    useLiveQuery(
      () =>
        typeof groupId !== "string"
          ? db.counters
              .orderBy("order")
              .and(
                ({ activeDaysOfWeek = [] }) =>
                  !filterByActiveDays ||
                  activeDaysOfWeek.includes(currentDayOfWeek)
              )
              .toArray()
          : db.counters
              .where("groupId")
              .equals(groupId || "")
              .and(
                ({ activeDaysOfWeek = [] }) =>
                  !filterByActiveDays ||
                  activeDaysOfWeek.includes(currentDayOfWeek)
              )
              .sortBy("order"),
      [groupId, filterByActiveDays]
    ) || []
  );
}

export function useCounterGroup(id: CounterGroup["id"] | null) {
  return useLiveQuery(() => (id ? db.counterGroups.get(id) : undefined), [id]);
}

export function useCounterGroups() {
  return useLiveQuery(() => db.counterGroups.orderBy("order").toArray()) || [];
}
export function useCounterActions(counterId: Counter["id"]) {
  return (
    useLiveQuery(() =>
      db.counterActions
        .where("counterId")
        .equals(counterId)
        .reverse()
        .sortBy("date")
    ) || []
  );
}

export function useSettings() {
  return useLiveQuery(() => db.settings.get("0"), []);
}
