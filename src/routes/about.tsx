import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "../components/pageTemplate/component";
import ShortcutButton from "../components/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowLeft } from "@mui/icons-material";
import { Typography } from "@mui/material";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <PageTemplate
      label="About"
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
      <Typography variant="button" sx={{
        width: '100%',
        textAlign: 'center',
        display: 'block',
      }}>
        I'm awesome
      </Typography>
    </PageTemplate>
  );
}
