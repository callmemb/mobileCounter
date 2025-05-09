import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "@/components/shared/pageTemplate";
import ShortcutButton from "@/components/shared/pageTemplate/components/shortcuts/shortcutButton";
import { ArrowBack } from "@mui/icons-material";
import { Box } from "@mui/material";

export const Route = createFileRoute("/404")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const navigate = useNavigate();

  return (
    <PageTemplate
      leftOptions={[
        <ShortcutButton
          key="back"
          id="back"
          icon={<ArrowBack />}
          color="warning"
          onClick={() => {
            navigate({ to: "/" });
          }}
        >
          Back
        </ShortcutButton>,
      ]}
    >
      <Box sx={{ textAlign: "center" }}>404</Box>
    </PageTemplate>
  );
}
