import ShortcutButton from "../../components/shortcuts/shortcutButton";
import { useSelectedCounterGroupId } from "../../hooks/useSelectedCounterGroupId";
import { useCounters } from "../../store";

export default function CounterLinks() {
  const { groupId } = useSelectedCounterGroupId();
  const counters = useCounters(groupId || null);

  return (
    <>
      {counters.map((c) => (
        <ShortcutButton
          key={`${c.id}`}
          id={`${c.id}`}
          icon={c.label[0]}
          onClick={() => document.getElementById(`${c.id}`)?.scrollIntoView({ behavior: 'smooth' })}
        >
          {c.label}
        </ShortcutButton>
      ))}
    </>
  );
}
