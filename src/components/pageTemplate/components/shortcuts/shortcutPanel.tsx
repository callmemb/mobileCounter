import { useState, TouchEvent } from "react";
import { ShortcutContext } from "./shortcutContext";
import { Box } from "@mui/material";

/**
 * Props for the Shortcuts component.
 * @typedef {Object} Props
 * @property {"left" | "right"} side - The side of the screen to display the shortcuts on.
 */
type Props = {
  side?: "left" | "right";
  children: React.ReactNode | React.ReactNode[];
};

/**
 * Shortcuts component for displaying a list of shortcut buttons.
 * @param {Props} props - The component props.
 * @returns {JSX.Element} The rendered Shortcuts component.
 */
export default function ShortcutPanel({ side = "left", children }: Props) {
  const [idOfHoveredItem, setIdOfHoveredItem] = useState<string | null>(null);

  const onTouchMove = (e: TouchEvent<HTMLElement>) => {
    const t = e.touches[0];
    const button = document.elementFromPoint(
      t.clientX,
      t.clientY
    ) as HTMLElement;
    setIdOfHoveredItem(getShortcutElement(button)?.id);
  };

  const onTouchEnd = (e: TouchEvent<HTMLElement>) => {
    const t = e.changedTouches[0];
    const button = document.elementFromPoint(
      t.clientX,
      t.clientY
    ) as HTMLElement;
    getShortcutElement(button).element?.click();
    setIdOfHoveredItem(null);
  };

  return (
    <Box
      onTouchMove={onTouchMove}
      onTouchStart={onTouchMove}
      onTouchEnd={onTouchEnd}
      data-shortcut-id={null}
      sx={{
        height: "100%",
        containerType: "inline-size",
        touchAction: "none",
      }}
    >
      <ShortcutContext.Provider value={{ idOfHoveredItem, side }}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: "column",
            alignItems: side !== "right" ? "flex-end" : "flex-start",
          }}
        >
          {children}
        </Box>
      </ShortcutContext.Provider>
    </Box>
  );
}

function getShortcutElement(element: HTMLElement | null): {
  element: HTMLElement | null;
  id: string | null;
} {
  if (!element) return { element: null, id: null };
  const id = element.getAttribute("data-shortcut-id");
  if (id || id === null) return { element, id };
  return getShortcutElement(element.parentElement);
}
