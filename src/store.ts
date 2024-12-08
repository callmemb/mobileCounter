import { useLiveQuery } from "dexie-react-hooks";
import {
  Counter,
  CounterAction,
  counterActionsByDayValidator,
  counterActionsByMonthValidator,
  counterActionValidator,
  CounterGroup,
  counterGroupValidator,
  counterValidator,
  Image,
  imageValidator,
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
import { getDate, getDayOfWeek, isDaysTheSame } from "./lib/dates";

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
          await db.counters.where("groupId").equals(`${id}`).delete();
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
      await db.transaction(
        "rw",
        [
          db.counters,
          db.counterActions,
          db.counterActionsByDay,
          db.counterActionsByMonth,
          db.settings,
        ],
        async () => {
          const counter = await db.counters.get(validatedRecord.counterId);
          if (!counter) {
            return { errorMessage: "Counter not found" };
          }
          counter.currentSteps += validatedRecord.value / counter.unitsInStep;
          await db.counters.put(counter);
          await db.counterActions.put(validatedRecord);
          await handleActionAggregation(validatedRecord);
        }
      );
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
        .transaction(
          "rw",
          [
            db.counters,
            db.counterActions,
            db.counterActionsByDay,
            db.counterActionsByMonth,
            db.settings,
          ],
          async () => {
            await handleActionAggregation(counterAction, true);
            if (
              isDaysTheSame(
                new Date(),
                counterAction.date,
                settings?.dailyStepsResetTime || "0:0:0"
              )
            ) {
              const newCurrentSteps =
                counter.currentSteps -
                counterAction.value / counter.unitsInStep;
              await db.counters.put({
                ...counter,
                currentSteps: newCurrentSteps,
              });
            }

            await db.counterActions.delete(id);
          }
        )
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

  /**
   * Deletes all counter actions older than the number of days specified in the settings
   * Does not touch any aggregated values.
   */
  async deleteOldCounterActions() {
    const settings = await db.settings.get("0");
    if (!(settings?.counterActionDaysToLive && settings?.dailyStepsResetTime)) {
      return;
    }
    const ttl = settings?.counterActionDaysToLive;
    const [hh, mm, ss] = settings.dailyStepsResetTime.split(":");
    const tmp = dayjs().set("h", +hh).set("m", +mm).set("s", +ss);
    const dateLimit = (tmp.isAfter(dayjs()) ? tmp : tmp.add(1, "d")).add(
      ttl,
      "d"
    );
    // Dexie might have a bug, comparing above and below works in reverse
    await db.counterActions.where("date").above(dateLimit.toDate()).delete();
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

  async getSettings(): Promise<Settings | undefined> {
    return db.settings.get("0");
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

  async addImage(file: File): Promise<StoreResponse<Image>> {
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const validatedRecord = imageValidator.parse({
        id: genId(),
        name: file.name,
        data: base64Data,
        uploadedAt: new Date(),
      });
      await db.images.put(validatedRecord);
      return { id: validatedRecord.id, record: validatedRecord };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async deleteImage(id: Image["id"]): Promise<StoreResponse<Image>> {
    try {
      const connectedCounter = await db.counters
        .where("faceImageId")
        .equals(id)
        .first();

      if (connectedCounter) {
        return {
          errorMessage:
            "Cannot delete image - it is used as an icon by one or more counters",
          id,
        };
      }

      await db.images.delete(id);
      return { id };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id,
      };
    }
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
    useLiveQuery(async () => {
      const result = groupId
        ? await db.counters
            .where("groupId")
            .equals(groupId)
            .and(
              ({ activeDaysOfWeek = [] }) =>
                !filterByActiveDays ||
                activeDaysOfWeek.includes(currentDayOfWeek)
            )
            .toArray()
        : await db.counters
            .orderBy("order")
            .and(
              ({ activeDaysOfWeek = [] }) =>
                !filterByActiveDays ||
                activeDaysOfWeek.includes(currentDayOfWeek)
            )
            .toArray();

      return result || [];
    }, [groupId, filterByActiveDays]) || []
  );
}

export function useCounterGroup(id: CounterGroup["id"] | null) {
  return useLiveQuery(() => (id ? db.counterGroups.get(id) : undefined), [id]);
}

export function useCounterGroups() {
  return (
    useLiveQuery(
      async () => await db.counterGroups.orderBy("order").toArray(),
      []
    ) || []
  );
}
export function useCounterActions(counterId: Counter["id"]) {
  return (
    useLiveQuery(
      async () =>
        await db.counterActions
          .where("counterId")
          .equals(counterId)
          .reverse()
          .toArray(),
      [counterId]
    ) || []
  );
}

export function useImage(id: Image["id"] | undefined) {
  return useLiveQuery(() => (id ? db.images.get(id) : undefined), [id]);
}

export function useImages(name?: Image["name"], page = 1, itemsPerPage = 9) {
  return (
    useLiveQuery(async () => {
      const collection = name
        ? db.images.filter((image) =>
            image.name.toLowerCase().includes(name.toLowerCase())
          )
        : db.images;

      const offset = (page - 1) * itemsPerPage;
      const images = await collection
        .offset(offset)
        .limit(itemsPerPage + 1) // Get one extra to check if there's more
        .toArray();

      const hasMore = images.length > itemsPerPage;
      return {
        images: images.slice(0, itemsPerPage),
        hasMore,
      };
    }, [name, page, itemsPerPage]) || { images: [], hasMore: false }
  );
}

export function useCounterActionsByDay(counterId: Counter["id"]) {
  return (
    useLiveQuery(async () => {
      return await db.counterActionsByDay
        .where("counterId")
        .equals(counterId)
        .reverse()
        .toArray();
    }, [counterId]) || []
  );
}
export function useCounterActionsByMonth(counterId: Counter["id"]) {
  return (
    useLiveQuery(async () => {
      return await db.counterActionsByMonth
        .where("counterId")
        .equals(counterId)
        .reverse()
        .toArray();
    }, [counterId]) || []
  );
}

export function useSettings() {
  return useLiveQuery(() => db.settings.get("0"), []);
}

async function handleActionAggregation(
  action: CounterAction,
  remove: boolean = false
) {
  const settings = await db.settings.get("0");
  const day = getDate(
    action.date,
    settings?.dailyStepsResetTime,
    settings?.dayLabelFrom,
    "YYYY-MM-DD"
  );
  const month = getDate(
    action.date,
    settings?.dailyStepsResetTime,
    settings?.dayLabelFrom,
    "YYYY-MM"
  );

  const value = remove ? -action.value : action.value;
  const dayRecord = await db.counterActionsByDay
    .where({ day: day, counterId: action.counterId })
    .first();
  const newDay = counterActionsByDayValidator.parse({
    ...dayRecord,
    day: day,
    counterId: action.counterId,
    value: (dayRecord?.value || 0) + value,
  });
  db.counterActionsByDay.put(newDay);
  const monthRecord = await db.counterActionsByMonth
    .where({ month: month, counterId: action.counterId })
    .first();
  const newMonth = counterActionsByMonthValidator.parse({
    ...monthRecord,
    month: month,
    counterId: action.counterId,
    value: (monthRecord?.value || 0) + value,
  });
  db.counterActionsByMonth.put(newMonth);
}
