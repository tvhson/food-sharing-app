import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/overview/Layout.tsx";
import DashboardPage from "./pages/overview/DashboardPage.tsx";
import AccountPage from "./pages/account/AccountPage.tsx";
import ErrorPage from "./pages/error/ErrorPage.tsx";

import SignIn from "./pages/sign-in/SignIn.tsx";
import { Provider } from "react-redux";
import { Store } from "./redux/Store.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    Component: App, // root layout route
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          {
            path: "",
            Component: DashboardPage,
          },
          {
            path: "manage-account",
            Component: AccountPage,
          },
        ],
      },
    ],
    ErrorBoundary: ErrorPage,
  },
  {
    Component: SignIn,
    path: "login",
    ErrorBoundary: ErrorPage,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={Store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
