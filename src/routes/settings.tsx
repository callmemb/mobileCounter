import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../components/pageTemplate/component";
import ShortcutButton from "../components/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft } from "@mui/icons-material";
import { Typography } from "@mui/material";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <PageTemplate
      label="Settings"
      leftOptions={[
        <ShortcutButton
          key="back"
          id="back"
          icon={<ArrowLeft />}
          color="warning"
          onClick={() => {
            navigate({ to: ".." });
          }}
        >
          Back
        </ShortcutButton>,
      ]}
    >
      <h3>TODO</h3>
      <ul>
        <li> Cron timer Settings</li>
        <li> Reset DB button</li>
        <li> Presentation mode, populate db with random data</li>
      </ul>
    </PageTemplate>
  );
}
