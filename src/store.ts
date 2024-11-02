import { useLiveQuery } from "dexie-react-hooks";
import { Counter, counterValidator } from "./definitions";
import { db } from "./store/indexDB";

class Store {
  async upsertCounter(record: Counter) {
    await counterValidator.parse(record);
    return await db.counters.put(record);
  }

  async addValueToCounter(id: number, value: number) {
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
