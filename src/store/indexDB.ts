// db.ts
import Dexie, { type EntityTable } from "dexie";

import { Counter, CounterAction, CounterGroup, Settings } from "../definitions";

const db = new Dexie("CountersDatabase") as Dexie & {
  counters: EntityTable<Counter, "id">;
  counterGroups: EntityTable<CounterGroup, "id">;
  counterActions: EntityTable<CounterAction, "id">;
  settings: EntityTable<Settings, "id">;
};

// Schema declaration:
db.version(1).stores({
  counters: "id, groupId, order",
  counterGroups: "id, order",
  counterActions: "id, date, counterId",
  settings: "id",
});

export { db };
