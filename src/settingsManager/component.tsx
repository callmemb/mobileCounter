import { useEffect } from "react";
import { store, useSettings } from "../store";
import { CronJob } from "cron";
import dayjs from "dayjs";

export default function SettingsManager() {
  const settings = useSettings();

  useEffect(() => { // reset daily steps
    if (!settings?.dailyStepsResetTime) return;
    const { dailyStepsResetTime, lastDailyStepResetDate } = settings || {};
    const [hh, mm, ss] = dailyStepsResetTime.split(":");
    const tmp = dayjs().set("h", +hh).set("m", +mm).set("s", +ss);
    const dailyStepsBreakpointTime = tmp.isAfter(dayjs())
      ? tmp.subtract(1, "d")
      : tmp;
    const cronTime = `${ss} ${mm} ${hh} * * *`;
    const job = new CronJob(
      cronTime, // cronTime
      function () {
        if (
          !lastDailyStepResetDate ||
          dailyStepsBreakpointTime.isAfter(dayjs(lastDailyStepResetDate))
        ) {
          console.log("resetCountersStepsDaily");
          store.clearAllCurrentSteps();
        }
      }, // onTick
      null, // onComplete
      true, // start
      undefined,
      undefined,
      true // run on init
    );
    return () => job.stop();
  }, [settings]);

  return null;
}
