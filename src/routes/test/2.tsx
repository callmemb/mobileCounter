import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../../components/pageTemplate/component";
import ShortcutButton from "../../components/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft } from "@mui/icons-material";
import IconPicker from "../../components/form/iconPicker";
import { useState } from "react";

export const Route = createFileRoute("/test/2")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [selectedIcon, setSelectedIcon] = useState<string>("Home");
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
      <IconPicker value={selectedIcon} onChange={setSelectedIcon} />
    </PageTemplate>
  );
}
