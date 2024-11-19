// db.ts
import Dexie, { type EntityTable } from "dexie";

import { Counter, CounterAction, CounterGroup } from "../definitions";

const db = new Dexie("CountersDatabase") as Dexie & {
  counters: EntityTable<Counter, "id">;
  counterGroups: EntityTable<CounterGroup, "id">;
  counterActions: EntityTable<CounterAction, "id">;
};

// Schema declaration:
db.version(1).stores({
  counters: "id, groupId, order", // simple primary key, no auto-increment
  counterGroups: "id, order", // simple primary key, no auto-increment
  counterActions: "id, date, counterId", // simple primary key, no auto-increment
});

export { db };
