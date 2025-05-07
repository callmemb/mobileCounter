import { createFileRoute } from "@tanstack/react-router";
import TutorialPageTemplate from "@/components/shared/pageTemplate/tutorialPageTemplate";

export const Route = createFileRoute("/tutorial/layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <TutorialPageTemplate>
      <p>The app’s layout splits into three columns:</p>
      <ul style={{ paddingLeft: "1.5rem" }}>
        <li>
          <strong>Left panel</strong>: Navigation shortcuts (e.g., on the home
          screen, scroll to specific counters).
        </li>
        <li>
          <strong>Middle column</strong>: Main content, like your list of
          counters or groups.
        </li>
        <li>
          <strong>Right panel</strong>: Menu and actions (e.g., filter counters
          by group or access settings).
        </li>
      </ul>
    </TutorialPageTemplate>
  );
}
