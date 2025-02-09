// import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
// import { Store } from "./store";
// import { v4 as uuid } from "uuid";

// vi.mock("./lib/dates", () => ({
//   getStringDate: vi.fn((date) => date.toISOString().split("T")[0]),
//   getDayOfWeek: vi.fn(() => 1),
//   isDaysTheSame: vi.fn(() => true),
// }));

// describe("Store", () => {
//   let store: Store;

//   beforeEach(() => {
//     store = new Store(`test-${uuid()}`);
//     // vi.useFakeTimers();
//   });

//   afterEach(async () => {
//     await store.db.delete();
//     // vi.useRealTimers();
//     vi.clearAllMocks();
//   });

//   describe("Counter operations", () => {
//     it("should create new counter", async () => {
//       const group = await store.upsertSettings({
//         dailyStepsResetTime: "00:00:00",
//         dayLabelFrom: "startOfRange",
//         counterActionDaysToLive: 7,
//         counterDayAggregatesDaysToLive: 30,
//         counterMonthAggregatesMonthsToLive: 12,
//       });
//       const r = await store.db.settings.toArray();
//       console.log( r);

//       // const result = await store.upsertCounter({
//       //   name: "Test Counter",
//       //   groupId: group.id!,
//       //   unitsInStep: 1,
//       // });

//       // expect(result.errorMessage).toBeUndefined();
//       // expect(result.id).toBeTruthy();
//       // expect(result.record).toMatchObject({
//       //   name: "Test Counter",
//       //   groupId: group.id,
//       //   currentSteps: 0,
//       // });
//     });
//   });
// });
