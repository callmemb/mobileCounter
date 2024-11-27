
import { useSettings } from "../store";
import useCleanOldCounterActions from "./useCleanOldCounterActions";

import useResetDailySteps from "./useResetDailySteps";

export default function SettingsManager() {
  const settings = useSettings();

  useResetDailySteps(settings);
  useCleanOldCounterActions(settings);

  return null;
}
