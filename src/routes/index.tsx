import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../components/pageTemplate/component";
import ShortcutButton from "../components/pageTemplate/components/shortcuts/shortcutButton";
import {
  AvTimer,
  Description,
  Info,
  InfoOutlined,
  Settings,
  TextSnippet,
  Undo,
} from "@mui/icons-material";
import { store, useCounterGroups, useCounters } from "../store";
import { z } from "zod";
import { Stack } from "@mui/material";
import CircularSlider from "../components/circularSlider/component";
import { Counter, CounterAction } from "../definitions";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: z.object({
    group: z.string().optional(),
  }),
});

function RouteComponent() {
  const { group } = Route.useSearch();
  const navigate = useNavigate();
  const counters = useCounters(group || null);
  const groups = useCounterGroups();

  return (
    <PageTemplate
      staticOptions={[
        <ShortcutButton
          color="info"
          key="counterOptions"
          id={"counterOptions"}
          icon={<AvTimer />}
          onClick={() => navigate({ to: "/counters" })}
        >
          Counters
        </ShortcutButton>,
        <ShortcutButton
          color="info"
          key="groupOptions"
          id={"groupOptions"}
          icon={<Description />}
          onClick={() => navigate({ to: "/groups" })}
        >
          Groups
        </ShortcutButton>,
        <ShortcutButton
          color="success"
          key="settings"
          id="settings"
          icon={<Settings />}
          onClick={() => navigate({ to: "/settings" })}
        >
          Settings
        </ShortcutButton>,
        <ShortcutButton
          color="success"
          key="about"
          id="about"
          icon={<InfoOutlined />}
          onClick={() => navigate({ to: "/about" })}
        >
          About
        </ShortcutButton>,
        <ShortcutButton
          color="warning"
          key="goToTest"
          id={"goToTest"}
          icon={<TextSnippet />}
          onClick={() => navigate({ to: "/test" })}
        >
          Test
        </ShortcutButton>,
      ]}
      rightOptions={groups.map((g) => (
        <ShortcutButton
          key={g.id}
          id={g.id}
          icon={g.label[0]}
          isSelected={g.id === group}
          onClick={() => {
            navigate({
              to: ".",
              search: { group: group === g.id ? undefined : g.id },
            });
          }}
        >
          {g.label}
        </ShortcutButton>
      ))}
      leftOptions={[
        ...counters.map((c) => (
          <ShortcutButton
            key={c.id}
            id={c.id}
            icon={c.label[0]}
            onClick={() => {
              document.getElementById(c.id)?.scrollIntoView({block: "center"});
            }}
          >
            {c.label}
          </ShortcutButton>
        )),
      ]}
    >
      <Stack gap={5} py='1rem' alignItems={"center"}>
        {counters.map((c) => (
          <CircularSliderWithActionMemory
            key={c.id}
            counter={c}
            navigate={navigate}
          />
        ))}
      </Stack>
    </PageTemplate>
  );
}

function CircularSliderWithActionMemory({
  counter: c,
  navigate,
}: {
  counter: Counter;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [actions, setActions] = useState([] as CounterAction[]);

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
          icon: <Info color="info" />,
          action: () => navigate({ to: "/counters/$id", params: { id: c.id } }),
        },
      ]}
    />
  );
}
