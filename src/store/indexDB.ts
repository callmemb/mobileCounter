// db.ts
import Dexie, { type EntityTable } from "dexie";
import { v4 as genId } from 'uuid';

import { Counter } from "../definitions";

const db = new Dexie("CountersDatabase") as Dexie & {
  counters: EntityTable<
    Counter,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  counters: "++id", // primary key "id" (for the runtime!)
  // counters: "$$uuid"
});

export { db };
