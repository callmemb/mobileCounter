import { useLiveQuery } from "dexie-react-hooks";
import { Counter, counterValidator } from "./definitions";
import { db } from "./store/indexDB";
import { v4 as genId } from "uuid";

class Store {
  async upsertCounter(record: Counter) {
    if (!record.id) record.id = genId();
    await counterValidator.parse(record);
    return await db.counters.put(record);
  }

  async addValueToCounter(id: string, value: number) {
    const counter = await db.counters.get(id);
    if (!counter) return;
    counter.currentSteps += value;
    await this.upsertCounter(counter);
  }
}

export const store = new Store();

export function useCounters() {
  return useLiveQuery(() => db.counters.toArray()) || [];
}
