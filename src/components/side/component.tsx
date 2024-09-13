import { useState, TouchEvent } from "react";
import Link from "./link";

export default function Side({ counters }: { counters: object[] }) {
  const [touchHover, setTouchHover] = useState<string | null>(null);

  const onTouchMove = (e: TouchEvent<HTMLElement>) => {
    const t = e.touches[0];
    const link = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement;
    setTouchHover(link?.dataset?.link || null);
  };
  const onTouchEnd = () => {
    if (typeof touchHover === "string") {
      window.location.hash = "" + touchHover;
    }
    setTouchHover(null);
  };

  return (
    <div
      className="side"
      onTouchMove={onTouchMove}
      onTouchStart={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {counters.map((c) => (
        <Link
          key={c.id}
          name={c.name}
          id={c.id}
          isHover={touchHover === c.id}
        />
      ))}
    </div>
  );
}
