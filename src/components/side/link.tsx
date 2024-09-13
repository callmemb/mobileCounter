export default function Link({
  id,
  name,
  isHover,
}: {
  id: string;
  name: string;
  isHover?: boolean;
}) {
  return (
    <a href={`#${id}`} data-href={id} className={`link ${isHover ? "hover" : ""}`}>
      <div data-link={id} className="icon">
        {name[0]}
      </div>
      <div data-link={id} className="text">
        {name}
      </div>
    </a>
  );
}
