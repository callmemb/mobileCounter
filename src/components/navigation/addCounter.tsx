import { useRef } from "react";

export default function AddCounter() {
  const ref = useRef<HTMLDialogElement>(null);

  const toggleVisibility = () => {
    const dialog = ref.current;
    if (!dialog) {
      return;
    }

    const isOpen = dialog.hasAttribute("open");

    if (isOpen) {
      dialog.close();
    } else {
      dialog.showModal();
    }

    return;
  };

  return (
    <div>
      <button className="button" onClick={toggleVisibility}>
        C
      </button>

      <dialog ref={ref}>
        <button autoFocus onClick={toggleVisibility}>
          Close
        </button>
        <p>This modal dialog has a groovy backdrop!</p>
      </dialog>
    </div>
  );
}
