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
db.version(2).stores({
  counters: "id, [groupId+order], order ",
  counterGroups: "id, order",
  counterActions: "id, date, [counterId+date]",
  settings: "id",
});

export { db };
