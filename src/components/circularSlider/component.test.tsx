import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CircularSlider from "./component";
import "@testing-library/jest-dom/vitest";

describe("CircularSlider", () => {
  const defaultProps = {
    children: "test",
    onSubmit: () => {},
  };

  it("renders correctly", async () => {
    const { container } = await render(<CircularSlider {...defaultProps} />);
    const slider = container.getElementsByClassName("circularSlider");
    expect(slider.length).toBe(1);
  });

  it("displays label", async () => {
    await render(<CircularSlider {...defaultProps} />);
    const valueDisplay = screen.getByText("test");
    expect(valueDisplay).toBeInTheDocument();
  });

 
});
