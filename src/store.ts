/* eslint-disable react-hooks/rules-of-hooks */
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
import { createDB, DB } from "./store/indexDB";
import { v4 as genId } from "uuid";
import { generateKeyBetween } from "./lib/generateKeyBetween";
import dayjs from "dayjs";
import { getStringDate, getDayOfWeek, isDaysTheSame } from "./lib/dates";

type StoreResponse<T> = {
  errorMessage?: string;
  id?: T extends { id: string } ? T["id"] : string;
  record?: T;
};

export class Store {
  db: DB;

  constructor(name?: string) {
    this.db = createDB(name);
  }

  async upsertCounter(
    record: NewCounter | Counter
  ): Promise<StoreResponse<Counter>> {
    try {
      let defaults = {};
      if (!("id" in record)) {
        const firstCounter =
          (await this.db.counters.limit(1).first())?.order || null;
        const order = generateKeyBetween(null, firstCounter);
        defaults = { id: genId(), order: order, currentSteps: 0 };
      }
      const validatedRecord = counterValidator.parse({
        ...record,
        ...defaults,
      });
      const group = await this.db.counterGroups.get(validatedRecord.groupId);
      if (!group) {
        return {
          errorMessage: "Group not found",
          id: "id" in record ? record.id : undefined,
        };
      }
      await this.db.counters.put(validatedRecord);
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
      return await this.db
        .transaction(
          "rw",
          [
            this.db.counterActions,
            this.db.counters,
            this.db.counterActionsByDay,
            this.db.counterActionsByMonth,
          ],
          async () => {
            await this.db.counterActions.where("counterId").equals(id).delete();
            await this.db.counterActionsByDay
              .where("counterId")
              .equals(id)
              .delete();
            await this.db.counterActionsByMonth
              .where("counterId")
              .equals(id)
              .delete();
            await this.db.counters.delete(id);
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
  async upsertCounterGroup(
    record: NewCounterGroup | CounterGroup
  ): Promise<StoreResponse<CounterGroup>> {
    try {
      let defaults = {};
      if (!("id" in record)) {
        const firstCounter =
          (await this.db.counterGroups.limit(1).first())?.order || null;
        const order = generateKeyBetween(null, firstCounter);
        defaults = { id: genId(), order: order };
      }
      const validatedRecord = counterGroupValidator.parse({
        ...record,
        ...defaults,
      });
      await this.db.counterGroups.put(validatedRecord);
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
      return await this.db
        .transaction(
          "rw",
          [
            this.db.counters,
            this.db.counterGroups,
            this.db.counterActions,
            this.db.counterActionsByDay,
            this.db.counterActionsByMonth,
          ],
          async () => {
            const counters = await this.db.counters
              .where("groupId")
              .equals(id)
              .toArray();
            for (const counter of counters) {
              await this.deleteCounter(counter.id);
            }
            await this.db.counterGroups.delete(id);
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

  async addCounterAction(
    record: NewCounterAction
  ): Promise<StoreResponse<CounterAction>> {
    try {
      const validatedRecord = counterActionValidator.parse({
        id: genId(),
        date: new Date(),
        ...record,
      });
      await this.db.transaction(
        "rw",
        [
          this.db.counters,
          this.db.counterActions,
          this.db.counterActionsByDay,
          this.db.counterActionsByMonth,
          this.db.settings,
        ],
        async () => {
          const counter = await this.db.counters.get(validatedRecord.counterId);
          if (!counter) {
            return { errorMessage: "Counter not found" };
          }
          counter.currentSteps += validatedRecord.value / counter.unitsInStep;
          await this.db.counters.put(counter);
          await this.db.counterActions.put(validatedRecord);
          await handleActionAggregation(this.db, validatedRecord);
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
      const counterAction = await this.db.counterActions.get(id);
      if (!counterAction) {
        return { errorMessage: "Action not found", id };
      }
      const counter = await this.db.counters.get(counterAction.counterId);
      if (!counter) {
        return { errorMessage: "Counter not found", id: id };
      }
      const settings = await this.db.settings.get("0");
      return await this.db
        .transaction(
          "rw",
          [
            this.db.counters,
            this.db.counterActions,
            this.db.counterActionsByDay,
            this.db.counterActionsByMonth,
            this.db.settings,
          ],
          async () => {
            await handleActionAggregation(this.db, counterAction, true);
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
              await this.db.counters.put({
                ...counter,
                currentSteps: newCurrentSteps,
              });
            }

            await this.db.counterActions.delete(id);
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

  async moveCounter(
    counterId: Counter["id"],
    afterCounterId?: Counter["id"],
    beforeCounterId?: Counter["id"]
  ): Promise<StoreResponse<Counter>> {
    const counter = await this.db.counters.get(counterId);
    if (!counter) {
      return { errorMessage: "Counter not found" };
    }
    let orderBefore: string | null = null;
    if (afterCounterId) {
      const afterCounter = await this.db.counters.get(afterCounterId);
      if (!afterCounter) {
        return { errorMessage: "After Counter not found" };
      }
      orderBefore = afterCounter.order;
    }
    let orderAfter: string | null = null;
    if (beforeCounterId) {
      const beforeCounter = await this.db.counters.get(beforeCounterId);
      if (!beforeCounter) {
        return { errorMessage: "Before Counter not found" };
      }
      orderAfter = beforeCounter.order;
    }
    const order = generateKeyBetween(orderBefore, orderAfter);
    const record = { ...counter, order };
    await this.db.counters.put(record);
    return { id: counter.id, record };
  }

  async moveCounterGroup(
    counterGroupId: CounterGroup["id"],
    afterCounterGroupId?: CounterGroup["id"],
    beforeCounterGroupId?: CounterGroup["id"]
  ): Promise<StoreResponse<CounterGroup>> {
    const counterGroup = await this.db.counterGroups.get(counterGroupId);
    if (!counterGroup) {
      return { errorMessage: "CounterGroup not found" };
    }
    let orderBefore: string | null = null;
    if (afterCounterGroupId) {
      const afterCounterGroup =
        await this.db.counterGroups.get(afterCounterGroupId);
      if (!afterCounterGroup) {
        return { errorMessage: "After CounterGroup not found" };
      }
      orderBefore = afterCounterGroup.order;
    }
    let orderAfter: string | null = null;
    if (beforeCounterGroupId) {
      const beforeCounterGroup =
        await this.db.counterGroups.get(beforeCounterGroupId);
      if (!beforeCounterGroup) {
        return { errorMessage: "Before CounterGroup not found" };
      }
      orderAfter = beforeCounterGroup.order;
    }
    const order = generateKeyBetween(orderBefore, orderAfter);
    const record = { ...counterGroup, order };
    await this.db.counterGroups.put(record);
    return { id: counterGroup.id, record };
  }

  async getSettings(): Promise<Settings | undefined> {
    return this.db.settings.get("0");
  }

  async upsertSettings(record: Settings): Promise<StoreResponse<Settings>> {
    try {
      const validatedRecord = settingsValidator.parse({
        lastDailyStepsReset: dayjs().subtract(2, "d").toDate(),
        ...record,
        id: "0",
      });
      await this.db.settings.put(validatedRecord);
      return { record };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
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
      await this.db.images.put(validatedRecord);
      return { id: validatedRecord.id, record: validatedRecord };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async deleteImage(id: Image["id"]): Promise<StoreResponse<Image>> {
    try {
      const connectedCounter = await this.db.counters
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

      await this.db.images.delete(id);
      return { id };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        id,
      };
    }
  }

  async clearAllCurrentSteps() {
    return await this.db.transaction(
      "rw",
      this.db.counters,
      this.db.settings,
      async () => {
        await this.db.counters.toCollection().modify({ currentSteps: 0 });
        await this.db.settings.update("0", {
          lastDailyStepResetDate: new Date(),
        });
      }
    );
  }

  /**
   * Deletes all counter actions older than the number of days specified in the settings
   * Does not touch any aggregated values.
   */
  async deleteOldCounterActions() {
    const settings = await this.db.settings.get("0");
    if (!(settings?.counterActionDaysToLive && settings?.dailyStepsResetTime)) {
      return;
    }
    const ttl = settings?.counterActionDaysToLive;
    const [hh, mm, ss] = settings.dailyStepsResetTime.split(":");
    const currentDay = getStringDate(
      new Date(),
      settings.dailyStepsResetTime,
      settings.dayLabelFrom,
      "YYYY-MM-DD"
    );
    const breakPoint = dayjs(
      `${currentDay} ${hh}:${mm}:${ss}`,
      "YYYY-MM-DD HH:mm:ss"
    ).subtract(ttl, "day");
    await this.db.counterActions
      .where("date")
      .below(breakPoint.toDate())
      .delete();
  }

  async deleteOldAggregations() {
    const settings = await this.db.settings.get("0");
    if (
      !(
        settings?.counterDayAggregatesDaysToLive &&
        settings?.counterMonthAggregatesMonthsToLive
      )
    ) {
      return;
    }
  }

  useCounter(id: Counter["id"]) {
    return useLiveQuery(() => this.db.counters.get(id), [id]);
  }

  useCounters(groupId: CounterGroup["id"] | null, filterByActiveDays = false) {
    const settings = this.useSettings();
    const { dailyStepsResetTime, dayLabelFrom } = settings || {};

    const currentDayOfWeek = getDayOfWeek(
      new Date(),
      dailyStepsResetTime,
      dayLabelFrom
    );
    return (
      useLiveQuery(async () => {
        const result = groupId
          ? await this.db.counters
              .where("groupId")
              .equals(groupId)
              .and(
                ({ activeDaysOfWeek = [] }) =>
                  !filterByActiveDays ||
                  activeDaysOfWeek.includes(currentDayOfWeek)
              )
              .toArray()
          : await this.db.counters
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

  useCounterGroup(id: CounterGroup["id"] | null) {
    return useLiveQuery(
      () => (id ? this.db.counterGroups.get(id) : undefined),
      [id]
    );
  }

  useCounterGroups() {
    return (
      useLiveQuery(
        async () => await this.db.counterGroups.orderBy("order").toArray(),
        []
      ) || []
    );
  }

  useCounterActions(counterId: Counter["id"]) {
    return (
      useLiveQuery(
        async () =>
          await this.db.counterActions
            .where("counterId")
            .equals(counterId)
            .reverse()
            .toArray(),
        [counterId]
      ) || []
    );
  }

  useImage(id: Image["id"] | undefined) {
    return useLiveQuery(() => (id ? this.db.images.get(id) : undefined), [id]);
  }

  useImages(name?: Image["name"], page = 1, itemsPerPage = 9) {
    return (
      useLiveQuery(async () => {
        const collection = name
          ? this.db.images.filter((image) =>
              image.name.toLowerCase().includes(name.toLowerCase())
            )
          : this.db.images;

        const offset = (page - 1) * itemsPerPage;
        const images = await collection
          .offset(offset)
          .limit(itemsPerPage + 1)
          .toArray();

        const hasMore = images.length > itemsPerPage;
        return {
          images: images.slice(0, itemsPerPage),
          hasMore,
        };
      }, [name, page, itemsPerPage]) || { images: [], hasMore: false }
    );
  }

  useCounterActionsByDay(counterId: Counter["id"]) {
    return (
      useLiveQuery(async () => {
        return await this.db.counterActionsByDay
          .where("counterId")
          .equals(counterId)
          .reverse()
          .toArray();
      }, [counterId]) || []
    );
  }

  useCounterActionsByMonth(counterId: Counter["id"]) {
    return (
      useLiveQuery(async () => {
        return await this.db.counterActionsByMonth
          .where("counterId")
          .equals(counterId)
          .reverse()
          .toArray();
      }, [counterId]) || []
    );
  }

  useSettings() {
    return useLiveQuery(() => this.db.settings.get("0"), []);
  }

  deleteAllData() {
    return this.db.delete();
  }

  // New backup functionality: create a JSON backup of all tables.
  async createBackup(): Promise<{ backupData?: string; errorMessage?: string }> {
    try {
      const backup = {
        counters: await this.db.counters.toArray(),
        counterGroups: await this.db.counterGroups.toArray(),
        counterActions: await this.db.counterActions.toArray(),
        counterActionsByDay: await this.db.counterActionsByDay.toArray(),
        counterActionsByMonth: await this.db.counterActionsByMonth.toArray(),
        images: await this.db.images.toArray(),
        settings: await this.db.settings.toArray(),
      };
      return { backupData: JSON.stringify(backup) };
    } catch (error) {
      return { errorMessage: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // New restore functionality: import data from a backup JSON string.
  async importBackup(backupData: string): Promise<{ success: boolean; errorMessage?: string }> {
    try {
      const backup = JSON.parse(backupData);
      await this.db.transaction(
        "rw",
        [
          this.db.counters,
          this.db.counterGroups,
          this.db.counterActions,
          this.db.counterActionsByDay,
          this.db.counterActionsByMonth,
          this.db.images,
          this.db.settings,
        ],
        async () => {
          // Clear all tables.
          await Promise.all([
            this.db.counters.clear(),
            this.db.counterGroups.clear(),
            this.db.counterActions.clear(),
            this.db.counterActionsByDay.clear(),
            this.db.counterActionsByMonth.clear(),
            this.db.images.clear(),
            this.db.settings.clear(),
          ]);
          // Bulk import backup data.
          await Promise.all([
            this.db.counters.bulkPut(backup.counters),
            this.db.counterGroups.bulkPut(backup.counterGroups),
            this.db.counterActions.bulkPut(backup.counterActions),
            this.db.counterActionsByDay.bulkPut(backup.counterActionsByDay),
            this.db.counterActionsByMonth.bulkPut(backup.counterActionsByMonth),
            this.db.images.bulkPut(backup.images),
            this.db.settings.bulkPut(backup.settings),
          ]);
        }
      );
      return { success: true };
    } catch (error) {
      return { success: false, errorMessage: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}

export const store = new Store();

async function handleActionAggregation(
  db: DB,
  action: CounterAction,
  remove: boolean = false
) {
  const settings = await db.settings.get("0");
  const day = getStringDate(
    action.date,
    settings?.dailyStepsResetTime,
    settings?.dayLabelFrom,
    "YYYY-MM-DD"
  );
  const month = getStringDate(
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
