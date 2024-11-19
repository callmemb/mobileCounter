import { Outlet, createRootRoute } from "@tanstack/react-router";
import RouteComponent from "./404";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <RouteComponent />,
});

function RootComponent() {
  return <Outlet />;
}
