import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../components/pageTemplate/component";
import ShortcutButton from "../components/pageTemplate/components/shortcuts/shortcutButton";
import {
  AvTimer,
  Description,
  InfoOutlined,
  Settings,
  TextSnippet,
  Undo,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { store } from "../store";
import { z } from "zod";
import { Button, Stack } from "@mui/material";
import CircularSlider from "../components/circularSlider/component";
import { Counter, CounterAction } from "../definitions";
import { useState } from "react";
import DynamicIcon from "../components/dynamicIcon/component";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: z.object({
    group: z.string().optional(),
  }),
});

function RouteComponent() {
  const [showHidden, setShowHidden] = useState(false);
  const { group } = Route.useSearch();
  const navigate = useNavigate();
  const counters = store.useCounters(group || null, true);
  const groups = store.useCounterGroups();

  return (
    <PageTemplate
      menuOptions={[
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
          color="primary"
          key="tutorial"
          id={"tutorial"}
          icon={<TextSnippet />}
          onClick={() => navigate({ to: "/tutorial" })}
        >
          Tutorial
        </ShortcutButton>,
      ]}
      rightOptions={[
        ...(counters.length > 0
          ? [
              <ShortcutButton
                key={"toggleVisibility"}
                id={"toggleVisibility"}
                color="secondary"
                icon={showHidden ? <VisibilityOff /> : <Visibility />}
                onClick={() => {
                  setShowHidden(!showHidden);
                }}
              >
                <div style={{ fontSize: "0.8rem", lineHeight: ".8rem" }}>
                  Toggle visibility <br />
                  for hidden counters
                </div>
              </ShortcutButton>,
            ]
          : []),
        <span key="space" />,
        ...groups.map((g) => (
          <ShortcutButton
            key={g.id}
            id={g.id}
            icon={<DynamicIcon icon={g.icon} />}
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
        )),
      ]}
      leftOptions={counters
        .filter((c) => !c.hidden || showHidden)
        .map((c) => (
          <ShortcutButton
            key={c.id}
            id={c.id}
            icon={<DynamicIcon icon={c.icon} />}
            onClick={() => {
              document
                .getElementById(c.id)
                ?.scrollIntoView({ block: "center" });
            }}
          >
            {c.label}
          </ShortcutButton>
        ))}
    >
      <Stack gap={10} py="1rem" alignItems={"center"}>
        {counters.length > 0 ? (
          counters.map((c) =>
            c.hidden && !showHidden ? null : (
              <CircularSliderWithActionMemory
                key={c.id}
                counter={c}
                navigate={navigate}
              />
            )
          )
        ) : groups.length > 0 ? (
          <Stack gap={2} alignItems="center">
            <Button
              variant="outlined"
              onClick={() => navigate({ to: "/counters/new" })}
            >
              Create first counter
            </Button>
            OR
            <Button
              variant="outlined"
              onClick={() => navigate({ to: "/tutorial" })}
            >
              Check out the tutorial
            </Button>
          </Stack>
        ) : (
          <Stack gap={2} alignItems="center">
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onClick={() => store.createDemo()}
            >
              <span>Create Demo</span>
              <span>Gym Workout</span>
              <small>(One-Punch Man routine)</small>
            </Button>
            OR
            <Button
              variant="outlined"
              onClick={() => navigate({ to: "/groups/new" })}
            >
              Create first group
            </Button>
            OR
            <Button
              variant="outlined"
              onClick={() => navigate({ to: "/tutorial" })}
            >
              Check out the tutorial
            </Button>
          </Stack>
        )}
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
