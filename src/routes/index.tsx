import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../components/pageTemplate/component";
import ShortcutButton from "../components/pageTemplate/components/shortcuts/shortcutButton";
import { AddCircle, Group, Sort, TextSnippet } from "@mui/icons-material";
import { useCounterGroups, useCounters } from "../store";
import { z } from "zod";
import { Stack } from "@mui/material";
import CircularSlider from "../components/circularSlider/component";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: z.object({
    group: z.string().optional(),
    sortMode: z.boolean().optional(),
  }),
});

function RouteComponent() {
  const { group, sortMode } = Route.useSearch();
  const navigate = useNavigate();
  const counters = useCounters(group || null);
  const groups = useCounterGroups();

  return (
    <PageTemplate
      staticOptions={[
        <ShortcutButton
          key="addCounter"
          id={"addCounter"}
          icon={<AddCircle />}
          onClick={() => navigate({ to: "/addCounter" })}
        >
          Add Counter
        </ShortcutButton>,
        <ShortcutButton
          key="changeOrder"
          id={"changeOrder"}
          isSelected={sortMode}
          icon={<Sort />}
          onClick={() =>
            navigate({ to: ".", search: { sortMode: !sortMode || undefined } })
          }
        >
          Change order
        </ShortcutButton>,
        <ShortcutButton
          key="groupMode"
          id={"groupMode"}
          icon={<Group />}
          onClick={() => navigate({ to: "/groupView" })}
        >
          Group Mode
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
              document.getElementById(c.id)?.scrollIntoView();
            }}
          >
            {c.label}
          </ShortcutButton>
        )),
        <ShortcutButton
          color="warning"
          key="goToTest"
          id={"goToTest"}
          icon={<TextSnippet />}
          onClick={() => navigate({ to: "/test" })}
        >
          Go to Test
        </ShortcutButton>,
      ]}
    >
      <Stack gap={5} alignItems={'center'}>
        {counters.map((c) => (
          <CircularSlider
            key={c.id}
            color="#007AFF"
          />
        ))}
      </Stack>
    </PageTemplate>
  );
}
