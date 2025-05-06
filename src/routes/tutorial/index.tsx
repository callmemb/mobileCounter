import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import TutorialPageTemplate from "@/components/pageTemplate/tutorialPageTemplate";

export const Route = createFileRoute("/tutorial/")({
  component: RouteComponent,
  validateSearch: z.object({
    group: z.string().optional(),
  }),
});

function RouteComponent() {
  return (
    <TutorialPageTemplate>
      <h2>Getting Started</h2>
      <p>
        <strong>Mobile Counter</strong> is a handy app designed to help you track and count various daily activities.
      </p>

      <h3>Key Features</h3>
      <ul style={{ paddingLeft: "1.5rem" }}>
        <li>Track daily counts like water intake, steps, or completed tasks</li>
        <li>Mobile-friendly design that works great on desktop too</li>
        <li>Visual progress tracking with clock-like dials</li>
        <li>Keyboard input support</li>
        <li>Local storage for complete privacy - no data uploads</li>
      </ul>

      <h3>Getting Started</h3>
      <p>
        To begin using Mobile Counter:
      </p>
      <ol>
        <li>Create at least one group to organize your counters</li>
        <li>Add counters to your groups</li>
        <li>Set your daily goals</li>
        <li>Start tracking!</li>
      </ol>
    </TutorialPageTemplate>
  );
}
