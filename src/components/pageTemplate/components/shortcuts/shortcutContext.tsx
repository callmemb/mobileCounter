import { createContext } from "react";

export const ShortcutContext = createContext({
  side: "left",
  idOfHoveredItem: null as string | null,
});
