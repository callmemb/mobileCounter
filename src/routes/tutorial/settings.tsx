import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import TutorialPageTemplate from "@/components/shared/pageTemplate/tutorialPageTemplate";

export const Route = createFileRoute("/tutorial/settings")({
  component: RouteComponent,
  validateSearch: z.object({
    group: z.string().optional(),
  }),
});

function RouteComponent() {
  return (
    <TutorialPageTemplate>
      <h2>App Settings</h2>
      <ol>
        <li>
          <strong>Access</strong>: Open the menu in the right panel and select
          "Settings."
        </li>
        <li>
          <strong>Reset Time</strong>: Choose when counters reset daily (e.g.,
          midnight).
        </li>
        <li>
          <strong>Day label from</strong>: Pick if Reset time defines start or end of the day.
        </li>
        <li>
          <strong>Data Storage</strong>:
          <ul>
            <li>Set how long to keep individual actions (e.g., a week).</li>
            <li>
              Decide how many days to save daily summaries (e.g., 30 days).
            </li>
            <li>Pick how long to store monthly summaries (e.g., a year).</li>
          </ul>
        </li>
        <li>
          <strong>Save</strong>: Changes apply instantly and stay local—no data
          leaves your device.
        </li>
      </ol>
    </TutorialPageTemplate>
  );
}
