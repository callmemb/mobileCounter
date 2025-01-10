import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "fake-indexeddb/auto";
import "@testing-library/jest-dom/vitest";

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
