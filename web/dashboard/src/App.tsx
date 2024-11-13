import CssBaseline from "@mui/material/CssBaseline";

import "./index.css";
import AppTheme from "./utils/shared-theme/AppTheme";
import { AppProvider } from "@toolpad/core/react-router-dom";
import { Outlet } from "react-router-dom";
import { SignInPage, type Navigation } from "@toolpad/core";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthGuard from "./pages/auth/AuthGuard";

const queryClient = new QueryClient();

const NAVIGATION: Navigation = [
  {
    title: "Thống kê",
    icon: <DashboardIcon />,
  },
  {
    segment: "manage-account",
    title: "Quản lý tài khoản",
    icon: <ManageAccountsIcon />,
  },
];

const BRANDING = {
  logo: <img src="./assets/images/MealLogo.png" alt="logo" />,
  title: "Happy Food",
};

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <AppProvider navigation={NAVIGATION} branding={BRANDING}>
            <AuthGuard>
              <Outlet />
            </AuthGuard>
          </AppProvider>
        </AppTheme>
      </QueryClientProvider>
    </>
  );
}

export default App;
