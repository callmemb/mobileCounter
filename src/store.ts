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
} from "./definitions";
import { db } from "./store/indexDB";
import { v4 as genId } from "uuid";
import { generateKeyBetween } from "./lib/generateKeyBetween";

type StoreResponse = {
  errorMessage?: string;
  id?: string;
};

class Store {
  async upsertCounter(record: NewCounter | Counter): Promise<StoreResponse> {
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
      return { id: validatedRecord.id };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id: "id" in record ? record.id : undefined,
      };
    }
  }
  async deleteCounter(id: Counter["id"]): Promise<StoreResponse> {
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
  ): Promise<StoreResponse> {
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
      return { id: validatedRecord.id };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id: "id" in record ? record.id : undefined,
      };
    }
  }
  async deleteCounterGroup(id: CounterGroup["id"]): Promise<StoreResponse> {
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
    record: NewCounterAction | CounterAction
  ): Promise<StoreResponse> {
    try {
      const id = "id" in record ? record.id : genId();
      const validatedRecord = counterActionValidator.parse({
        ...record,
        id,
      });
      const counter = await db.counters.get(validatedRecord.counterId);
      if (counter) {
        counter.currentSteps += validatedRecord.value / counter.unitsInStep;
        await db.counters.put(counter);
      } else {
        return { errorMessage: "Counter not found", id: validatedRecord.id };
      }
      await db.counterActions.put(validatedRecord);
      return { id: validatedRecord.id };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id: "id" in record ? record.id : undefined,
      };
    }
  }

  async deleteCounterAction(id: CounterAction["id"]): Promise<StoreResponse> {
    try {
      const counterAction = await db.counterActions.get(id);
      if (!counterAction) {
        return { errorMessage: "Action not found", id };
      }
      const counter = await db.counters.get(counterAction.counterId);
      if (counter) {
        counter.currentSteps += counterAction.value / counter.unitsInStep;
        await db.counters.put(counter);
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

  async addValueToCounter(
    id: Counter["id"],
    value: number
  ): Promise<StoreResponse> {
    try {
      const counter = await db.counters.get(id);
      if (!counter || !id) {
        return { errorMessage: "Counter not found", id };
      }
      counter.currentSteps += value / counter.unitsInStep;
      const action = {
        counterId: id,
        value,
        date: new Date(),
      };
      await this.upsertCounter(counter);
      const actionId = await this.addCounterAction(action);
      return { id: actionId.id };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id,
      };
    }
  }

  async removeActionFromCounter(
    id: CounterAction["id"]
  ): Promise<StoreResponse> {
    try {
      if (!id) {
        return { errorMessage: "No action ID provided" };
      }
      const action = await db.counterActions.get(id);
      if (!action) {
        return { errorMessage: "Action not found", id };
      }
      const counter = await db.counters.get(action.counterId);
      if (!counter) {
        return { errorMessage: "Counter not found", id };
      }
      const editedCounter = {
        ...counter,
        currentSteps: action.value / counter.unitsInStep,
      };
      await this.upsertCounter(editedCounter);
      await this.deleteCounterAction(id);
      return { id };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id,
      };
    }
  }

  async moveCounter(after:string,before:string){
    const afterCounter = await db.counters.get(after);
    const beforeCounter = await db.counters.get(before);
    if(!afterCounter || !beforeCounter){
      return {errorMessage:"Counter not found"};
    }
    const order = generateKeyBetween(afterCounter.order,beforeCounter.order);
    afterCounter.order = order;
    await db.counters.put(afterCounter);
    return {id:after};

  }
}

export const store = new Store();

export function useCounters(groupId: CounterGroup["id"] | null) {
  return (
    useLiveQuery(
      () =>
        typeof groupId !== "string"
          ? db.counters.toArray()
          : db.counters
              .where("groupId")
              .equals(groupId || "")
              .toArray(),
      [groupId]
    ) || []
  );
}
export function useCounterGroups() {
  return useLiveQuery(() => db.counterGroups.toArray()) || [];
}
// export function useCounterActions() {
//   return useLiveQuery(() => db.counterActions.toArray()) || [];
// }
