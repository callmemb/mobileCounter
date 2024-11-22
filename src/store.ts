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
} from "./definitions";
import { db } from "./store/indexDB";
import { v4 as genId } from "uuid";
import { generateKeyBetween } from "./lib/generateKeyBetween";
import dayjs from "dayjs";

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
      await db.counterActions.where("counterId").equals(id).delete();
      await db.counters.delete(id);
      return { id };
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
      const relevantCounters = await db.counters
        .where("groupId")
        .equals(`${id}`)
        .toArray();
      await Promise.all(
        relevantCounters.map((counter) => this.deleteCounter(counter.id))
      );
      await db.counterGroups.delete(id);
      return { id };
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
      if (counter) {
        if (dayjs().isSame(dayjs(counterAction.date), "day")) {
          counter.currentSteps -= counterAction.value / counter.unitsInStep;
          await db.counters.put(counter);
        }
      } else {
        return { errorMessage: "Counter not found", id: id };
      }
      await db.counterActions.delete(id);
      return { id };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id,
      };
    }
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
      await db.settings.put({ id: "0", ...record });
      return { record };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async clearAllCurrentSteps() {
    await db.counters.toCollection().modify({ currentSteps: 0 });
  }
}
export const store = new Store();

export function useCounter(id: Counter["id"]) {
  return useLiveQuery(() => db.counters.get(id), [id]);
}

export function useCounters(groupId: CounterGroup["id"] | null) {
  return (
    useLiveQuery(
      () =>
        typeof groupId !== "string"
          ? db.counters.orderBy("order").toArray()
          : db.counters
              .where("groupId")
              .equals(groupId || "")
              .and((counter) => counter.order !== undefined)
              .sortBy("order"),
      [groupId]
    ) || []
  );
}

export function useCounterGroup(id: CounterGroup["id"]) {
  return useLiveQuery(() => db.counterGroups.get(id), [id]);
}

export function useCounterGroups() {
  return useLiveQuery(() => db.counterGroups.orderBy("order").toArray()) || [];
}
// export function useCounterActions() {
//   return useLiveQuery(() => db.counterActions.toArray()) || [];
// }
