import { useState, TouchEvent, useEffect } from "react";
import { ShortcutContext } from "./shortcutContext";
import { Box } from "@mui/material";

/**
 * Props for the Shortcuts component.
 * @typedef {Object} Props
 * @property {"left" | "right"} side - The side of the screen to display the shortcuts on.
 */
type Props = {
  side?: "left" | "right";
  scrollableRef?: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode | React.ReactNode[];
};

const SCROLL_THRESHOLD = 150; // pixels from edge that triggers scrolling

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

  // -10 to 10 -> speed of scrolling
  const [scrolling, setScrolling] = useState(0);
  useEffect(() => {
    let animationFrameId: number;

    const doScrolling = () => {
      if (scrolling !== 0 && scrollableRef?.current) {
        scrollableRef.current.scrollBy({
          top: scrolling,
          behavior: "auto", // Changed to auto since we're handling the smoothing ourselves
        });
        animationFrameId = requestAnimationFrame(doScrolling);
      }
    };

    if (scrollableRef?.current && scrolling !== 0) {
      animationFrameId = requestAnimationFrame(doScrolling);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [scrolling, scrollableRef?.current]);

  const onTouchMove = (e: TouchEvent<HTMLElement>) => {
    if (!scrollableRef?.current) return;
    const t = e.touches[0];
    const button = document.elementFromPoint(
      t.clientX,
      t.clientY
    ) as HTMLElement;
    setIdOfHoveredItem(getShortcutElement(button)?.id);

    const rect = scrollableRef.current.getBoundingClientRect();
    const relativeY = t.clientY - rect.top;
    if (relativeY < SCROLL_THRESHOLD) {
      // Near top - scroll up
      setScrolling(-10 + (relativeY / SCROLL_THRESHOLD) * 10);
    } else if (relativeY > rect.height - SCROLL_THRESHOLD) {
      // Near bottom - scroll down
      setScrolling(10 - ((rect.height - relativeY) / SCROLL_THRESHOLD) * 10);
    } else {
      setScrolling(0);
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
    if (!scrollableRef?.current) return;
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
    setScrolling(0);
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
        scrollBehavior: "smooth",
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

function getShortcutElement(element: HTMLElement | null): { element: HTMLElement | null; id: string | null } {
  while (element) {
    const id = element.getAttribute("data-shortcut-id");
    if (id !== null) return { element, id };
    element = element.parentElement;
  }
  return { element: null, id: null };
}
