import { useCounters } from "../../store";
import { useSelectedCounterGroupId } from "../../hooks/useSelectedCounterGroupId";
import CounterSlider from "./counterSlider";

const CounterSliders = () => {
  const { groupId } = useSelectedCounterGroupId();
  const counters = useCounters(groupId || null);

  return (
    <>
      {counters.map((c) => (
        <CounterSlider key={c.id} {...c} />
      ))}
    </>
  );
};

export default CounterSliders;
