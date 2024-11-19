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
  scrollableRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode | React.ReactNode[];
};

const SCROLL_THRESHOLD = 100; // pixels from edge that triggers scrolling
const SCROLL_STEP = 6; // pixels to scroll per touch move event

/**
 * Shortcuts component for displaying a list of shortcut buttons.
 * @param {Props} props - The component props.
 * @returns {JSX.Element} The rendered Shortcuts component.
 */
export default function ShortcutPanel({
  side = "left",
  scrollableRef,
  children,
}: Props) {
  const [idOfHoveredItem, setIdOfHoveredItem] = useState<string | null>(null);

  const onTouchMove = (e: TouchEvent<HTMLElement>) => {
    const t = e.touches[0];
    const button = document.elementFromPoint(
      t.clientX,
      t.clientY
    ) as HTMLElement;
    setIdOfHoveredItem(getShortcutElement(button)?.id);

    if (scrollableRef?.current) {
      const rect = scrollableRef.current.getBoundingClientRect();
      const relativeY = t.clientY - rect.top;

      if (relativeY < SCROLL_THRESHOLD) {
        // Near top - scroll up
        scrollableRef.current.scrollBy(0, -SCROLL_STEP);
      } else if (relativeY > rect.height - SCROLL_THRESHOLD) {
        // Near bottom - scroll down
        scrollableRef.current.scrollBy(0, SCROLL_STEP);
      }
    }
  };

  /**
   * Handles the touch end event by finding and clicking the shortcut element at the touch position.
   * Only triggers click if a valid shortcut element with an ID is found.
   * Prevents default behavior and stops event propagation when a valid shortcut is clicked.
   * - Preventing double clicks on Touch tap, simulating clicks.
   * - Allowing to un-focus other elements when clicking anything but valid shortcuts.
   * @param {TouchEvent<HTMLElement>} e - The touch end event object
   */
  const onTouchEnd = (e: TouchEvent<HTMLElement>) => {
    const t = e.changedTouches[0];
    const button = document.elementFromPoint(
      t.clientX,
      t.clientY
    ) as HTMLElement;
    const relevantNode = getShortcutElement(button);
    if (relevantNode.id) {
      e.preventDefault();
      e.stopPropagation();
      relevantNode.element?.click?.();
      setIdOfHoveredItem(null);
    }
  };

  return (
    <Box
      onTouchMove={onTouchMove}
      onTouchStart={onTouchMove}
      onTouchEnd={onTouchEnd}
      data-shortcut-id={""}
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
  if (typeof id === "string") return { element, id };
  return getShortcutElement(element.parentElement);
}
