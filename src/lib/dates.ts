import dayjs from "dayjs";
import { Settings } from "../definitions";

export function isDaysTheSame(
  day1: Date,
  day2: Date,
  breakPointTime: Settings["dailyStepsResetTime"] = "00:00:00"
) {
  const [hh, mm, ss] = breakPointTime.split(":");

  // Create reference point for day1
  const breakPoint1 = dayjs(day1)
    .set("hour", +hh)
    .set("minute", +mm)
    .set("second", +ss);

  // Adjust break point to previous day if time is before break point
  const referencePoint = dayjs(day1).isBefore(breakPoint1)
    ? breakPoint1.subtract(1, "day")
    : breakPoint1;

  // Check if day2 falls between reference point and next break point
  const nextBreakPoint = referencePoint.add(1, "day");
  return (
    dayjs(day2).isAfter(referencePoint) && dayjs(day2).isBefore(nextBreakPoint)
  );
}

export function getLastBreakPointDate(
  date: Date,
  breakPointTime: Settings["dailyStepsResetTime"] = "00:00:00",
  labelFrom: Settings["dayLabelFrom"] = "startOfRange"
): Date {
  const [hh, mm, ss] = breakPointTime.split(":");
  return dayjs(date)
    .add(breakPointTime > dayjs(date).format("HH:mm:ss") ? -1 : 0, "d")
    .add(labelFrom === "endOfRange" ? 1 : 0, "d")
    .set("hour", +hh)
    .set("minute", +mm)
    .set("second", +ss)
    .toDate();
}

export function getStringDate(
  date: Date,
  breakPointTime: Settings["dailyStepsResetTime"] = "00:00:00",
  labelFrom: Settings["dayLabelFrom"] = "startOfRange",
  format: string = "DD-MM-YYYY"
): string {
  return dayjs(date)
    .add(breakPointTime > dayjs(date).format("HH:mm:ss") ? -1 : 0, "d")
    .add(labelFrom === "endOfRange" ? 1 : 0, "d")
    .format(format);
}

export function getDayOfWeek(
  date: Date,
  breakPointTime: Settings["dailyStepsResetTime"] = "0:0:0",
  labelFrom: Settings["dayLabelFrom"] = "startOfRange"
): number {
  return dayjs(date)
    .add(breakPointTime > dayjs(date).format("HH:mm:ss") ? -1 : 0, "d")
    .add(labelFrom === "endOfRange" ? 1 : 0, "d")
    .day();
}
