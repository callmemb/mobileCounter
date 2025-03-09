import { useNavigate } from "@tanstack/react-router";
import PageTemplate from "../../components/pageTemplate/component";
import ShortcutButton from "../../components/pageTemplate/components/shortcuts/shortcutButton";
import { AppsOutlined, ArrowLeft, AvTimer, Settings } from "@mui/icons-material";

export default function TutorialPageTemplate({
  children,
}: React.PropsWithChildren) {
  const navigate = useNavigate();

  return (
    <PageTemplate
      label="Tutorial"
      menuOptions={[]}
      rightOptions={[
        <ShortcutButton
          key="layout"
          id="layout"
          icon={<AppsOutlined />}
          color="primary"
          onClick={() => {
            navigate({ to: "/tutorial/layout" });
          }}
        >
          App layout
        </ShortcutButton>,
        <ShortcutButton
          key="counters"
          id="counters"
          icon={<AvTimer />}
          color="primary"
          onClick={() => {
            navigate({ to: "/tutorial/counter" });
          }}
        >
          Counters
        </ShortcutButton>,
        <ShortcutButton
          key="settings"
          id="settings"
          icon={<Settings />}
          color="primary"
          onClick={() => {
            navigate({ to: "/tutorial/settings" });
          }}
        >
          Settings
        </ShortcutButton>,
      ]}
      leftOptions={[
        <ShortcutButton
          key="back"
          id="back"
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
      {children}
    </PageTemplate>
  );
}
