import { useState } from "react";
import CircularSlider from "../../components/circularSlider/component";
import useModal from "../../hooks/useModal";
import { store } from "../../store";
import { Counter, CounterAction } from "../../definitions";
import CounterForm from "../../components/forms/CounterForm";

export default function CounterSlider(c: Counter) {
  const [actions, setActions] = useState<CounterAction[]>([]);
  const { dialogNode, show } = useModal("Edit counter", ({ hide }) => (
    <>
      <CounterForm hide={hide} initialData={c} />
      <button
        className="bigButton"
        style={{ marginTop: ".2rem" }}
        onClick={() => c.id && store.deleteCounter(c.id)}
      >
        Remove
      </button>
    </>
  ));
  return (
    <div key={c.id} id={c.id}>
      {dialogNode}
      <CircularSlider
        onSubmit={async (value) => {
          const action = await store.addValueToCounter(c.id, value);
          if (!action) return;
          setActions([...actions, action]);
        }}
        isDone={c.currentSteps >= c.dailyGoalOfSteps}
        defaultValue={c.defaultNumberOfSteps * c.unitsInStep}
        maxValue={c.maxNumberOfSteps * c.unitsInStep}
        stepSize={c.unitsInStep}
        options={[
          { label: "E", onClick: () => show() },
          ...(actions.length
            ? [
                {
                  label: "REV",
                  onClick: () => {
                    const otherActions = actions.slice(0, -1);
                    const lastAction = actions[actions.length - 1];
                    store.removeActionFromCounter(lastAction.id);
                    setActions(otherActions);
                  },
                },
              ]
            : []),
        ]}
      >
        <div>
          <h3>{c.label}</h3>
          <small>
            {c.currentSteps * c.unitsInStep} /{" "}
            {c.dailyGoalOfSteps * c.unitsInStep} {c.unitsName}
          </small>
        </div>
      </CircularSlider>
    </div>
  );
}
