import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme.ts";

import { resetCountersStepsDaily } from "./lib/resetCountersStepsDaily.ts";
resetCountersStepsDaily();

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const Route = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof Route;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={Route} />
    </ThemeProvider>
  </StrictMode>
);
