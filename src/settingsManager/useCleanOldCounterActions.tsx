import { useEffect } from "react";
import { Settings } from "../definitions";
import { store } from "../store";

const useCleanOldCounterActions = (settings: Settings | undefined) => {
  useEffect(() => {
    store.deleteOldCounterActions();
  }, [settings]);
};

export default useCleanOldCounterActions;
