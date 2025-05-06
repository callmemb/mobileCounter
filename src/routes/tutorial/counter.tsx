import { createFileRoute } from "@tanstack/react-router";
import TutorialPageTemplate from "@/components/pageTemplate/tutorialPageTemplate";

export const Route = createFileRoute("/tutorial/counter")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <TutorialPageTemplate>
      <h2>Adding a Counter</h2>
      <ol style={{ paddingLeft: "1.5rem" }}> 
        <li>
          <strong>Create a Group First</strong>: Before adding a counter, you
          need a group for it.
          <ul>
            <li>
              From the right menu, select "Group List" and click "Add Group."
            </li>
            <li>Give it a name (e.g., "Health"), pick an icon, and save it.</li>
          </ul>
        </li>
        <li>
          <strong>Start</strong>: Now, tap "Add Counter" from the right-hand
          menu.
        </li>
        <li>
          <strong>Name it</strong>: Give it a name, like "Coffee" or "Exercise"
          (at least 3 characters).
        </li>
        <li>
          <strong>Set a goal</strong>: Decide how many times you want to do
          something each day, e.g., 3 coffees.
        </li>
        <li>
          <strong>Pick a step</strong>: A "step" is how much you add with one
          move of the dial or one entry—like 1 coffee or 5 push-ups. You also
          set:
          <ul>
            <li>
              <strong>Minimum</strong>: The smallest amount you can add in a
              single edit (e.g., 1).
            </li>
            <li>
              <strong>Maximum</strong>: The largest amount you can add in a
              single edit (e.g., 10).
            </li>
          </ul>
        </li>
        <li>
          <strong>Add details</strong>:
          <ul>
            <li>Pick an icon to make it recognizable.</li>
            <li>
              Choose which days of the week it's active (e.g., Monday to
              Friday).
            </li>
            <li>
              Assign it to a group (e.g., the "Health" group you just made).
            </li>
          </ul>
        </li>
        <li>
          <strong>Save</strong>: Hit "Create," and your counter will appear in
          the middle column as a clock-like dial.
        </li>
      </ol>
      <p>
        From the home screen, use the left panel to quickly scroll to your new
        counter or the right panel to filter by group.
      </p>

      <h2>Using a Counter</h2>
      <h3>Adding with the Dial</h3>
      <ul style={{ paddingLeft: "1.5rem" }}>
        <li>
          Find your counter in the middle column—it looks like a circular clock
          face.
        </li>
        <li>
          Look for the round "+" button—that's the slider's starting point. Its
          position depends on the counter's default value (e.g., if it starts at
          0, it's on the left).
        </li>
        <li>
          Slide the marker along the edge:
          <ul>
            <li>Starts on the left (like 9:00).</li>
            <li>Moves right, following the clock hands.</li>
            <li>Ends at the bottom (6:00).</li>
          </ul>
        </li>
        <li>
          Each slide adds one step—watch your total grow! The amount added stays
          within your min/max settings.
        </li>
      </ul>

      <h3>Adding with the Keyboard</h3>
      <ul style={{ paddingLeft: "1.5rem" }}>
        <li>Click the counter or press Tab to focus on it.</li>
        <li>A text box pops up.</li>
        <li>
          Type a number (e.g., 2) and hit Enter—it's added! The value must fit
          between your min and max limits.
        </li>
      </ul>

      <h3>Checking Progress</h3>
      <p>
        The dial shows how much you've done and what's left to hit your goal. If
        you delete an entry (e.g., an accidental count), the app updates your
        summaries automatically.
      </p>

      <h3>Summaries</h3>
      <p>
        Daily actions are rolled into a summary once a day. Monthly summaries
        are created once a month—great for tracking habits over time. All stored
        locally on your device!
      </p>

      <h3>Navigating</h3>
      <p>
        On the home screen, the middle column lists all counters as dials. Use
        the left panel to jump to a specific counter or the right panel to
        filter by group.
      </p>
      <h3>Managing Lists</h3>
      <ul>
        <li>From the right menu, go to "Counter List" or "Group List."</li>
        <li>In the middle column, you'll see all counters or groups.</li>
        <li>
          Reorder them by dragging, edit details, or delete items as needed.
        </li>
      </ul>

      <h2>Example Use</h2>
      <p>Want to run 10 km daily?</p>
      <ul>
        <li>First, add a "Fitness" group via the Group List.</li>
        <li>
          Then, add a "Running" counter (goal: 10 km, step: 1 km, min: 1, max:
          5, group: "Fitness").
        </li>
        <li>
          After each kilometer, slide the "+" button on the dial or type a
          number (up to 5 at a time).
        </li>
        <li>
          Check the middle column later to see your progress. Use the left panel
          to jump to it or the right menu to filter Fitness counters.
        </li>
      </ul>

      <p>
        That's it! <strong>Mobile Counter</strong> adapts to mobile or desktop,
        keeps your data private, and organizes everything in a clear
        three-column layout. Customize it your way and start counting your daily
        wins. Questions? Let me know!
      </p>
    </TutorialPageTemplate>
  );
}
