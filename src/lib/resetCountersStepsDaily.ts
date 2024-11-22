import { CronJob } from "cron";
import { store } from "../store";

export function resetCountersStepsDaily() {
  const job = new CronJob(
    "0 0 0 * * *", // cronTime
    function () {
      console.log("resetCountersStepsDaily");
      store.clearAllCurrentSteps();
    }, // onTick
    null, // onComplete
    true, // start
    undefined,
    undefined,
    true // run on init
  );
}
