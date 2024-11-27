import { useEffect } from "react";
import { store, useSettings } from "../store";
import { CronJob } from "cron";
import { isDaysTheSame } from "../lib/dates";

export default function SettingsManager() {
  const settings = useSettings();

  useEffect(() => {
    // reset daily steps
    if (!settings?.dailyStepsResetTime) return;
    const { dailyStepsResetTime, lastDailyStepResetDate } = settings || {};
    const [hh, mm, ss] = dailyStepsResetTime.split(":");
    const job = new CronJob(
      `${ss} ${mm} ${hh} * * *`, // cronTime
      function () {
        if (
          !lastDailyStepResetDate ||
          !isDaysTheSame(
            new Date(),
            lastDailyStepResetDate,
            dailyStepsResetTime
          )
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
