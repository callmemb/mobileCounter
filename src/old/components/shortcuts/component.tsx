import { useState, TouchEvent, createContext } from "react";

export const ShortcutsContext = createContext({
  side: "left",
  idOfHoveredItem: null as string | null,
});

/**
 * Props for the Shortcuts component.
 * @typedef {Object} Props
 * @property {"left" | "right"} side - The side of the screen to display the shortcuts on.
 */
type Props = { side?: "left" | "right"; children: React.ReactNode | React.ReactNode[] };

/**
 * Shortcuts component for displaying a list of shortcut buttons.
 * @param {Props} props - The component props.
 * @returns {JSX.Element} The rendered Shortcuts component.
 */
export default function Shortcuts({ side = "left", children }: Props) {
  const [idOfHoveredItem, setIdOfHoveredItem] = useState<string | null>(null);

  const onTouchMove = (e: TouchEvent<HTMLElement>) => {
    const t = e.touches[0];
    const button = document.elementFromPoint(
      t.clientX,
      t.clientY
    ) as HTMLElement;
    setIdOfHoveredItem(button?.dataset?.id || null);
  };

  const onTouchEnd = (e: TouchEvent<HTMLElement>) => {
    const t = e.changedTouches[0];
    const button = document.elementFromPoint(
      t.clientX,
      t.clientY
    ) as HTMLElement;
    console.log(button?.click);
    button?.click?.();
    setIdOfHoveredItem(null);
  };

  return (
    <div
      id="shortcuts"
      className={side}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <ShortcutsContext.Provider value={{ idOfHoveredItem, side }}>
        {children}
      </ShortcutsContext.Provider>
    </div>
  );
}
