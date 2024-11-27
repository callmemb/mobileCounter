import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../../components/pageTemplate/component";
import ShortcutButton from "../../components/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft } from "@mui/icons-material";
import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export const Route = createFileRoute("/test/2")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [value, setValue] = useState([0, 3]);
  return (
    <PageTemplate
      label={"Test page 2"}
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
      <ToggleButtonGroup
        color="primary"
        value={value}
        aria-label="Day of the week selection"
        onChange={(_, v) => setValue(v)}
      >
        <ToggleButton value={0}>po</ToggleButton>
        <ToggleButton value={1}>wt</ToggleButton>
        <ToggleButton value={2}>sr</ToggleButton>
        <ToggleButton value={3}>cz</ToggleButton>
        <ToggleButton value={4}>pi</ToggleButton>
        <ToggleButton value={5}>so</ToggleButton>
        <ToggleButton value={6}>nd</ToggleButton>
      </ToggleButtonGroup>
    </PageTemplate>
  );
}
