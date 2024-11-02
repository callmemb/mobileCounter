import AddCounterForm from "./components/forms/addCounterForm";
import Shortcuts from "./components/shortcuts/component";
import useModal from "./hooks/useModal";
import { useCounters } from "./store";
import Sliders from "./containers/sliders/component";

function App() {
  const counters = useCounters();
  const { dialogNode, show } = useModal("Add counter", AddCounterForm);

  return (
    <div id="app">
      {dialogNode}

      <nav>
        <Shortcuts
          side="left"
          items={counters.map((c) => ({
            id: `${c.id}`,
            label: c.label,
            icon: c.label[0],
            onClick: () => (window.location.hash = `${c.id}`),
          }))}
        />
      </nav>

      <aside>
        <Shortcuts
          side="right"
          items={[
            {
              id: "0",
              label: "Add Counter",
              icon: "C",
              onClick: () => show(),
            },
          ]}
        />
      </aside>

      <main>
        <Sliders counters={counters} />
      </main>
    </div>
  );
}

export default App;
