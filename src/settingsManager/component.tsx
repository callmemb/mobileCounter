
import { store } from "../store";
import useCleanOldCounterActions from "./useCleanOldCounterActions";
import useMakeSureSettingsAreSet from "./useMakeSureSettingsAreSet";

import useResetDailySteps from "./useResetDailySteps";

export default function SettingsManager() {
  const settings = store.useSettings();
  useMakeSureSettingsAreSet();

  useResetDailySteps(settings);
  useCleanOldCounterActions(settings);

  return null;
}
