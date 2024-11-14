import ShortcutButton from "../../components/shortcuts/shortcutButton";
import { useSelectedCounterGroupId } from "../../hooks/useSelectedCounterGroupId";
import { useCounterGroups } from "../../store";

export default function CounterGroupLinks() {
  const counterGroups = useCounterGroups();
  const { setGroupId, groupId } = useSelectedCounterGroupId();

  return (
    <>
      {counterGroups.map((g) => (
        <ShortcutButton
          key={`${g.id}`}
          id={`${g.id}`}
          icon={g.label[0]}
          isSelected={g.id === groupId}
          onClick={() => {
            if (groupId === g.id) {
              setGroupId(null);
            } else {
              setGroupId(g.id || null);
            }
          }}
        >
          {g.label}
        </ShortcutButton>
      ))}
    </>
  );
}
