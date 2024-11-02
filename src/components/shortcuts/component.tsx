import { useState, TouchEvent } from "react";
import Button from "./button";
import { item } from "./definitions";

/**
 * Props for the Shortcuts component.
 * @typedef {Object} Props
 * @property {item[]} items - An array of shortcut items to display.
 * @property {"left" | "right"} side - The side of the screen to display the shortcuts on.
 */
type Props = { items: item[]; side?: "left" | "right" };

/**
 * Shortcuts component for displaying a list of shortcut buttons.
 * @param {Props} props - The component props.
 * @returns {JSX.Element} The rendered Shortcuts component.
 */
export default function Shortcuts({ items, side = "left" }: Props) {
  const [touchHover, setTouchHover] = useState<string | null>(null);


  const onTouchMove = (e: TouchEvent<HTMLElement>) => {
    const t = e.touches[0];
    const button = document.elementFromPoint(
      t.clientX,
      t.clientY
    ) as HTMLElement;
    setTouchHover(button?.dataset?.id || null);
  };

  const onTouchEnd = () => {
    if (typeof touchHover === "string") {
      items.find((i) => i.id === touchHover)?.onClick();
    }
    setTouchHover(null);
  };

  return (
    <div
      id="shortcuts"
      className={side}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {items.map((c) => (
        <Button side={side} key={c.id} {...c} isHover={touchHover === c.id} />
      ))}
    </div>
  );
}
