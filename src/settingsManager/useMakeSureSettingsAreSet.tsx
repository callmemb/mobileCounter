import { useEffect } from "react";
import { store } from "../store";

const useMakeSureSettingsAreSet = () => {
  useEffect(() => {
    store.getSettings().then((settings) => {
      if (!settings) {
        store.upsertSettings({
          dailyStepsResetTime: "00:00:00",
          dayLabelFrom: "startOfRange",
          counterActionDaysToLive: 7,
          counterDayAggregatesDaysToLive: 30,
          counterMonthAggregatesMonthsToLive: 12,
        });
      }
    });
  }, []);
};

export default useMakeSureSettingsAreSet;
