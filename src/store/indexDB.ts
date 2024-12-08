// db.ts
import Dexie, { type EntityTable } from "dexie";

import {
  Counter,
  CounterAction,
  CounterActionsByDay,
  CounterActionsByMonth,
  CounterGroup,
  Settings,
  Image,
} from "../definitions";

const db = new Dexie("CountersDatabase") as Dexie & {
  counters: EntityTable<Counter, "id">;
  counterGroups: EntityTable<CounterGroup, "id">;
  counterActions: EntityTable<CounterAction, "id">;
  counterActionsByDay: EntityTable<CounterActionsByDay, "counterId">;
  counterActionsByMonth: EntityTable<CounterActionsByMonth, "counterId">;
  settings: EntityTable<Settings, "id">;
  images: EntityTable<Image, "id">;
};

db.version(1).stores({
  counters: "id, [groupId+order], order, faceImageId",
  counterGroups: "id, order",
  counterActions: "id, date, [counterId+date]",
  counterActionsByDay: "[counterId+day]",
  counterActionsByMonth: "[counterId+month]",
  settings: "id",
  images: "id, name", 
});

export { db };
