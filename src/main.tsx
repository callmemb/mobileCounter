import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme.ts";

import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-700.css";
import SettingsManager from "./settingsManager/component.tsx";

export const Route = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof Route;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsManager />
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={Route} />
    </ThemeProvider>
  </StrictMode>
);
