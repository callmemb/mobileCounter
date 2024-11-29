import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { store, useSettings } from "../store";
import SettingsForm from "../components/form/settings";
import { Settings } from "../definitions";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const settings = useSettings();

  const onSubmit = async ({ value }: { value: Settings }) => {
    const { errorMessage } = await store.upsertSettings({
      ...settings,
      ...value,
    });
    if (errorMessage) {
      alert(errorMessage);
    }
    navigate({ to: ".." });
  };

  return <SettingsForm settings={settings} onSubmit={onSubmit} />;
}
