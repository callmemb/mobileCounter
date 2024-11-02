import { useRef } from "react";

export type ComponentInModalPropsType = {
  hide: () => void;
};
type ComponentInModalType = (
  props: ComponentInModalPropsType
) => React.ReactNode;

export default function useModal(title: string, Element: ComponentInModalType) {
  const ref = useRef<HTMLDialogElement>(null);

  const showDialog = () => ref.current?.showModal();
  const hideDialog = () => ref.current?.close();

  const dialogNode = (
    <dialog className="customModal" ref={ref}>
      <div className="header">
        <h2 className="title">{title}</h2>
        <button className="close" onClick={hideDialog}>
          X
        </button>
      </div>
      <div className="content">{<Element hide={hideDialog} />}</div>
    </dialog>
  );

  return {
    dialogNode: dialogNode,
    show: showDialog,
    hide: hideDialog,
  };
}
