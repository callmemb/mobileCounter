import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  InfoOutlined,
  Undo,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { store } from "@/store";
import { Counter, CounterAction } from "@/definitions";
import CircularSlider from "@/components/shared/circularSlider";

export default function CircularSliderWithActionMemory({
  counter: c,
}: {
  counter: Counter;
}) {
  const navigate = useNavigate();
  const [actions, setActions] = useState([] as CounterAction[]);
  const bgImage = store.useImage(c.faceImageId);

  return (
    <CircularSlider
      key={c.id}
      id={c.id}
      onChange={async (value) => {
        const { record } = await store.addCounterAction({
          counterId: c.id,
          value: value,
        });
        if (record) {
          setActions([...actions, record]);
        }
      }}
      cumulatedSteps={c.currentSteps}
      defaultStep={c.defaultNumberOfSteps}
      minStep={0}
      maxStep={c.maxNumberOfSteps}
      stepSize={c.unitsInStep}
      stepsGoal={c.dailyGoalOfSteps}
      unitName={c.unitsName}
      label={c.label}
      bgImage={bgImage?.data}
      tools={[
        ...(actions.length > 0
          ? [
              {
                id: "undo",
                icon: <Undo />,
                label: "Undo last change",
                action: () => {
                  const lastAction = actions[actions.length - 1];
                  const newActions = actions.slice(0, -1);
                  if (lastAction) {
                    store.deleteCounterAction(lastAction.id);
                    setActions(newActions);
                  }
                },
              },
            ]
          : []),
        {
          id: "info",
          label: "More info",
          icon: <InfoOutlined />,
          action: () => navigate({ to: "/counters/$id", params: { id: c.id } }),
        },
        ...(c.currentSteps >= c.dailyGoalOfSteps
          ? [
              {
                id: "hidden",
                icon: c.hidden ? <VisibilityOff /> : <Visibility />,
                label: "toggle visibility",
                action: () => {
                  store.upsertCounter({ ...c, hidden: !c.hidden });
                },
              },
            ]
          : []),
      ]}
    />
  );
}
