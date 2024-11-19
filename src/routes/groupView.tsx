import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../components/pageTemplate/component";
import ShortcutButton from "../components/pageTemplate/components/shortcuts/shortcutButton";
import { AddCircle, ArrowLeft, Sort } from "@mui/icons-material";
import { useCounterGroups } from "../store";
import { z } from "zod";

export const Route = createFileRoute("/groupView")({
  component: RouteComponent,
  validateSearch: z.object({
    sortMode: z.boolean().optional(),
  }),
});

function RouteComponent() {
  const { sortMode } = Route.useSearch();
  const navigate = useNavigate();
  const groups = useCounterGroups();

  return (
    <PageTemplate
      label="Groups"
      staticOptions={[
        <ShortcutButton
          key="addCounterGroup"
          id={"addCounterGroup"}
          icon={<AddCircle />}
          onClick={() => navigate({ to: "/addCounterGroup" })}
        >
          Add Group
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
      ]}
      rightOptions={groups.map((g) => (
        <ShortcutButton
          key={g.id}
          id={g.id}
          icon={g.label[0]}
          onClick={() => {
            document.getElementById(g.id)?.scrollIntoView();
          }}
        >
          {g.label}
        </ShortcutButton>
      ))}
      leftOptions={[
        <ShortcutButton
          key="back"
          id={"back"}
          icon={<ArrowLeft />}
          color="warning"
          onClick={() => {
            navigate({ to: "/" });
          }}
        >
          Back
        </ShortcutButton>,
      ]}
    >
      {groups.map((g) => (
        <div id={g.id} key={g.id}>
          {g.label}
        </div>
      ))}
    </PageTemplate>
  );
}
