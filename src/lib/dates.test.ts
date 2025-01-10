import { describe, expect, test } from "vitest";
import {
  isDaysTheSame,
  getLastBreakPointDate,
  getStringDate,
  getDayOfWeek,
} from "./dates";
import dayjs from "dayjs";

describe("dates utility functions", () => {
  const breakPointTime = "12:00:00";
  const labelFrom = "startOfRange";

  test("isDaysTheSame should return true for same day", () => {
    const day1 = new Date("2023-10-10T11:00:00");
    const day2 = new Date("2023-10-10T10:00:00");
    expect(isDaysTheSame(day1, day2, breakPointTime)).toBe(true);
  });

  test("isDaysTheSame should return false for same day in but on the other side of breakpoint", () => {
    const day1 = new Date("2023-10-10T11:00:00");
    const day2 = new Date("2023-10-10T13:00:00");
    expect(isDaysTheSame(day1, day2, breakPointTime)).toBe(false);
  });

  test("isDaysTheSame should return false for different days", () => {
    const day1 = new Date("2023-10-10T11:00:00");
    const day2 = new Date("2023-10-11T13:00:00");
    expect(isDaysTheSame(day1, day2, breakPointTime)).toBe(false);
  });

  test("getLastBreakPointDate should return correct date day before", () => {
    const date = new Date("2023-10-10T11:00:00");
    const [hh, mm, ss] = breakPointTime.split(":");
    const expectedDate = dayjs(date)
      .subtract(1, "day")
      .set("hour", +hh)
      .set("minute", +mm)
      .set("second", +ss)
      .toDate();
    expect(getLastBreakPointDate(date, breakPointTime, labelFrom)).toEqual(
      expectedDate
    );
  });

  test("getLastBreakPointDate should return same day correct date", () => {
    const date = new Date("2023-10-10T16:00:00");
    const [hh, mm, ss] = breakPointTime.split(":");
    const expectedDate = dayjs(date)
      .set("hour", +hh)
      .set("minute", +mm)
      .set("second", +ss)
      .toDate();
    expect(getLastBreakPointDate(date, breakPointTime, labelFrom)).toEqual(
      expectedDate
    );
  });


  test("getStringDate should return correct formatted date", () => {
    const date = new Date("2023-10-10T11:00:00");
    const expectedDate = dayjs(date).subtract(1, "day").format("DD-MM-YYYY");
    expect(getStringDate(date, breakPointTime, labelFrom)).toBe(expectedDate);
  });

  test("getDayOfWeek should return correct day of the week", () => {
    const date = new Date("2023-10-10T11:00:00");
    const expectedDay = dayjs(date).subtract(1, "day").day();
    expect(getDayOfWeek(date, breakPointTime, labelFrom)).toBe(expectedDay);
  });
});
