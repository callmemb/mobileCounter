import Actions from "./components/actions/component";
import Shortcuts from "./components/shortcuts/component";

const counters = [
  {
    id: "1",
    name: "name1",
  },
  {
    id: "2",
    name: "name2 asdxazs d asdsaddasddsad",
  },
  {
    id: "3",
    name: "name3",
  },
  {
    id: "4",
    name: "name4",
  },
  {
    id: "5",
    name: "name5",
  },
  {
    id: "6",
    name: "name6",
  },
];

function App() {
  return (
    <div id="app">
      {/* top left corner on desktop for logo and shit */}
      {/* <header></header> */}

      <nav>
        <Shortcuts counters={counters} />
      </nav>

      <aside>
        <Actions />
      </aside>

      <main>
        {counters.map((c) => (
          <div key={c.id} id={c.id}>
            {c.name}
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
