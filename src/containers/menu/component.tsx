import CounterForm from "../../components/forms/CounterForm";
import CounterGroupForm from "../../components/forms/CounterGroupForm";
import ShortcutButton from "../../components/shortcuts/shortcutButton";
import useModal from "../../hooks/useModal";

export default function Menu() {
  const { dialogNode: dialogNodeForCounterForm, show: showForCounterForm } =
    useModal("Add counter", ({ hide }) => <CounterForm hide={hide} />);
  const {
    dialogNode: dialogNodeForCounterGroupForm,
    show: showForCounterGroupForm,
  } = useModal("Add counter group", ({ hide }) => (
    <CounterGroupForm hide={hide} />
  ));

  return (
    <>
      {dialogNodeForCounterForm}
      {dialogNodeForCounterGroupForm}
      <ShortcutButton
        id="addCounter"
        icon={"C"}
        onClick={() => showForCounterForm()}
      >
        Add Counter
      </ShortcutButton>
      <ShortcutButton
        id="addGroup"
        icon={"G"}
        onClick={() => showForCounterGroupForm()}
      >
        Add Group
      </ShortcutButton>
      <ShortcutButton id="toggleOrder" icon={"TO"} onClick={() => {}}>
        Toggle Order
      </ShortcutButton>
      <ShortcutButton id="editGroup" icon={"EG"} onClick={() => {}}>
        Edit Group
      </ShortcutButton>
    </>
  );
}
