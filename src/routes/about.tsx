import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PageTemplate from "@/components/pageTemplate/component";
import ShortcutButton from "@/components/pageTemplate/components/shortcuts/shortcutButton";
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
      <Typography variant="h6" sx={{
        width: '100%',
        textAlign: 'center',
        display: 'block',
        mb: 2
      }}>
        Mobile Counter App
      </Typography>
      <Typography variant="body1" sx={{
        width: '100%',
        textAlign: 'left',
        display: 'block',
        mb: 2
      }}>
        This is a Progressive Web Application (PWA) designed primarily for mobile usage, 
        allowing you to keep track of various tasks. While optimized for mobile devices, 
        it's fully functional across all platforms and environments, including screen readers 
        for improved accessibility.
      </Typography>
      <Typography variant="body1" sx={{
        width: '100%',
        textAlign: 'left',
        display: 'block',
        mb: 2
      }}>
        All data is stored locally in your browser's IndexDB storage, ensuring your privacy 
        as no information is ever sent to external servers. This makes the app fully functional 
        even without an internet connection after the initial installation.
      </Typography>
      <Typography variant="body2" sx={{
        width: '100%',
        textAlign: 'left',
        display: 'block',
        fontStyle: 'italic'
      }}>
        This project was created for personal use by the author but is available for anyone 
        who finds it useful.
      </Typography>
    </PageTemplate>
  );
}
