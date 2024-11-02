import { render, screen, fireEvent } from "@testing-library/react";
import useModal from "./useModal";
import { describe, expect, it } from "vitest";

const TestComponent = ({ hide }: { hide: () => void }) => (
  <button onClick={hide}>close</button>
);

const TestBox = () => {
  const { dialogNode, hide, show } = useModal("Test Modal", TestComponent);
  return (
    <div>
      {dialogNode}
      <button onClick={show}>show</button>
    </div>
  );
};

// Dialog element not implemented for test environment
// describe("useModal", () => {
  // it("should render modal with correct title", () => {
  //   render(<TestBox />);
  //   const btn = screen.getByText("show");
  //   fireEvent.click(btn);
  //   expect(screen.getByText("Test Modal")).toBeInTheDocument();
  // });
// });
