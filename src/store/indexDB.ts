// db.ts
import Dexie, { type EntityTable } from "dexie";

import { Counter } from "../definitions";

const db = new Dexie("CountersDatabase") as Dexie & {
  counters: EntityTable<
    Counter,
    "id" 
  >;
};

// Schema declaration:
db.version(1).stores({
  counters: "id"  // simple primary key, no auto-increment
});

export { db };
