import { useContext } from "react";
import { ShortcutsContext } from "./component";

type props = {
  id: string;
  onClick: () => void;
  isSelected?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export default function ShortcutButton({
  id,
  icon,
  children,
  isSelected,
  onClick,
}: props) {
  const { side, idOfHoveredItem } = useContext(ShortcutsContext);
  const isHover = idOfHoveredItem === id;

  return (
    <div
      data-href={id}
      className={`button ${side} ${isHover ? "hover" : ""} ${
        isSelected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      <div
        data-id={id}
        className="icon"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {icon}
      </div>
      <div
        data-id={id}
        className="text"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {children}
      </div>
    </div>
  );
}
