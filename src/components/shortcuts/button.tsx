import { item } from "./definitions";

type props = item & { isHover: boolean; side: string };

export default function Link({
  id,
  icon,
  label,
  onClick,
  isHover,
  side,
}: props) {
  return (
    <div
      data-href={id}
      className={`button ${isHover ? "hover" : ""} ${side}`}
      onClick={onClick}
    >
      <div data-id={id} className="icon">
        {icon}
      </div>
      <div data-id={id} className="text">
        {label}
      </div>
    </div>
  );
}
